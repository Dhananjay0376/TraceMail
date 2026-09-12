import os
import json
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Request, HTTPException, Query
from fastapi.responses import RedirectResponse, HTMLResponse
try:
    from google_auth_oauthlib.flow import Flow
    from googleapiclient.discovery import build
    from google.oauth2.credentials import Credentials
except ImportError:
    Flow = None
    build = None
    Credentials = None
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from app.database import (
    save_monitored_mailbox,
    get_all_monitored_mailboxes,
    delete_monitored_mailbox
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/userinfo.email"
]

DEFAULT_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
DEFAULT_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")

def get_google_client_config() -> Dict[str, Any]:
    client_id = os.getenv("GOOGLE_CLIENT_ID") or DEFAULT_CLIENT_ID
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET") or DEFAULT_CLIENT_SECRET
    return {
        "web": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
        }
    }

def get_redirect_uri() -> str:
    return os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")

@router.get("/google/login")
def google_login():
    """Generates the OAuth consent URL and redirects the user's popup window to Google."""
    config = get_google_client_config()
    redirect_uri = get_redirect_uri()
    
    if Flow is not None:
        flow = Flow.from_client_config(
            config,
            scopes=SCOPES,
            redirect_uri=redirect_uri
        )
        auth_url, _ = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent"
        )
    else:
        import urllib.parse
        client_id = config.get("web", {}).get("client_id", "")
        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": " ".join(SCOPES),
            "access_type": "offline",
            "prompt": "consent"
        }
        auth_url = f"https://accounts.google.com/o/oauth2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(auth_url)

@router.get("/google/callback", response_class=HTMLResponse)
def google_callback(request: Request, code: Optional[str] = Query(None), error: Optional[str] = Query(None)):
    """Receives authorization code from Google, stores credentials, and closes the popup."""
    if error:
        return HTMLResponse(
            content=f"""
            <!DOCTYPE html>
            <html>
            <head><title>Authentication Failed</title></head>
            <body style="font-family:sans-serif; background:#0f172a; color:#f87171; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
              <div style="background:#1e293b; padding:24px; border-radius:12px; border:1px solid #ef4444; text-align:center;">
                <h2>Access Denied</h2>
                <p>Google OAuth error: {error}</p>
                <script>
                  if (window.opener) {{
                    window.opener.postMessage({{ type: 'OAUTH_ERROR', error: '{error}' }}, '*');
                  }}
                  setTimeout(() => window.close(), 3000);
                </script>
              </div>
            </body>
            </html>
            """,
            status_code=400
        )

    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code from Google.")

    config = get_google_client_config()
    redirect_uri = get_redirect_uri()

    try:
        flow = Flow.from_client_config(
            config,
            scopes=SCOPES,
            redirect_uri=redirect_uri
        )
        flow.fetch_token(code=code)
        credentials = flow.credentials

        # Fetch authenticated user's email address
        service = build("gmail", "v1", credentials=credentials)
        profile = service.users().getProfile(userId="me").execute()
        email_address = profile.get("emailAddress", "Unknown")

        # Serialize token for database persistence
        token_data = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes
        }
        token_json = json.dumps(token_data)

        # Save to SQLite database
        save_monitored_mailbox(email_address, token_json)

        # Register in active worker memory
        from app.mailbox_worker import register_monitored_mailbox
        register_monitored_mailbox(email_address, credentials)

        logger.info(f"Successfully registered and authorized Gmail mailbox: {email_address}")

        return HTMLResponse(
            content=f"""
            <!DOCTYPE html>
            <html>
            <head>
              <title>Mailbox Connected</title>
              <style>
                body {{
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  background-color: #020617;
                  color: #f8fafc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                }}
                .card {{
                  background-color: #0f172a;
                  border: 1px solid #1e293b;
                  padding: 32px;
                  border-radius: 16px;
                  text-align: center;
                  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
                  max-width: 380px;
                }}
                .badge {{
                  background: rgba(16, 185, 129, 0.15);
                  color: #34d399;
                  border: 1px solid rgba(16, 185, 129, 0.3);
                  padding: 4px 12px;
                  border-radius: 9999px;
                  font-size: 12px;
                  font-weight: 600;
                  display: inline-block;
                  margin-bottom: 16px;
                }}
                h2 {{ margin: 0 0 8px 0; color: #f1f5f9; }}
                p {{ color: #94a3b8; font-size: 14px; margin-bottom: 20px; word-break: break-all; }}
              </style>
            </head>
            <body>
              <div class="card">
                <div class="badge">&#10003; AUTHORIZED</div>
                <h2>Mailbox Connected</h2>
                <p>TraceMail is now actively monitoring: <strong>{email_address}</strong></p>
                <script>
                  if (window.opener) {{
                    window.opener.postMessage({{
                      type: 'OAUTH_SUCCESS',
                      email: '{email_address}',
                      status: 'connected'
                    }}, '*');
                  }}
                  setTimeout(() => {{
                    window.close();
                  }}, 1200);
                </script>
              </div>
            </body>
            </html>
            """
        )
    except Exception as e:
        logger.exception(f"Error during Google OAuth callback: {e}")
        return HTMLResponse(
            content=f"""
            <!DOCTYPE html>
            <html>
            <body style="background:#0f172a; color:#f87171; font-family:sans-serif; text-align:center; padding:40px;">
              <h2>Authentication Failed</h2>
              <p>{str(e)}</p>
            </body>
            </html>
            """,
            status_code=500
        )

@router.get("/status")
def get_mailbox_status():
    """Returns all currently registered monitored mailboxes."""
    mailboxes = get_all_monitored_mailboxes()
    return {
        "connected_count": len(mailboxes),
        "mailboxes": [
            {
                "email": m["email"],
                "status": m["status"],
                "connected_at": m["connected_at"],
                "last_synced_at": m["last_synced_at"]
            }
            for m in mailboxes
        ]
    }

@router.delete("/disconnect/{email}")
def disconnect_mailbox(email: str):
    """Disconnects and removes a monitored mailbox."""
    delete_monitored_mailbox(email)
    from app.mailbox_worker import unregister_monitored_mailbox
    unregister_monitored_mailbox(email)
    return {"status": "success", "message": f"Mailbox {email} disconnected."}
