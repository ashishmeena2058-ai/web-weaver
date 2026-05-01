import { useCallback, useRef, useState } from 'react';
import { Upload, Download, Sparkles, Shield, Zap, Cpu, Film, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StepTracker } from '@/components/StepTracker';
import { BeforeAfterPlayer } from '@/components/BeforeAfterPlayer';
import { enhanceVideo, type StepKey, type ProgressEvent } from '@/lib/videoEnhancer';

const MAX_BYTES = 600 * 1024 * 1024; // 600 MB

const Index = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [scale, setScale] = useState<2 | 4>(2);
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (f: File | null | undefined) => {
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      toast({ title: 'Invalid file', description: 'Please select a video file.', variant: 'destructive' });
      return;
    }
    if (f.size > MAX_BYTES) {
      toast({ title: 'File too large', description: 'Maximum supported size is 600 MB.', variant: 'destructive' });
      return;
    }
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setResultUrl(null);
    setResultBlob(null);
    setProgress(null);
    setError(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onPick(e.dataTransfer.files?.[0]);
  }, []);

  const start = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress({ step: 'uploading', percent: 0, overall: 0, engine: 'replicate' });
    try {
      const res = await enhanceVideo(file, {
        scale,
        preferEngine: 'auto',
        onProgress: setProgress,
      });
      setResultUrl(res.url);
      setResultBlob(res.blob);
      toast({
        title: 'Enhancement complete',
        description: `Engine used: ${res.engineUsed === 'replicate' ? 'AI (Real-ESRGAN)' : 'Local (ffmpeg)'}`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      toast({ title: 'Enhancement failed', description: msg, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!resultBlob || !file) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(resultBlob);
    a.download = file.name.replace(/\.[^.]+$/, '') + '_enhanced.mp4';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="container relative pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-display uppercase tracking-wider">AI Video Enhancement</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl mb-5 glow-text">
            Enhance Video to <span className="text-primary">4K Ultra HD</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Real-ESRGAN AI upscaling, edge-aware sharpening, and cinematic color grading — all running on your browser.
            No login. No credits. No watermark.
          </p>
        </div>
      </section>

      {/* Workspace */}
      <section className="container pb-16 flex-1">
        <Card className="glass p-6 md:p-10 relative overflow-hidden scanline">
          {/* Step tracker */}
          <div className="mb-10">
            <StepTracker current={progress?.step ?? null} overall={progress?.overall ?? 0} />
            {progress && (
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {progress.message ?? `${progress.step}…`}
                </span>
                <span className="font-mono font-bold text-primary">
                  {progress.overall.toFixed(0)}%
                </span>
              </div>
            )}
          </div>

          {/* Upload area or before/after */}
          {!resultUrl && (
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !busy && inputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-10 md:p-16 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => onPick(e.target.files?.[0])}
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl mb-2">
                {file ? file.name : 'Drop your video here'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(1)} MB · click to replace`
                  : 'or click to browse · max 600 MB · MP4 / MOV / WEBM'}
              </p>
            </div>
          )}

          {resultUrl && originalUrl && (
            <div className="space-y-4">
              <BeforeAfterPlayer beforeUrl={originalUrl} afterUrl={resultUrl} />
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={download} size="lg" className="bg-gradient-primary hover:opacity-90 neon-border">
                  <Download className="w-4 h-4 mr-2" /> Download Enhanced Video
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => { setFile(null); setOriginalUrl(null); setResultUrl(null); setResultBlob(null); setProgress(null); }}
                >
                  Enhance Another
                </Button>
              </div>
            </div>
          )}

          {/* Controls */}
          {file && !resultUrl && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 items-end">
              <div>
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2 block">
                  Output Resolution
                </label>
                <div className="flex gap-2">
                  {([2, 4] as const).map(s => (
                    <button
                      key={s}
                      disabled={busy}
                      onClick={() => setScale(s)}
                      className={`flex-1 py-3 rounded-lg border-2 font-display transition-all ${
                        scale === s
                          ? 'border-primary bg-primary/10 text-primary neon-border'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {s}× <span className="text-xs opacity-70">{s === 2 ? '(2K)' : '(4K)'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Button
                size="lg"
                disabled={busy}
                onClick={start}
                className="bg-gradient-primary hover:opacity-90 neon-border h-14 text-base font-display uppercase tracking-wider"
              >
                {busy ? (
                  <>Processing… {progress?.overall.toFixed(0) ?? 0}%</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Enhance with AI</>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-lg border border-destructive/40 bg-destructive/10">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Enhancement error</p>
                <p className="text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {[
            { Icon: Cpu, title: 'Real-ESRGAN AI', desc: 'GPU-accelerated detail recovery analyzes content frame by frame for genuine resolution gains — not fake upscaling.' },
            { Icon: Zap, title: 'Auto Fallback', desc: 'If the AI service is unavailable, we instantly switch to a local ffmpeg engine — your video always processes.' },
            { Icon: Shield, title: 'Privacy First', desc: 'Files process via secure transport. We never store your videos. No login, no tracking, no credits required.' },
          ].map(({ Icon, title, desc }) => (
            <Card key={title} className="glass p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16">
          <h2 className="font-display text-3xl text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { n: '01', t: 'Upload', d: 'Drop any MP4, MOV, or WEBM up to 600 MB.' },
              { n: '02', t: 'AI Analysis', d: 'Real-ESRGAN inspects frames to detect content type and detail loss.' },
              { n: '03', t: 'Enhance', d: 'Lanczos upscale + unsharp mask + cinematic grade.' },
              { n: '04', t: 'Download', d: 'YouTube-ready MP4, faststart enabled, yuv420p.' },
            ].map(s => (
              <Card key={s.n} className="glass p-5">
                <div className="font-display text-primary text-sm mb-1">{s.n}</div>
                <div className="font-display text-lg mb-2 flex items-center gap-2">
                  <Film className="w-4 h-4 text-primary" /> {s.t}
                </div>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
