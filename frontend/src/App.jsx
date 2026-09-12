import React, { useState, useEffect } from 'react';
import Navbar from './components/navigation/Navbar';
import Sidebar from './components/navigation/Sidebar';
import LandingScreen from './components/screens/LandingScreen';
import AuthModal from './components/screens/AuthModal';
import OnboardingScreen from './components/screens/OnboardingScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import SubmitEmailScreen from './components/screens/SubmitEmailScreen';
import LoadingScreen from './components/screens/LoadingScreen';
import AnalysisResultScreen from './components/screens/AnalysisResultScreen';
import CaseManagementScreen from './components/screens/CaseManagementScreen';
import AlertsCenterScreen from './components/screens/AlertsCenterScreen';
import SearchHistoryScreen from './components/screens/SearchHistoryScreen';
import ForensicReportScreen from './components/screens/ForensicReportScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import AdminPanelScreen from './components/screens/AdminPanelScreen';
import DocumentationScreen from './components/screens/DocumentationScreen';
import OAuthConsentScreen from './components/screens/OAuthConsentScreen';
import LogoutModal from './components/screens/LogoutModal';
import NotFoundScreen from './components/screens/NotFoundScreen';
import AmbientAura from './components/vfx/AmbientAura';
import { MOCK_SAMPLES, MOCK_CASES, MOCK_ALERTS, DEMO_USER, Demo_User } from './mock/mockData';
import { CheckCircle2, X } from 'lucide-react';
import { supabase, getCurrentUser, signOutUser, toTraceMailUser } from './lib/supabase';

// Hash ↔ screen mapping
const HASH_TO_SCREEN = {
  '#home': 'landing',
  '#landing': 'landing',
  '#dashboard': 'dashboard',
  '#dashboard/oauth/consent': 'oauth_consent',
  '#oauth/consent': 'oauth_consent',
  '#submit': 'submit',
  '#loading': 'loading',
  '#result': 'result',
  '#cases': 'cases',
  '#alerts': 'alerts',
  '#search': 'search',
  '#report': 'report',
  '#settings': 'settings',
  '#admin': 'admin',
  '#docs': 'docs',
  '#onboarding': 'onboarding',
};

const SCREEN_TO_HASH = {
  landing: '#home',
  dashboard: '#dashboard',
  oauth_consent: '#dashboard/oauth/consent',
  submit: '#submit',
  loading: '#loading',
  result: '#result',
  cases: '#cases',
  alerts: '#alerts',
  search: '#search',
  report: '#report',
  settings: '#settings',
  admin: '#admin',
  docs: '#docs',
  onboarding: '#onboarding',
};

