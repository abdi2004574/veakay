import { Routes, Route, Navigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/constants';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/features/auth/components/LoginPage';
import TwoFactorPage from '@/features/auth/components/TwoFactorPage';
import ForgotPasswordPage from '@/features/auth/components/ForgotPasswordPage';
import DashboardPage from '@/features/dashboard/components/DashboardPage';
import UsersPage from '@/features/users/components/UsersPage';
import AgenciesPage from '@/features/agencies/components/AgenciesPage';
import CampaignsPage from '@/features/campaigns/components/CampaignsPage';
import PaymentsPage from '@/features/payments/components/PaymentsPage';
import ContentPage from '@/features/content/components/ContentPage';
import NotificationsPage from '@/features/notifications/components/NotificationsPage';
import AuditPage from '@/features/audit/components/AuditPage';
import SettingsPage from '@/features/settings/components/SettingsPage';
import NotFoundPage from '@/components/shared/NotFoundPage';

function ProtectedLayout() {
  useRequireAuth();
  return <AppShell />;
}

function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.TWO_FACTOR} element={<TwoFactorPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.USERS} element={<UsersPage />} />
        <Route path={ROUTES.AGENCIES} element={<AgenciesPage />} />
        <Route path={ROUTES.CAMPAIGNS} element={<CampaignsPage />} />
        <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
        <Route path={ROUTES.CONTENT} element={<ContentPage />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path={ROUTES.AUDIT} element={<AuditPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
