import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SiteHeader = () => {
  const { pathname } = useLocation();
  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        pathname === to ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {label}
    </Link>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center neon-border">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-black text-xl tracking-wider">NEON<span className="text-primary">FRAME</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {link('/', 'Enhancer')}
          {link('/privacy', 'Privacy')}
          {link('/terms', 'Terms')}
          {link('/dmca', 'DMCA')}
        </nav>
      </div>
    </header>
  );
};
