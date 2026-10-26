import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Section';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#workflow' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Vision', href: '/#vision' },
    { label: 'Chrome Extension', href: '/extension' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'Help', href: '/help' },
    { label: 'FAQ', href: '/help' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-line bg-base-950 py-12">
      <div className="container-page">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/">
              <Logo />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Solve. Revise. Build. Showcase.
            </p>
            <p className="mt-2 text-2xs text-ink-faint">
              A learning operating system for developers.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-2xs font-semibold uppercase tracking-widest text-ink-faint">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') || link.href === '#' ? (
                      <a href={link.href === '#' ? undefined : link.href} className="text-sm text-ink-secondary transition-colors hover:text-ink-primary">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-ink-secondary transition-colors hover:text-ink-primary">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-2xs text-ink-faint">
            © 2026 CodeLoop. All rights reserved.
          </p>
          <p className="text-2xs text-ink-faint">
            Built for developers who remember.
          </p>
        </div>
      </div>
    </footer>
  );
}
