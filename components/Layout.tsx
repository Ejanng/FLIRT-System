import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Search, LayoutDashboard, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/report', label: 'Report', icon: FileText },
    { path: '/claim', label: 'Claim', icon: Search },
    { path: '/admin', label: 'Admin', icon: LayoutDashboard },
    { path: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20 md:pb-0">
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Desktop Header - Hidden on mobile */}
      <header className="hidden md:block bg-white border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3" aria-label="FLIRT Home - Lost and Found">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5B8FB9] to-[#7FAFD9] rounded-lg flex items-center justify-center shadow-md" aria-hidden="true">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1F2937]">FLIRT</h1>
                <p className="text-xs text-[#6B7280]">Lost & Found</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-2" aria-label="Main navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-[#5B8FB9] text-white shadow-md'
                        : 'text-[#6B7280] hover:bg-[#D8E6F3] hover:text-[#1F2937]'
                    }`}
                    aria-label={`${item.label} page`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header - Visible only on mobile */}
      <header className="md:hidden bg-white border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm" role="banner">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" aria-label="FLIRT Home - Lost and Found">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5B8FB9] to-[#7FAFD9] rounded-lg flex items-center justify-center shadow-md">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1F2937]">FLIRT</h1>
                <p className="text-xs text-[#6B7280] leading-none">Lost & Found</p>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger 
                className="md:hidden p-2 hover:bg-[#D8E6F3] rounded-lg transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-6 h-6 text-[#1F2937]" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="right" className="w-64" aria-label="Mobile navigation menu">
                <nav className="flex flex-col gap-2 mt-6" aria-label="Mobile main navigation">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? 'bg-[#5B8FB9] text-white shadow-md'
                            : 'text-[#6B7280] hover:bg-[#D8E6F3] hover:text-[#1F2937]'
                        }`}
                        aria-label={`${item.label} page`}
                        aria-current={isActive(item.path) ? 'page' : undefined}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="w-full" role="main" tabIndex={-1}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - Fixed at bottom for thumb access */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 shadow-lg" aria-label="Mobile bottom navigation" role="navigation">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  active
                    ? 'text-[#5B8FB9]'
                    : 'text-[#6B7280] active:bg-[#D8E6F3]'
                }`}
                aria-label={`${item.label} page`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} aria-hidden="true" />
                <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#5B8FB9] rounded-b-full" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
