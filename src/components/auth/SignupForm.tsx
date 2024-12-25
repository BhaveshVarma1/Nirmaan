import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, Github, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData?.user) {
        // 2. Create user profile
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            full_name: name,
          },
        ]);

        if (profileError) throw profileError;

        navigate('/');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('GitHub signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to signup with GitHub');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Google signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to signup with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C0F] flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[40vh] -left-[20vw] w-[80vw] h-[80vh] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40vh] -right-[20vw] w-[80vw] h-[80vh] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Signup Container */}
      <div className="relative w-full max-w-md p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
        <div className="relative backdrop-blur-xl bg-slate-900/50 rounded-2xl p-8 border border-slate-700/30 shadow-2xl space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="relative group w-16 h-16 mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500" />
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Join NirmaanVerse
            </h2>
            <p className="text-slate-400 text-sm">
              Create your account to start building
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-white rounded-xl
                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  required
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-white rounded-xl
                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-white rounded-xl
                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  required
                  minLength={6}
                />
                <p className="text-xs text-slate-400 mt-1 ml-1">
                  Must be at least 6 characters long
                </p>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-slate-700 bg-slate-800/50"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-400">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500 text-white shadow-lg transition-all duration-300
                hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-8 group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                <span>Create Account</span>
              </div>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/50 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGithubSignup}
              className="w-full relative group overflow-hidden rounded-xl bg-slate-800/50 border-slate-700/50 
                hover:bg-slate-700/50 text-white shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-8 group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </div>
            </Button>

            <div className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm; 