export default function App() {
  // Determine initial screen from URL hash or OAuth callback parameters
  const getInitialScreen = () => {
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (hash.includes('access_token') || hash.includes('code=') || search.includes('code=')) {
      return 'dashboard';
    }
    return HASH_TO_SCREEN[hash] || 'landing';
  };

  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const [currentRole, setCurrentRole] = useState('analyst');
  const [currentUser, setCurrentUser] = useState(null); // null = not logged in (shows Login/Signup in Navbar)
  const [cases, setCases] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedSample, setSelectedSample] = useState(MOCK_SAMPLES[0]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [invalidRoute, setInvalidRoute] = useState('');

  // Force update document.title to TraceMail on app mount
  useEffect(() => {
    document.title = "TraceMail | AI Email Forensics & Origin Traceability";
  }, []);

  // Sync URL hash → screen when browser back/forward is used
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash || hash === '#') {
        setCurrentScreen('landing');
        return;
      }
      const screen = HASH_TO_SCREEN[hash];
      if (screen) {
        setCurrentScreen(screen);
        setInvalidRoute('');
      } else {
        setInvalidRoute(hash);
        setCurrentScreen('notfound');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync screen → URL hash when screen changes programmatically
  useEffect(() => {
    const targetHash = SCREEN_TO_HASH[currentScreen];
    if (targetHash && window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
    if (['dashboard', 'submit', 'cases', 'alerts', 'search', 'report', 'settings'].includes(currentScreen)) {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
        setIsSidebarPinned(true);
      }
    }
  }, [currentScreen]);

  // Helper to load user profile and data
  const loadUserData = (user) => {
    if (!user) {
      setCurrentUser(null);
      setCases([]);
      setAlerts([]);
      setUnreadAlerts(0);
      return;
    }
    setCurrentUser(user);
    if (user.role) setCurrentRole(user.role);

    if (user.isDemo) {
      setCases(MOCK_CASES);
      setAlerts(MOCK_ALERTS);
      setUnreadAlerts(3);
      return;
    }

    try {
      const storageKeyCases = `tracemail_cases_${user.id}`;
      const storageKeyAlerts = `tracemail_alerts_${user.id}`;

      const savedCases = localStorage.getItem(storageKeyCases);
      setCases(savedCases !== null ? JSON.parse(savedCases) : []);

      const savedAlerts = localStorage.getItem(storageKeyAlerts);
      if (savedAlerts !== null) {
        const parsed = JSON.parse(savedAlerts);
        setAlerts(parsed);
        setUnreadAlerts(parsed.length);
      } else {
        setAlerts([]);
        setUnreadAlerts(0);
      }
    } catch (e) {
      console.warn('Failed loading user data:', e);
    }
  };

  // Handle Supabase Auth Session & OAuth redirect listener
  useEffect(() => {
    const isOAuthRedirect =
      window.location.href.includes('code=') ||
      window.location.href.includes('access_token=') ||
      window.location.hash.includes('access_token');

    // On mount, eagerly restore session from Supabase before auth events fire
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = toTraceMailUser(session.user);
        if (user) {
          loadUserData(user);
          const hash = window.location.hash.toLowerCase();
          const currentTab = HASH_TO_SCREEN[hash];
          if ((isOAuthRedirect || currentTab === 'landing') && !currentTab) {
            setCurrentScreen('onboarding');
          } else if (currentTab && currentTab !== 'landing') {
            setCurrentScreen(currentTab);
          }
        }
      } else {
        // No active session — show DEMO_USER on landing
        loadUserData(DEMO_USER);
      }
    }).catch(() => loadUserData(DEMO_USER));

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        sessionStorage.removeItem('tracemail_google_auth_intent');
        try {
          const user = toTraceMailUser(session.user);
          if (user) {
            loadUserData(user);
            const hash = window.location.hash.toLowerCase();
            const currentTab = HASH_TO_SCREEN[hash] || 'landing';
            if (event === 'SIGNED_IN' || isOAuthRedirect || currentTab === 'landing') {
              setCurrentScreen('onboarding');
              showToast(`Signed in successfully! Organization Setup Wizard loaded.`);
            }
          }
        } catch (err) {
          console.warn('Error processing auth state change:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        loadUserData(DEMO_USER);
      } else {
        // Preserve active user from local storage on null session state events
        try {
          const storedUser = await getCurrentUser();
          if (storedUser && !storedUser.isDemo) {
            loadUserData(storedUser);
          }
        } catch (_) {}
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);


  // Close sidebar on Escape key if open and not pinned
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSidebarOpen && !isSidebarPinned) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, isSidebarPinned]);

  // Toast notification auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Navigate when an option of the main menu is clicked
  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
    if (!isSidebarPinned) {
      setIsSidebarOpen(false);
    }
  };

  // Switch sample email and run simulated scan
  const handleSelectSampleAndAnalyze = (sampleId) => {
    const found = MOCK_SAMPLES.find((s) => s.id === sampleId) || MOCK_SAMPLES[0];
    setSelectedSample(found);
    setCurrentScreen('loading');
    if (!isSidebarPinned) setIsSidebarOpen(false);
  };

  // Direct inspect without loading
  const handleDirectInspect = (sampleId) => {
    const found = MOCK_SAMPLES.find((s) => s.id === sampleId) || MOCK_SAMPLES[0];
    setSelectedSample(found);
    setCurrentScreen('result');
    if (!isSidebarPinned) setIsSidebarOpen(false);
  };

  // Upload or raw text analysis submission
  const handleAnalyzeSubmission = ({ sampleId }) => {
    const found = MOCK_SAMPLES.find((s) => s.id === sampleId) || MOCK_SAMPLES[0];
    setSelectedSample(found);
    setCurrentScreen('loading');
    if (!isSidebarPinned) setIsSidebarOpen(false);
  };

  // Action dispatch from Analysis Result
  const handleResultAction = (action) => {
    if (action === 'create_case') {
      handleCreateCaseFromSample(selectedSample);
    } else if (action === 'export_pdf') {
      setCurrentScreen('report');
    }
  };

  // Dynamically create a case from an analyzed email sample
  const handleCreateCaseFromSample = (sample) => {
    const newCaseId = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
    const authorName = currentUser?.name || 'Lead Analyst';
    const newCase = {
      id: newCaseId,
      title: sample.subject || 'Executive Wire Threat Investigation',
      severity: sample.riskScore >= 80 ? 'critical' : sample.riskScore >= 60 ? 'high' : 'medium',
      riskScore: sample.riskScore || 92,
      status: 'new',
      sender: sample.sender,
      threatActor: sample.correlation?.threatActor || 'Unknown BEC Threat Cluster',
      summary: sample.plainEnglishSummary || 'Suspicious inbound email intercepted by security sentinel.',
      origin: sample.geo ? `${sample.geo.city}, ${sample.geo.country}` : 'Global Network',
      assignedTo: `${authorName} (Lead Analyst)`,
      linkedEmailsCount: 1,
      sampleId: sample.id,
      indicators: [
        sample.geo?.originIp,
        sample.domainIntel?.registeredDomain,
        sample.replyTo,
      ].filter(Boolean),
      timeline: [
        {
          time: 'Just now',
          author: `${authorName} (SOC Analyst)`,
          text: `Opened incident case from analyzed email "${sample.subject}". Threat score: ${sample.riskScore}/100.`,
        },
      ],
    };

    setCases((prev) => {
      const updated = [newCase, ...prev];
      if (currentUser?.id) {
        try {
          localStorage.setItem(`tracemail_cases_${currentUser.id}`, JSON.stringify(updated));
        } catch (_) { }
      }
      return updated;
    });
    showToast(`Case ${newCaseId} successfully opened in Case Queue (New / Triage)!`);
    setCurrentScreen('cases');
    if (!isSidebarPinned) setIsSidebarOpen(false);
  };

  // Auth success callback - directly open Organization Setup Wizard ('onboarding')
  const handleAuthSuccess = (user) => {
    loadUserData(user);
    setCurrentScreen('onboarding');
    showToast(`Signed in successfully! Organization Setup Wizard loaded.`);
  };

  // Onboarding completion
  const handleCompleteOnboarding = (orgData) => {
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        org: orgData.orgName || prev?.org,
        domain: orgData.domain || prev?.domain,
        connectedMailbox: orgData.connectedMailbox || prev?.connectedMailbox,
        isFirstTime: false,
      };
      try {
        if (prev?.id) {
          localStorage.setItem(`tracemail_user_${prev.id}`, JSON.stringify(updated));
        }
      } catch (_) {}
      return updated;
    });
    setCurrentScreen('dashboard');
    showToast('Perimeter setup completed! Your security workspace is active.');
  };

  return (
    <div className="min-h-screen bg-[#061B2E] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Redrob Ambient Lighting Aura & Tech Grid */}
      <AmbientAura />

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-[#0b1026] border border-redrob-blue text-white text-xs font-mono shadow-redrob-glow flex items-center justify-between gap-3 animate-fade-in max-w-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-redrob-aqua shrink-0" />
            <span className="font-bold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Persistent Navigation Bar with Main Menu Button & Status */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        unreadAlertsCount={unreadAlerts}
        onOpenSubmit={() => handleNavigate('submit')}
        onOpenLogout={() => setIsLogoutOpen(true)}
        onOpenLogin={() => { setAuthMode('login'); setIsAuthOpen(true); }}
        onOpenSignUp={() => { setAuthMode('signup'); setIsAuthOpen(true); }}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentUser={currentUser}
      />

      <div className="flex-1 flex relative z-10 pt-16">
        {/* Left-Hand Side Navigation Sidebar (Shifted clickable options) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isPinned={isSidebarPinned}
          onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          unreadAlertsCount={unreadAlerts}
          onOpenSubmit={() => handleNavigate('submit')}
          onOpenLogout={() => setIsLogoutOpen(true)}
          currentUser={currentUser}
        />

        {/* Main Dynamic View Area: renders the selected whole tab */}
        <main
          className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarPinned && isSidebarOpen ? 'lg:pl-72' : ''
            }`}
        >
          {/* 1. Landing Page */}
          {currentScreen === 'landing' && (
            <LandingScreen
              onStartAnalysis={() => handleNavigate('submit')}
              onOpenAuth={(mode = 'login') => {
                setAuthMode(mode);
                setIsAuthOpen(true);
              }}
              onOpenLogin={() => {
                setAuthMode('login');
                setIsAuthOpen(true);
              }}
              onOpenSignUp={() => {
                setAuthMode('signup');
                setIsAuthOpen(true);
              }}
              onRequestDemo={() => {
                setAuthMode('demo');
                setIsAuthOpen(true);
              }}
              onOpenDashboard={() => handleNavigate('dashboard')}
            />
          )}

          {/* 3. Onboarding Screen */}
          {currentScreen === 'onboarding' && (
            <OnboardingScreen
              onCompleteOnboarding={handleCompleteOnboarding}
              onSkip={() => {
                setCurrentUser((prev) => ({ ...prev, isFirstTime: false }));
                handleNavigate('dashboard');
              }}
              currentUser={currentUser}
            />
          )}

          {/* 4. Dashboard (Role-Aware: Employee vs Analyst) */}
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              currentRole={currentRole}
              currentUser={currentUser}
              isFirstTime={currentUser?.isFirstTime || false}
              cases={cases}
              alerts={alerts}
              onOpenSubmit={() => handleNavigate('submit')}
              onSelectSample={handleDirectInspect}
              onNavigate={handleNavigate}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          )}

          {/* 5. Submit Email Screen */}
          {currentScreen === 'submit' && (
            <SubmitEmailScreen
              onAnalyze={handleAnalyzeSubmission}
              onSelectSample={handleSelectSampleAndAnalyze}
            />
          )}

          {/* 6. Loading / Analysis In-Progress Screen */}
          {currentScreen === 'loading' && (
            <LoadingScreen onComplete={() => setCurrentScreen('result')} />
          )}

          {/* 7. Analysis Result Page */}
          {currentScreen === 'result' && (
            <AnalysisResultScreen
              sample={selectedSample}
              currentRole={currentRole}
              onActionTrigger={handleResultAction}
              onOpenCase={() => handleNavigate('cases')}
            />
          )}

          {/* 8. Case Management Screen */}
          {currentScreen === 'cases' && (
            <CaseManagementScreen
              cases={cases}
              onUpdateCases={setCases}
              onSelectCaseForInspect={handleDirectInspect}
            />
          )}

          {/* 9. Alerts Center */}
          {currentScreen === 'alerts' && (
            <AlertsCenterScreen
              onSelectSample={(sampleId) => {
                handleDirectInspect(sampleId);
                setUnreadAlerts(Math.max(0, unreadAlerts - 1));
              }}
            />
          )}

          {/* 10. Search & Archive */}
          {currentScreen === 'search' && (
            <SearchHistoryScreen onSelectSample={handleDirectInspect} />
          )}

          {/* 11. Forensic Report Screen (PDF preview) */}
          {currentScreen === 'report' && <ForensicReportScreen sample={selectedSample} />}

          {/* 12. Settings Screen */}
          {currentScreen === 'settings' && <SettingsScreen currentRole={currentRole} currentUser={currentUser} />}

          {/* 13. Admin Panel (Admin-Only) */}
          {currentScreen === 'admin' && <AdminPanelScreen />}

          {/* 14. Documentation & FAQ */}
          {currentScreen === 'docs' && <DocumentationScreen />}

          {/* 15. OAuth Authorization / Consent Screen */}
          {currentScreen === 'oauth_consent' && (
            <OAuthConsentScreen currentUser={currentUser} onNavigate={handleNavigate} />
          )}

          {/* 404 Not Found */}
          {currentScreen === 'notfound' && (
            <NotFoundScreen
              invalidRoute={invalidRoute}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* 2. Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 15. Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirmLogout={async () => {
          try {
            await signOutUser();
          } catch (err) {
            console.warn('Logout error:', err);
          }
          try { localStorage.removeItem('tracemail_active_user'); } catch (_) { }
          setCurrentRole('analyst');
          setCurrentUser(null);
          setCases([]);
          setAlerts([]);
          setUnreadAlerts(0);
          setIsLogoutOpen(false);
          handleNavigate('landing');
          showToast('Logged out successfully.');
        }}
      />
    </div>
  );
}
