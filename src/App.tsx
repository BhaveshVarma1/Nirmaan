import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskScheduler from '@/components/tasks/TaskScheduler';
import IdeaJournal from '@/components/ideas/IdeaJournal';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import useTaskStore from '@/lib/store/taskStore';
import { Task } from '@/types/task';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/lib/auth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
          <div className="max-w-md p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-slate-400 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Layout Component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const groups = useTaskStore((state) => state.groups);
  const updateTask = useTaskStore((state) => state.updateTask);

  // Flatten all tasks from all groups
  const allTasks = React.useMemo(() => 
    groups.flatMap((group) => group.tasks),
    [groups]
  );

  const handleTaskClick = React.useCallback((task: Task) => {
    const group = groups.find((g) => g.tasks.some((t) => t.id === task.id));
    if (group) {
      updateTask(group.id, task.id, { completed: !task.completed });
    }
  }, [groups, updateTask]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-50">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskBoard 
                        allTasks={allTasks} 
                        handleTaskClick={handleTaskClick}
                      />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskScheduler />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ideas"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <IdeaJournal />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-helper"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>AI Helper Coming Soon</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Settings Coming Soon</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Help & Documentation Coming Soon</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-300 mb-2">Page Not Found</h2>
                      <p className="text-slate-400">The page you're looking for doesn't exist.</p>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
