
import React from 'react';
import Navbar from './Navbar';
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
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} RFP Harbor · ServiceNow Ecosystem Monitor</p>
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
