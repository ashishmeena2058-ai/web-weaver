import { useRef, useState, useEffect } from 'react';

interface Props {
  beforeUrl: string;
  afterUrl: string;
}

export const BeforeAfterPlayer = ({ beforeUrl, afterUrl }: Props) => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);

  // Sync playback
  useEffect(() => {
    const a = beforeRef.current;
    const b = afterRef.current;
    if (!a || !b) return;
    const sync = () => {
      if (Math.abs(a.currentTime - b.currentTime) > 0.1) b.currentTime = a.currentTime;
    };
    a.addEventListener('timeupdate', sync);
    a.addEventListener('play', () => b.play().catch(() => {}));
    a.addEventListener('pause', () => b.pause());
    return () => a.removeEventListener('timeupdate', sync);
  }, [beforeUrl, afterUrl]);

  const updatePos = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden glass select-none cursor-ew-resize"
      onMouseMove={(e) => dragging && updatePos(e.clientX)}
      onMouseDown={(e) => { setDragging(true); updatePos(e.clientX); }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => updatePos(e.touches[0].clientX)}
    >
      <video
        ref={beforeRef}
        src={beforeUrl}
        className="absolute inset-0 w-full h-full object-contain bg-black"
        controls
        playsInline
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <video
          ref={afterRef}
          src={afterUrl}
          className="w-full h-full object-contain bg-black"
          muted
          playsInline
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
        style={{ left: `${pos}%`, boxShadow: '0 0 20px hsl(var(--primary))' }}
      />
      <div
        className="absolute w-10 h-10 rounded-full bg-primary border-2 border-primary-foreground flex items-center justify-center pointer-events-none animate-pulse-glow"
        style={{ left: `${pos}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <span className="text-primary-foreground text-xs font-bold">⇔</span>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-background/80 backdrop-blur text-xs font-display uppercase tracking-wider text-muted-foreground">
        Before
      </div>
      <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-display uppercase tracking-wider">
        After · AI
      </div>
    </div>
  );
};
