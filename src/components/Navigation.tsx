import { ShieldCheck, Factory, Waves, Ruler, BarChart3, UserCircle2 } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function Header({ currentScreen, onScreenChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-surface-container flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="text-primary">
          <Factory size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-extrabold text-primary font-headline tracking-tight">
          Kingsley EcoVal 2.0
        </h1>
      </div>

      <nav className="hidden md:flex gap-8">
        {[
          { id: 'PROJECT', label: 'Project' },
          { id: 'PROCESS', label: 'Process' },
          { id: 'SIZING', label: 'Sizing' },
          { id: 'RESULTS', label: 'Results' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id as Screen)}
            className={`font-headline font-bold text-sm tracking-tight py-1 transition-colors ${
              currentScreen === item.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
        <UserCircle2 size={24} />
      </div>
    </header>
  );
}

interface BottomNavProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const navItems = [
    { id: 'PROJECT', label: 'Project', icon: ShieldCheck },
    { id: 'PROCESS', label: 'Process', icon: Waves },
    { id: 'SIZING', label: 'Sizing', icon: Ruler },
    { id: 'RESULTS', label: 'Results', icon: BarChart3 },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface border-t border-outline-variant/20 flex justify-around items-center px-4 z-50 shadow-[0_-8px_24px_rgba(7,30,39,0.06)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive
                ? 'bg-surface-container-highest text-primary'
                : 'text-on-surface-variant'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
