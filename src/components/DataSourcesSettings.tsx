
import React, { useState, useEffect } from 'react';
import { Rss, Plus, Save, Trash2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getCustomDataSources, saveCustomDataSources } from '@/utils/storage';
import { fetchData } from '@/utils/dataFetcher';

interface DataSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'json';
}

const DataSourcesSettings: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'rss' | 'json'>('rss');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sources = getCustomDataSources();
    if (sources && sources.length > 0) {
      setDataSources(sources);
    }
  }, []);

  const handleAddSource = async () => {
    if (!name.trim() || !url.trim()) {
      toast({
        title: "Error",
        description: "Name and URL are required",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    const newSource: DataSource = {
      id: Date.now().toString(),
      name: name.trim(),
      url: url.trim(),
      type
    };

    const updatedSources = [...dataSources, newSource];
    setDataSources(updatedSources);
    saveCustomDataSources(updatedSources);

    // Reset form
    setName('');
    setUrl('');
    setType('rss');

    toast({
      title: "Data source added",
      description: `${name} has been added to your data sources.`,
    });
    
    // Refresh data to include the new source
    toast({
      title: "Refreshing data",
      description: "Loading data from your new source...",
    });
    
    await handleRefreshData();
  };

  const handleDeleteSource = async (id: string) => {
    const updatedSources = dataSources.filter(source => source.id !== id);
    setDataSources(updatedSources);
    saveCustomDataSources(updatedSources);

    toast({
      title: "Data source removed",
      description: "The data source has been removed.",
    });
    
    // Refresh data after removing a source
    await handleRefreshData();
  };

  const handleSaveChanges = async () => {
    saveCustomDataSources(dataSources);
    
    toast({
      title: "Settings saved",
      description: "Your data source settings have been updated.",
    });
    
    // Refresh data after saving changes
    await handleRefreshData();
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    try {
      await fetchData();
      
      toast({
        title: "Data refreshed",
        description: "RFP data has been updated from all sources.",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      
      toast({
        title: "Refresh failed",
        description: "There was an error refreshing the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 rounded-full p-3">
          <Rss className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Custom Data Sources</h3>
          <p className="text-muted-foreground">Add your own RSS feeds or JSON APIs to collect RFP data</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Source Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Government Procurement Portal"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="url">RSS or API URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/rfp-feed.xml"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">Source Type</Label>
          <Select value={type} onValueChange={(value: 'rss' | 'json') => setType(value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rss">RSS Feed</SelectItem>
              <SelectItem value="json">JSON API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddSource} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      {dataSources.length > 0 && (
        <div className="space-y-4 pt-4">
          <h4 className="font-medium">Your Data Sources</h4>
          <div className="space-y-2">
            {dataSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-md">
                <div>
                  <p className="font-medium">{source.name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">{source.url}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {source.type.toUpperCase()}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteSource(source.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={handleSaveChanges} className="flex-1 sm:flex-none">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button 
          variant="outline" 
          onClick={handleRefreshData} 
          disabled={isRefreshing}
          className="flex-1 sm:flex-none"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data Now
        </Button>
      </div>
    </div>
  );
};

export default DataSourcesSettings;
