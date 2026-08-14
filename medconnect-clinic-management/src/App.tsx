import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { ToastProvider } from '@/lib/toast';
import { AuthScreen } from '@/components/AuthScreen';
import { AppShell, type View } from '@/components/AppShell';
import { Dashboard } from '@/components/Dashboard';
import { Patients } from '@/components/Patients';
import { Appointments } from '@/components/Appointments';
import { VideoConsultations } from '@/components/VideoConsultations';
import { IntakeForms } from '@/components/IntakeForms';
import { Prescriptions } from '@/components/Prescriptions';
import { StaffRota } from '@/components/StaffRota';
import { Spinner } from '@/components/ui';

function AppContent() {
  const { user, staff, loading } = useAuth();
  const [view, setView] = useState<View>('dashboard');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-50">
        <Spinner className="h-8 w-8 text-brand-500" />
      </div>
    );
  }

  if (!user || !staff) {
    return <AuthScreen />;
  }

  return (
    <AppShell view={view} setView={setView}>
      {view === 'dashboard' && <Dashboard setView={setView} />}
      {view === 'patients' && <Patients />}
      {view === 'appointments' && <Appointments />}
      {view === 'video' && <VideoConsultations />}
      {view === 'intake' && <IntakeForms />}
      {view === 'prescriptions' && <Prescriptions />}
      {view === 'rota' && <StaffRota />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
