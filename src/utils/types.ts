
export interface RFP {
  id: string;
  title: string;
  description?: string;
  published?: string; // ISO date string
  deadline?: string; // ISO date string
  organization?: string;
  contactInfo?: string;
  url?: string;
  source?: string;
  tags?: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  keywords: string[];
  refreshInterval: string;
}
