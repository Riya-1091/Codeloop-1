import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import Workflow from '@/components/Workflow';
import FeatureShowcase from '@/components/FeatureShowcase';
import Vision from '@/components/Vision';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

import { ProtectedRoute, AdminRoute, InstructorRoute, PublicOnlyRoute } from '@/components/routes/Guards';
import { AppShell } from '@/components/app/AppShell';
import { AdminShell } from '@/components/admin/AdminShell';
import { InstructorShell } from '@/components/instructor/InstructorShell';

import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Problems from '@/pages/Problems';
import AddProblem from '@/pages/AddProblem';
import ProblemDetails from '@/pages/ProblemDetails';
import Revision from '@/pages/Revision';
import GitHub from '@/pages/GitHub';
import Showcase from '@/pages/Showcase';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import SearchPage from '@/pages/SearchPage';
import Help from '@/pages/Help';
import About from '@/pages/About';
import Extension from '@/pages/Extension';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';
import Upgrade from '@/pages/Upgrade';
import Contact from '@/pages/Contact';

function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-950 text-ink-primary antialiased">
      <Navbar />
      <main className="pt-14">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminInstructors from '@/pages/admin/AdminInstructors';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminProblems from '@/pages/admin/AdminProblems';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';

import InstructorDashboard from '@/pages/instructor/InstructorDashboard';
import ClassList from '@/pages/instructor/ClassList';
import ClassOverview from '@/pages/instructor/ClassOverview';
import ClassStudents from '@/pages/instructor/ClassStudents';
import StudentDetail from '@/pages/instructor/StudentDetail';
import ClassAnalytics from '@/pages/instructor/ClassAnalytics';
import ClassActivity from '@/pages/instructor/ClassActivity';
import ClassLeaderboard from '@/pages/instructor/ClassLeaderboard';
import InstructorAnalytics from '@/pages/instructor/InstructorAnalytics';
import InstructorActivity from '@/pages/instructor/InstructorActivity';

function Landing() {
  return (
    <div className="min-h-screen bg-base-950 text-ink-primary antialiased">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <Workflow />
        <FeatureShowcase />
        <Vision />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/about" element={<PublicPage><About /></PublicPage>} />
      <Route path="/extension" element={<PublicPage><Extension /></PublicPage>} />
      <Route path="/contact" element={<PublicPage><Contact /></PublicPage>} />

      {/* Authenticated user routes */}
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
      <Route path="/problems" element={<ProtectedRoute><AppShell><Problems /></AppShell></ProtectedRoute>} />
      <Route path="/problems/new" element={<ProtectedRoute><AppShell><AddProblem /></AppShell></ProtectedRoute>} />
      <Route path="/problems/:id" element={<ProtectedRoute><AppShell><ProblemDetails /></AppShell></ProtectedRoute>} />
      <Route path="/revision" element={<ProtectedRoute><AppShell><Revision /></AppShell></ProtectedRoute>} />
      <Route path="/github" element={<ProtectedRoute><AppShell><GitHub /></AppShell></ProtectedRoute>} />
      <Route path="/showcase" element={<ProtectedRoute><AppShell><Showcase /></AppShell></ProtectedRoute>} />
      <Route path="/upgrade" element={<ProtectedRoute><AppShell><Upgrade /></AppShell></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppShell><Analytics /></AppShell></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppShell><Profile /></AppShell></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppShell><Settings /></AppShell></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><AppShell><SearchPage /></AppShell></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><AppShell><Help /></AppShell></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminShell><AdminDashboard /></AdminShell></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminShell><AdminUsers /></AdminShell></AdminRoute>} />
      <Route path="/admin/messages" element={<AdminRoute><AdminShell><AdminMessages /></AdminShell></AdminRoute>} />
      <Route path="/admin/instructors" element={<AdminRoute><AdminShell><AdminInstructors /></AdminShell></AdminRoute>} />
      <Route path="/admin/problems" element={<AdminRoute><AdminShell><AdminProblems /></AdminShell></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminShell><AdminAnalytics /></AdminShell></AdminRoute>} />
      <Route path="/admin/audit-logs" element={<AdminRoute><AdminShell><AdminAuditLogs /></AdminShell></AdminRoute>} />

      {/* Instructor routes */}
      <Route path="/instructor" element={<InstructorRoute><InstructorShell><InstructorDashboard /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/classes" element={<InstructorRoute><InstructorShell><ClassList /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/analytics" element={<InstructorRoute><InstructorShell><InstructorAnalytics /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/activity" element={<InstructorRoute><InstructorShell><InstructorActivity /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/classes/:classId" element={<InstructorRoute><InstructorShell><ClassOverview /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/classes/:classId/students" element={<InstructorRoute><InstructorShell><ClassStudents /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/classes/:classId/students/:studentId" element={<InstructorRoute><InstructorShell><StudentDetail /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/classes/:classId/analytics" element={<InstructorRoute><InstructorShell><ClassAnalytics /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/classes/:classId/activity" element={<InstructorRoute><InstructorShell><ClassActivity /></InstructorShell></InstructorRoute>} />
      <Route path="/instructor/classes/:classId/leaderboard" element={<InstructorRoute><InstructorShell><ClassLeaderboard /></InstructorShell></InstructorRoute>} />

      {/* Fallback */}
      <Route path="/terms" element={<PublicPage><Terms /></PublicPage>} />
      <Route path="/privacy" element={<PublicPage><Privacy /></PublicPage>} />
      <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
