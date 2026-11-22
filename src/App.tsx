import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { AppShell, UpdateBanner } from './components/AppShell';
import { GlossarySheetProvider } from './components/GlossarySheet';
import { requestPersist } from './db/db';
import { LangProvider, useSettings } from './i18n/LangProvider';
import { TodayPage } from './features/today/TodayPage';
import { PracticePage } from './features/practice/PracticePage';
import { TopicPractice } from './features/practice/TopicPractice';
import { YieldPage } from './features/yield/YieldPage';
import { SignsPage } from './features/signs/SignsPage';
import { GlossaryPage } from './features/glossary/GlossaryPage';
import { ProgressPage } from './features/progress/ProgressPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { SetupWizard } from './features/settings/SetupWizard';
import { ReviewPage } from './features/review/ReviewPage';

function Routed() {
  const { settings, ready } = useSettings();
  useEffect(() => {
    void requestPersist();
  }, []);
  if (!ready) return null;
  if (!settings.onboarded)
    return (
      <>
        <UpdateBanner />
        <SetupWizard />
      </>
    );
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/topic/:ref" element={<TopicPractice />} />
        <Route path="/practice/yield" element={<YieldPage />} />
        <Route path="/practice/yield/:sceneId" element={<YieldPage />} />
        <Route path="/signs" element={<SignsPage />} />
        <Route path="/signs/:mode" element={<SignsPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  return (
    <HashRouter>
      <LangProvider>
        <GlossarySheetProvider>
          <Routed />
        </GlossarySheetProvider>
      </LangProvider>
    </HashRouter>
  );
}
