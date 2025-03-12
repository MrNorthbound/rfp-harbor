import { RFP, NotificationSettings } from './types';

/**
 * Get RFP data from local storage
 */
export const getRfps = (): RFP[] => {
  try {
    const rfpData = localStorage.getItem('rfp_data');
    return rfpData ? JSON.parse(rfpData) : [];
  } catch (error) {
    console.error('Error getting RFPs from localStorage:', error);
    return [];
  }
};

/**
 * Save RFP data to local storage
 */
export const saveRfps = (rfps: RFP[]): void => {
  try {
    localStorage.setItem('rfp_data', JSON.stringify(rfps));
  } catch (error) {
    console.error('Error saving RFPs to localStorage:', error);
  }
};

/**
 * Clear RFP data from local storage
 */
export const clearRfps = (): void => {
  try {
    localStorage.removeItem('rfp_data');
  } catch (error) {
    console.error('Error clearing RFPs from localStorage:', error);
  }
};

/**
 * Get notification settings from local storage
 */
export const getNotificationSettings = (): NotificationSettings | null => {
  try {
    const settings = localStorage.getItem('notification_settings');
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting notification settings from localStorage:', error);
    return null;
  }
};

/**
 * Save notification settings to local storage
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings to localStorage:', error);
  }
};

/**
 * Get custom data sources from local storage
 */
export const getCustomDataSources = () => {
  try {
    const sourcesJson = localStorage.getItem('custom_data_sources');
    if (sourcesJson) {
      return JSON.parse(sourcesJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting custom data sources:', error);
    return [];
  }
};

/**
 * Save custom data sources to local storage
 */
export const saveCustomDataSources = (sources: any[]) => {
  try {
    localStorage.setItem('custom_data_sources', JSON.stringify(sources));
  } catch (error) {
    console.error('Error saving custom data sources:', error);
  }
};
