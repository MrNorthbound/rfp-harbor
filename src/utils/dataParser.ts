
import { RFP } from './types';

// Function to parse RSS XML data
export const parseRssData = (xmlData: string, source: string): RFP[] => {
  try {
    console.log('Parsing RSS data from:', source);
    
    // In a real application, you would use a library like fast-xml-parser
    // to properly parse the XML and extract RFP data
    
    // This is a simplified mock implementation
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlData, 'text/xml');
    const items = xml.querySelectorAll('item');
    
    const rfps: RFP[] = [];
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const published = item.querySelector('pubDate')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      
      // Extract ServiceNow-related tags from the content
      const tags = extractTags(title + ' ' + description);
      
      // Only include if it contains ServiceNow-related content
      if (tags.length > 0) {
        rfps.push({
          id: `rss-${source}-${index}`,
          title,
          description,
          published: new Date(published).toISOString(),
          url: link,
          source: extractSourceName(source),
          tags
        });
      }
    });
    
    return rfps;
  } catch (error) {
    console.error('Error parsing RSS data:', error);
    return [];
  }
};

// Function to parse JSON API data
export const parseJsonData = (jsonData: any, source: string): RFP[] => {
  try {
    console.log('Parsing JSON data from:', source);
    
    // This would need to be adapted based on the specific API response format
    const rfps: RFP[] = [];
    
    // Extract relevant data from JSON
    // This is a simplified example - actual implementation would depend on API structure
    if (Array.isArray(jsonData)) {
      jsonData.forEach((item, index) => {
        const title = item.title || '';
        const description = item.description || '';
        const tags = extractTags(title + ' ' + description);
        
        // Only include if it contains ServiceNow-related content
        if (tags.length > 0) {
          rfps.push({
            id: `json-${source}-${index}`,
            title,
            description,
            published: item.publishedDate ? new Date(item.publishedDate).toISOString() : undefined,
            deadline: item.closingDate ? new Date(item.closingDate).toISOString() : undefined,
            organization: item.organization,
            contactInfo: item.contact,
            url: item.url,
            source: extractSourceName(source),
            tags
          });
        }
      });
    }
    
    return rfps;
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return [];
  }
};

// Helper function to extract ServiceNow-related tags from content
const extractTags = (content: string): string[] => {
  const keywords = [
    'ServiceNow', 'ITSM', 'ITOM', 'ITBM', 'ITAM', 'CSM', 'HR Service Delivery', 
    'GRC', 'SecOps', 'App Engine', 'IntegrationHub', 'Flow Designer', 'Virtual Agent',
    'Performance Analytics', 'Service Portal', 'Agent Workspace'
  ];
  
  const tags: string[] = [];
  
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(keyword);
    }
  });
  
  // Add industry tags if detected
  const industries = [
    'Healthcare', 'Financial Services', 'Government', 'Education', 'Manufacturing',
    'Technology', 'Telecommunications', 'Retail', 'Energy', 'Transportation', 'Federal'
  ];
  
  industries.forEach(industry => {
    if (content.toLowerCase().includes(industry.toLowerCase())) {
      tags.push(industry);
    }
  });
  
  // Add technology tags
  const techTags = [
    'AI', 'Machine Learning', 'Integration', 'API', 'Chatbot', 'Automation', 'Workflow',
    'Custom Development', 'Platform', 'Upgrade', 'Implementation', 'Optimization'
  ];
  
  techTags.forEach(tag => {
    if (content.toLowerCase().includes(tag.toLowerCase())) {
      tags.push(tag);
    }
  });
  
  return [...new Set(tags)]; // Remove duplicates
};

// Helper function to extract a clean source name from URL
const extractSourceName = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    
    if (parts.length >= 2) {
      return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
    }
    
    return hostname;
  } catch {
    return url;
  }
};
