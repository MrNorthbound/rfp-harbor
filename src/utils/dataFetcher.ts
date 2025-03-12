
import { parseRssData, parseJsonData } from './dataParser';
import { saveRfps, getCustomDataSources } from './storage';
import { RFP } from './types';

// Sample RSS feeds for ServiceNow RFPs (default sources)
const DEFAULT_RSS_SOURCES = [
  { 
    id: 'default-1',
    name: 'ServiceNow RFPs',
    url: 'https://example.com/servicenow-rfps.xml', 
    type: 'rss'
  },
  { 
    id: 'default-2',
    name: 'ITSM Opportunities',
    url: 'https://example.com/itsm-opportunities.json', 
    type: 'json'
  }
];

// Helper function to create a dummy date in the past or future
const createDummyDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

// Generate dummy RFP data for demo purposes
const generateDummyData = (): RFP[] => {
  const dummyRfps: RFP[] = [
    {
      id: '1',
      title: 'ServiceNow ITSM Implementation for Federal Agency',
      description: 'Seeking experienced ServiceNow partners to implement ITSM modules for a large federal agency. The project includes Service Catalog, Incident, Problem, and Change Management implementations with specific government compliance requirements.',
      published: createDummyDate(-5),
      deadline: createDummyDate(15),
      organization: 'US Department of Education',
      contactInfo: 'John Smith, procurement@education.gov, (202) 555-1234',
      url: 'https://www.sam.gov/opportunity/12345',
      source: 'SAM.gov',
      tags: ['ServiceNow', 'ITSM', 'Federal', 'Government']
    },
    {
      id: '2',
      title: 'ServiceNow ITOM and ITBM Implementation for Healthcare Provider',
      description: 'Large healthcare system seeking proposals for ServiceNow ITOM and ITBM implementation. Looking for certified ServiceNow partners with healthcare experience to help with Discovery, Service Mapping, and Project Portfolio Suite.',
      published: createDummyDate(-2),
      deadline: createDummyDate(10),
      organization: 'Pacific Northwest Health',
      contactInfo: 'procurement@pnhealth.org',
      url: 'https://www.pnhealth.org/rfps/servicenow-implementation',
      source: 'Industry Portal',
      tags: ['ServiceNow', 'ITOM', 'ITBM', 'Healthcare']
    },
    {
      id: '3',
      title: 'ServiceNow SecOps and GRC Integration Project',
      description: 'Financial services company requires ServiceNow SecOps and GRC implementation with integration to existing security tools. Must comply with financial regulations and provide comprehensive audit trails.',
      published: createDummyDate(-10),
      deadline: createDummyDate(5),
      organization: 'Global Financial Services Inc.',
      contactInfo: 'Mary Johnson, mary.j@globalfinancial.com',
      url: 'https://globalfinancial.com/procurement/2023-secops',
      source: 'Direct',
      tags: ['ServiceNow', 'SecOps', 'GRC', 'Financial Services']
    },
    {
      id: '4',
      title: 'ServiceNow CSM Implementation with AI Capabilities',
      description: 'Telecommunications company seeking ServiceNow partner to implement Customer Service Management with AI-powered virtual agents and predictive intelligence. Integration with existing CRM systems required.',
      published: createDummyDate(-7),
      deadline: createDummyDate(20),
      organization: 'TeleTech Communications',
      contactInfo: 'procurement@teletech.com',
      url: 'https://teletech.com/suppliers/opportunities',
      source: 'Industry Portal',
      tags: ['ServiceNow', 'CSM', 'AI', 'Telecommunications']
    },
    {
      id: '5',
      title: 'ServiceNow HR Service Delivery Implementation',
      description: 'Global manufacturing organization looking for ServiceNow partner to implement HR Service Delivery modules. The project includes Case Management, Knowledge Management, and Employee Service Center with multi-language support.',
      published: createDummyDate(-3),
      deadline: createDummyDate(12),
      organization: 'Global Manufacturing Corp',
      contactInfo: 'hr.procurement@globalmfg.com',
      url: 'https://procurement.globalmfg.com/rfp/2023-10-hr',
      source: 'Direct',
      tags: ['ServiceNow', 'HR Service Delivery', 'Manufacturing']
    },
    {
      id: '6',
      title: 'ServiceNow Platform Upgrade and Optimization',
      description: 'Energy company seeking proposals for ServiceNow platform upgrade from Rome to Tokyo and optimization of existing modules. Includes performance tuning, technical debt reduction, and enhanced reporting capabilities.',
      published: createDummyDate(-12),
      deadline: createDummyDate(-2),
      organization: 'Midwest Energy Cooperative',
      contactInfo: 'Sam Wilson, swilson@midwestenergy.org',
      url: 'https://midwestenergy.org/suppliers',
      source: 'Industry Portal',
      tags: ['ServiceNow', 'Platform Upgrade', 'Optimization', 'Energy']
    },
    {
      id: '7',
      title: 'ServiceNow App Engine Development for Custom Applications',
      description: 'Technology company seeking ServiceNow partner to develop custom applications using App Engine. The project involves creating 3-5 custom applications to support unique business processes with integration to internal systems.',
      published: createDummyDate(-1),
      deadline: createDummyDate(25),
      organization: 'InnoTech Solutions',
      contactInfo: 'Laura Chen, lchen@innotech.io',
      url: 'https://innotech.io/partner-opportunities',
      source: 'Direct',
      tags: ['ServiceNow', 'App Engine', 'Custom Development', 'Technology']
    },
    {
      id: '8',
      title: 'ServiceNow Integration with Legacy Systems',
      description: 'Government agency requiring ServiceNow integration with multiple legacy systems through REST APIs, SOAP, and database connections. Must include detailed documentation and knowledge transfer.',
      published: createDummyDate(-8),
      deadline: createDummyDate(18),
      organization: 'State Transportation Department',
      contactInfo: 'procurement@state-transport.gov',
      url: 'https://state-transport.gov/procurement/2023/integration',
      source: 'Government Portal',
      tags: ['ServiceNow', 'Integration', 'Government', 'API']
    }
  ];
  
  return dummyRfps;
};

