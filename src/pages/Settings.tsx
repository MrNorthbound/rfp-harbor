
import React from 'react';
import Layout from '@/components/Layout';
import NotificationSettings from '@/components/NotificationSettings';
import DataSourcesSettings from '@/components/DataSourcesSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, RefreshCw, Server, Rss } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
        
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="data-sources" className="flex items-center gap-2">
              <Rss className="h-4 w-4" />
              <span>Data Sources</span>
            </TabsTrigger>
            <TabsTrigger value="default-sources" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>Default Sources</span>
            </TabsTrigger>
            <TabsTrigger value="auto-refresh" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Auto Refresh</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="data-sources">
            <DataSourcesSettings />
          </TabsContent>
          
          <TabsContent value="default-sources">
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              <h3 className="text-xl font-medium">Default Data Sources</h3>
              <p className="text-muted-foreground">
                RFP Harbor currently aggregates data from several public procurement sources 
                focused on the ServiceNow ecosystem. Sources include government procurement 
                portals, ServiceNow partner networks, and industry-specific RFP repositories.
              </p>
              <p className="text-muted-foreground">
                All data is processed locally in your browser. No data is sent to external servers.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="auto-refresh">
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              <h3 className="text-xl font-medium">Auto Refresh Settings</h3>
              <p className="text-muted-foreground">
                Configure how often RFP Harbor automatically refreshes data. This setting 
                determines how frequently the application will check for new RFP opportunities
                in the background.
              </p>
              <p className="text-muted-foreground">
                You can manage the refresh interval in the Notifications tab.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
