
import React from 'react';
import Navbar from './Navbar';
import { ThemeToggle } from './ThemeToggle';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
          {children}
        </main>
        <footer className="py-6 border-t border-border/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} RFP Harbor · ServiceNow Ecosystem Monitor
            </p>
            <ThemeToggle />
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
