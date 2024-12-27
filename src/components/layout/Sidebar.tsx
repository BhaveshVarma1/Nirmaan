import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Lightbulb,
  Settings,
  Bot,
  Network,
} from 'lucide-react';

const Sidebar = () => {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
    { to: '/mindmap', icon: Network, label: 'Mind Map' },
    { to: '/ai-helper', icon: Bot, label: 'AI Helper' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="relative group w-10 h-10">
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg group-hover:bg-blue-500/30 transition-all duration-500" />
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
              <span className="text-lg font-bold text-white">N</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-200">NirmaanVerse</h1>
            <p className="text-xs text-slate-400">Personal Growth Platform</p>
          </div>
        </div>
      </div>

      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
