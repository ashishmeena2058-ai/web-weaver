import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const LegalLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <main className="container py-12 flex-1 max-w-3xl">
      <h1 className="font-display text-4xl mb-8 glow-text">{title}</h1>
      <article className="prose prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
        {children}
      </article>
    </main>
    <SiteFooter />
  </div>
);

export const Privacy = () => (
  <LegalLayout title="Privacy Policy">
    <p>Last updated: {new Date().toLocaleDateString()}</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Data we collect</h2>
    <p>NEONFRAME is a privacy-first service. We do <strong className="text-foreground">not</strong> require accounts, do not track users with cookies for advertising, and do not store the videos you upload after processing completes.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">How videos are processed</h2>
    <p>When you upload a video, a representative frame is sent over an encrypted channel to our AI inference partner (Replicate, running Real-ESRGAN) for analysis. The full video file is processed in your browser using ffmpeg.wasm and never leaves your device for the rendering step.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Retention</h2>
    <p>Frames sent for AI analysis are discarded by the inference provider after the prediction completes (typically within minutes). We do not retain copies.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Your rights</h2>
    <p>Because we do not store personally identifiable data, there is nothing to delete or export. For any concerns, contact us via the channel listed in our Terms.</p>
  </LegalLayout>
);

export const Terms = () => (
  <LegalLayout title="Terms of Service">
    <p>By using NEONFRAME you agree to the following terms.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Acceptable use</h2>
    <p>You may only upload content you own or have explicit permission to modify. You agree not to use the service to enhance copyrighted material, deepfakes, illegal content, or content depicting minors inappropriately.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">No warranty</h2>
    <p>The service is provided "as-is" without warranty of any kind. AI enhancement quality depends on source material and is not guaranteed.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Limitations</h2>
    <p>Maximum upload size is 600 MB per video. We may rate-limit or terminate processing for abusive usage patterns.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Liability</h2>
    <p>NEONFRAME is not liable for any damages arising from use of enhanced output, including but not limited to copyright disputes.</p>
  </LegalLayout>
);

export const DMCA = () => (
  <LegalLayout title="Copyright / DMCA Policy">
    <p>NEONFRAME respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA).</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Anti-piracy commitment</h2>
    <p>The service is intended for enhancing original or licensed content. Uploading copyrighted material you do not own is strictly prohibited and may constitute copyright infringement under applicable law.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Filing a notice</h2>
    <p>If you believe content was processed in violation of your copyright, send a DMCA takedown notice including:</p>
    <ul className="list-disc pl-6 space-y-1">
      <li>Identification of the copyrighted work claimed to be infringed</li>
      <li>Identification of the material claimed to be infringing</li>
      <li>Your contact information</li>
      <li>A statement of good-faith belief that the use is not authorized</li>
      <li>A statement, under penalty of perjury, that the information is accurate</li>
      <li>Your physical or electronic signature</li>
    </ul>
    <h2 className="font-display text-2xl text-foreground mt-6">Counter notification</h2>
    <p>If you believe your content was wrongly flagged, you may file a counter-notice using the same channel.</p>
    <h2 className="font-display text-2xl text-foreground mt-6">Repeat infringers</h2>
    <p>We reserve the right to block IP addresses associated with repeated infringement.</p>
  </LegalLayout>
);
