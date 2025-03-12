
import React, { useState, useEffect } from 'react';
import { Bell, Save, Tag, Info, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getNotificationSettings, saveNotificationSettings } from '@/utils/storage';

const NotificationSettings: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('daily');
  const { toast } = useToast();

  useEffect(() => {
    const settings = getNotificationSettings();
    if (settings) {
      setEnabled(settings.enabled);
      setKeywords(settings.keywords || []);
      setRefreshInterval(settings.refreshInterval || 'daily');
    }
  }, []);

  const handleSave = () => {
    // Request notification permission if enabled
    if (enabled && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    saveNotificationSettings({
      enabled,
      keywords,
      refreshInterval,
    });
    
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 rounded-full p-3">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Notification Settings</h3>
          <p className="text-muted-foreground">Configure how you want to receive updates about new RFPs</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Browser Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive alerts when new RFPs match your criteria
            </p>
          </div>
          <Switch 
            id="notifications"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <Label htmlFor="keywords">Notification Keywords</Label>
          <p className="text-sm text-muted-foreground mb-2">
            You'll be notified when new RFPs contain these keywords
          </p>
          
          <div className="flex gap-2">
            <Input
              id="keywords"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. ServiceNow, ITSM, AI"
              className="flex-1"
            />
            <Button onClick={addKeyword} disabled={!keywordInput.trim()}>
              <Tag className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {keywords.length > 0 ? (
              keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => removeKeyword(keyword)}
                  >
                    <span className="sr-only">Remove</span>
                    <Info className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">No keywords added</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <Label htmlFor="refresh-interval">Data Refresh Interval</Label>
          <p className="text-sm text-muted-foreground mb-2">
            How often should the application check for new RFPs
          </p>
          
          <Select 
            value={refreshInterval} 
            onValueChange={setRefreshInterval}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Hourly</span>
                </div>
              </SelectItem>
              <SelectItem value="daily">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Daily</span>
                </div>
              </SelectItem>
              <SelectItem value="weekly">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Weekly</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
