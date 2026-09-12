import React from 'react';
import { LogOut, AlertTriangle, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';

export default function LogoutModal({ isOpen, onClose, onConfirmLogout }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terminate Security Operations Session"
      subtitle="Zero-Trust Session Invalidation"
      maxWidth="max-w-md"
    >
      <div className="space-y-6 font-sans text-xs text-slate-300">
        <div className="p-4 rounded-2xl bg-[#ff4050]/15 border border-[#ff4050]/30 flex items-start gap-3.5 text-slate-200">
          <AlertTriangle className="w-5 h-5 text-[#ff6b78] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans text-xs">
            Terminating your authenticated session will lock your active forensic workspace. You will need to re-authenticate with 2FA to inspect ongoing P0 incidents.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer font-bold text-xs"
          >
            Stay Signed In
          </button>

          <button
            onClick={() => {
              onConfirmLogout && onConfirmLogout();
            }}
            className="px-6 py-2.5 rounded-full bg-[#ff4050] hover:bg-[#e03040] text-white font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#ff4050]/20 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Confirm Log Out</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
