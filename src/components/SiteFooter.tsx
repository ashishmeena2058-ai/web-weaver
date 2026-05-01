import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const SiteFooter = () => (
  <footer className="border-t border-border mt-24">
    <div className="container py-10 grid gap-8 md:grid-cols-3">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">NEONFRAME</span>
        </div>
        <p className="text-sm text-muted-foreground mt-3 max-w-xs">
          AI video enhancement powered by Real-ESRGAN. Privacy-first, no login, no credits.
        </p>
      </div>
      <div>
        <h4 className="font-display uppercase text-xs tracking-wider text-muted-foreground mb-3">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          <li><Link to="/dmca" className="hover:text-primary transition-colors">Copyright / DMCA</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display uppercase text-xs tracking-wider text-muted-foreground mb-3">Anti-Piracy</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Uploading copyrighted material you do not own is strictly prohibited.
          We employ automated content analysis and reserve the right to terminate
          processing of infringing material.
        </p>
      </div>
    </div>
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} NEONFRAME · All rights reserved
    </div>
  </footer>
);
