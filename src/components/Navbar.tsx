
import React, { useState, useEffect } from 'react';
import { Bell, Settings, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNotification = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications at this time.",
    });
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-200 ease-in-out",
      scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-semibold text-sm">RH</span>
              </div>
              <span className="font-semibold text-xl">RFP Harbor</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={handleNotification}>
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-56" : "max-h-0"
        )}>
          <div className="py-4 space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleNotification}>
              <Bell className="h-5 w-5 mr-2" />
              <span>Notifications</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                <Settings className="h-5 w-5 mr-2" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
