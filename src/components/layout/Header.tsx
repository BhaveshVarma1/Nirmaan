import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import teachings from '@/data/teachings.json';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState<{ text: string; author: string }>();

  useEffect(() => {
    // Set initial random quote
    const randomQuote = teachings.quotes[Math.floor(Math.random() * teachings.quotes.length)];
    setCurrentQuote(randomQuote);

    // Change quote every 30 seconds
    const interval = setInterval(() => {
      const newQuote = teachings.quotes[Math.floor(Math.random() * teachings.quotes.length)];
      setCurrentQuote(newQuote);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-200">NirmaanVerse</h1>
          {currentQuote && (
            <div className="hidden md:flex items-center gap-3 pl-6 text-slate-400">
              <Quote className="h-4 w-4 text-blue-400" />
              <p className="text-sm">
                {currentQuote.text}{' '}
                <span className="text-slate-500">- {currentQuote.author}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-slate-300">{user.user_metadata.full_name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-slate-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 