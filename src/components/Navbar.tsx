import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useScrolled } from '@/hooks/useScrollReveal';
import { Logo } from '@/components/ui/Section';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// `href` = a section on the landing page ("/#..." so it also works from other pages
// like /about). `to` = a separate page.
type NavLinkItem = { label: string; href?: string; to?: string };
const navLinks: NavLinkItem[] = [
  { label: 'Product', href: '/#product' },
  { label: 'How It Works', href: '/#workflow' },
  { label: 'Features', href: '/#features' },
  { label: 'Vision', href: '/#vision' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Extension', to: '/extension' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const scrolled = useScrolled(8);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-smooth ${
          scrolled
            ? 'border-b border-line/60 bg-base-950/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="container-page flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="CodeLoop home">
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const cls = 'rounded-md px-3 py-2 text-sm font-medium text-ink-secondary transition-colors duration-200 hover:text-ink-primary';
              return link.to ? (
                <Link key={link.label} to={link.to} className={cls}>{link.label}</Link>
              ) : (
                <a key={link.label} href={link.href} className={cls}>{link.label}</a>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle compact />
            <Link to="/login" className="btn-ghost">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary">
              Start Building
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compact />
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-base-800 text-ink-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-base-950/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute inset-x-0 top-14 origin-top border-b border-line bg-base-900/95 backdrop-blur-xl transition-all duration-300 ease-smooth ${
            mobileOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0'
          }`}
        >
          <div className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => {
              const cls = 'rounded-lg px-3 py-3 text-base font-medium text-ink-secondary transition-colors hover:bg-base-800 hover:text-ink-primary';
              return link.to ? (
                <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} className={cls}>{link.label}</Link>
              ) : (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className={cls}>{link.label}</a>
              );
            })}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              <Link to="/login" className="btn-secondary w-full justify-center" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
              <Link to="/signup" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                Start Building
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
