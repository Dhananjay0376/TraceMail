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
import LogoutModal from './components/screens/LogoutModal';
import AmbientAura from './components/vfx/AmbientAura';
import { MOCK_SAMPLES } from './mock/mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [currentRole, setCurrentRole] = useState('analyst'); // 'analyst' | 'employee' | 'admin'
  const [selectedSample, setSelectedSample] = useState(MOCK_SAMPLES[0]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

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

  // Navigate when an option of the main menu is clicked
  // "only open the whole tab while get clicked on option of main menu"
  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
    if (!isSidebarPinned) {
      setIsSidebarOpen(false); // Close sidebar drawer so the whole tab opens full-screen
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
    // TODO: connect to backend API /api/analyze with real FormData
    const found = MOCK_SAMPLES.find((s) => s.id === sampleId) || MOCK_SAMPLES[0];
    setSelectedSample(found);
    setCurrentScreen('loading');
    if (!isSidebarPinned) setIsSidebarOpen(false);
  };

  // Action dispatch from Analysis Result
  const handleResultAction = (action) => {
    if (action === 'create_case') {
      setCurrentScreen('cases');
    } else if (action === 'export_pdf') {
      setCurrentScreen('report');
    }
  };

  // Auth success callback
  const handleAuthSuccess = (user) => {
    if (user.role) setCurrentRole(user.role);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans relative">
      {/* Redrob Ambient Lighting Aura & Tech Grid */}
      <AmbientAura />

      {/* Top Persistent Navigation Bar with Main Menu Button & Status */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        unreadAlertsCount={unreadAlerts}
        onOpenSubmit={() => handleNavigate('submit')}
        onOpenLogout={() => setIsLogoutOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
        />

        {/* Main Dynamic View Area: renders the selected whole tab */}
        <main
          className={`flex-1 min-w-0 transition-all duration-300 ${
            isSidebarPinned && isSidebarOpen ? 'lg:pl-72' : ''
          }`}
        >
          {/* 1. Landing Page */}
          {currentScreen === 'landing' && (
            <LandingScreen
              onStartAnalysis={() => handleNavigate('submit')}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenDashboard={() => handleNavigate('dashboard')}
            />
          )}

          {/* 3. Onboarding Screen */}
          {currentScreen === 'onboarding' && (
            <OnboardingScreen
              onCompleteOnboarding={() => handleNavigate('dashboard')}
              onSkip={() => handleNavigate('dashboard')}
            />
          )}

          {/* 4. Dashboard (Role-Aware: Employee vs Analyst) */}
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              currentRole={currentRole}
              onOpenSubmit={() => handleNavigate('submit')}
              onSelectSample={handleDirectInspect}
              onNavigate={handleNavigate}
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
            <CaseManagementScreen onSelectCaseForInspect={handleDirectInspect} />
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
          {currentScreen === 'settings' && <SettingsScreen currentRole={currentRole} />}

          {/* 13. Admin Panel (Admin-Only) */}
          {currentScreen === 'admin' && <AdminPanelScreen />}

          {/* 14. Documentation & FAQ */}
          {currentScreen === 'docs' && <DocumentationScreen />}
        </main>
      </div>

      {/* 2. Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 15. Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirmLogout={() => {
          setCurrentRole('employee');
          handleNavigate('landing');
        }}
      />
    </div>
  );
}
