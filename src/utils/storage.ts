
import { RFP, NotificationSettings } from './types';

// Storage keys
const RFP_DATA_KEY = 'rfp_data';
const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

// Save RFPs to localStorage
export const saveRfps = (rfps: RFP[]): void => {
  try {
    localStorage.setItem(RFP_DATA_KEY, JSON.stringify(rfps));
  } catch (error) {
    console.error('Error saving RFPs to localStorage:', error);
  }
};

// Get all RFPs from localStorage
export const getAllRfps = (): RFP[] => {
  try {
    const data = localStorage.getItem(RFP_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting RFPs from localStorage:', error);
    return [];
  }
};

// Get RFP by ID
export const getRfpById = (id: string): RFP | null => {
  try {
    const rfps = getAllRfps();
    return rfps.find(rfp => rfp.id === id) || null;
  } catch (error) {
    console.error('Error getting RFP by ID:', error);
    return null;
  }
};

// Save notification settings
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    
    // Set up notification checking based on settings
    if (settings.enabled) {
      setupNotificationChecking(settings);
    } else {
      clearNotificationChecking();
    }
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

// Get notification settings
export const getNotificationSettings = (): NotificationSettings | null => {
  try {
    const data = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
};

// Setup notification checking based on settings
const setupNotificationChecking = (settings: NotificationSettings): void => {
  // Clear any existing notification interval
  clearNotificationChecking();
  
  // Set the interval based on settings
  let intervalMs = 24 * 60 * 60 * 1000; // Default: daily (24 hours)
  
  if (settings.refreshInterval === 'hourly') {
    intervalMs = 60 * 60 * 1000; // 1 hour
  } else if (settings.refreshInterval === 'weekly') {
    intervalMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  }
  
  // Store the interval ID so we can clear it later
  const intervalId = setInterval(() => {
    checkForNewRfps(settings);
  }, intervalMs);
  
  localStorage.setItem('notification_interval_id', intervalId.toString());
};

// Clear notification checking
const clearNotificationChecking = (): void => {
  const intervalId = localStorage.getItem('notification_interval_id');
  if (intervalId) {
    clearInterval(parseInt(intervalId));
    localStorage.removeItem('notification_interval_id');
  }
};

// Check for new RFPs that match notification criteria
const checkForNewRfps = async (settings: NotificationSettings): Promise<void> => {
  try {
    // This would normally fetch new data from the API
    // For demo purposes, we'll just check for matching RFPs in the current data
    
    const rfps = getAllRfps();
    const lastChecked = localStorage.getItem('last_notification_check');
    const lastCheckedDate = lastChecked ? new Date(lastChecked) : new Date(0);
    
    // Find RFPs published after last check that match keywords
    const matchingRfps = rfps.filter(rfp => {
      if (!rfp.published) return false;
      
      const publishedDate = new Date(rfp.published);
      if (publishedDate <= lastCheckedDate) return false;
      
      // Check if any keywords match
      if (settings.keywords.length === 0) return true;
      
      const rfpText = `${rfp.title} ${rfp.description || ''} ${rfp.organization || ''}`.toLowerCase();
      return settings.keywords.some(keyword => 
        rfpText.includes(keyword.toLowerCase())
      );
    });
    
    // Show notifications for matching RFPs
    if (Notification.permission === 'granted' && matchingRfps.length > 0) {
      matchingRfps.forEach(rfp => {
        new Notification('New RFP Opportunity', {
          body: rfp.title,
          icon: '/favicon.ico'
        });
      });
    }
    
    // Update last checked timestamp
    localStorage.setItem('last_notification_check', new Date().toISOString());
    
  } catch (error) {
    console.error('Error checking for new RFPs:', error);
  }
};
