import { Upload, Sparkles, Wand2, Film, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepKey } from '@/lib/videoEnhancer';

const STEPS: { key: StepKey; label: string; Icon: typeof Upload }[] = [
  { key: 'uploading',  label: 'Uploading',  Icon: Upload },
  { key: 'analyzing',  label: 'Analyzing',  Icon: Sparkles },
  { key: 'enhancing',  label: 'Enhancing',  Icon: Wand2 },
  { key: 'rendering',  label: 'Rendering',  Icon: Film },
  { key: 'finalizing', label: 'Finalizing', Icon: CheckCircle2 },
];

interface Props {
  current: StepKey | null;
  overall: number;
}

export const StepTracker = ({ current, overall }: Props) => {
  const currentIndex = current ? STEPS.findIndex(s => s.key === current) : -1;

  return (
    <div className="w-full">
      {/* Mobile: vertical, Desktop: horizontal */}
      <div className="hidden md:flex items-start justify-between gap-2 relative">
        {/* Connector line */}
        <div className="absolute left-0 right-0 top-6 h-px bg-border -z-0" />
        <div
          className="absolute left-0 top-6 h-px bg-gradient-primary -z-0 transition-all duration-500"
          style={{ width: `${overall}%` }}
        />
        {STEPS.map((s, i) => {
          const done = i < currentIndex || overall >= 100;
          const active = i === currentIndex;
          return (
            <div key={s.key} className="flex flex-col items-center gap-2 relative z-10 flex-1">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  done && 'bg-primary border-primary text-primary-foreground',
                  active && 'bg-background border-primary text-primary animate-pulse-glow',
                  !done && !active && 'bg-secondary border-border text-muted-foreground',
                )}
              >
                <s.Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  'text-xs font-medium font-display uppercase tracking-wider',
                  (done || active) ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden flex flex-col gap-3">
        {STEPS.map((s, i) => {
          const done = i < currentIndex || overall >= 100;
          const active = i === currentIndex;
          return (
            <div key={s.key} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  done && 'bg-primary border-primary text-primary-foreground',
                  active && 'bg-background border-primary text-primary animate-pulse-glow',
                  !done && !active && 'bg-secondary border-border text-muted-foreground',
                )}
              >
                <s.Icon className="w-4 h-4" />
              </div>
              <span className={cn('text-sm font-display uppercase tracking-wider', (done || active) ? 'text-foreground' : 'text-muted-foreground')}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