// Main function to fetch data from all sources
export const fetchData = async (): Promise<RFP[]> => {
  try {
    console.log('Fetching RFP data from sources...');
    
    // Get custom data sources
    const customSources = getCustomDataSources();
    
    // Combine default and custom sources
    const allSources = [...DEFAULT_RSS_SOURCES, ...customSources];
    console.log('Data sources to fetch from:', allSources);
    
    // In a real application, you would fetch from actual RSS/API endpoints
    // For demo purposes, we're using dummy data instead of actual fetching
    
    /* 
    // This would be the actual implementation
    const promises = allSources.map(async (source) => {
      try {
        console.log(`Fetching from ${source.name}: ${source.url}`);
        const response = await fetch(source.url);
        const data = await (source.type === 'rss' ? response.text() : response.json());
        
        return source.type === 'rss' 
          ? parseRssData(data, source.url) 
          : parseJsonData(data, source.url);
      } catch (sourceError) {
        console.error(`Error fetching from ${source.name}:`, sourceError);
        return [];
      }
    });
    
    const results = await Promise.all(promises);
    const allRfps = results.flat();
    */
    
    // Using dummy data instead
    const allRfps = generateDummyData();
    
    // Save to localStorage
    saveRfps(allRfps);
    
    return allRfps;
  } catch (error) {
    console.error('Error fetching RFP data:', error);
    
    // If we have data in localStorage, return that as a fallback
    const storedRfps = JSON.parse(localStorage.getItem('rfp_data') || '[]');
    if (storedRfps.length > 0) {
      return storedRfps;
    }
    
    throw error;
  }
};
