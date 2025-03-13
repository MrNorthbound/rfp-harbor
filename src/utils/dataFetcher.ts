
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
    // ServiceNow RFPs
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
    },
    
    // Salesforce RFPs
    {
      id: '9',
      title: 'Salesforce Sales Cloud Implementation for Retail Chain',
      description: 'National retail chain seeking Salesforce partner to implement Sales Cloud for 500+ users. Requirements include custom sales processes, territory management, and integration with ERP system.',
      published: createDummyDate(-3),
      deadline: createDummyDate(14),
      organization: 'National Retail Group',
      contactInfo: 'procurement@nrg.com',
      url: 'https://nrg.com/suppliers/opportunities',
      source: 'Direct',
      tags: ['Salesforce', 'Sales Cloud', 'Retail', 'CRM']
    },
    {
      id: '10',
      title: 'Salesforce Marketing Cloud Integration and Automation',
      description: 'B2B technology company looking for Salesforce Marketing Cloud expertise to enhance customer journey automation, implement personalization at scale, and integrate with existing Sales Cloud instance.',
      published: createDummyDate(-5),
      deadline: createDummyDate(20),
      organization: 'TechSolutions Inc',
      contactInfo: 'rfp@techsolutions.com',
      url: 'https://techsolutions.com/partners/rfps',
      source: 'Industry Portal',
      tags: ['Salesforce', 'Marketing Cloud', 'Automation', 'Technology']
    },
    {
      id: '11',
      title: 'Salesforce Service Cloud and Field Service Lightning Implementation',
      description: 'Utilities company seeking proposals for Salesforce Service Cloud implementation with Field Service Lightning for 200+ field technicians. Must include mobile app customization and real-time scheduling.',
      published: createDummyDate(-8),
      deadline: createDummyDate(12),
      organization: 'Midwest Utilities Corp',
      contactInfo: 'Sarah Johnson, sjohnson@midwestutilities.com',
      url: 'https://midwestutilities.com/procurement',
      source: 'Direct',
      tags: ['Salesforce', 'Service Cloud', 'Field Service', 'Utilities']
    },
    
    // Atlassian RFPs
    {
      id: '12',
      title: 'Atlassian Jira and Confluence Implementation for Product Development',
      description: 'Software company seeking Atlassian partner to implement Jira Software, Jira Service Management and Confluence for 300+ users. Requirements include custom workflows, automation rules, and integration with development tools.',
      published: createDummyDate(-6),
      deadline: createDummyDate(15),
      organization: 'Software Innovations Ltd',
      contactInfo: 'procurement@softwareinnovations.com',
      url: 'https://softwareinnovations.com/rfps',
      source: 'Direct',
      tags: ['Atlassian', 'Jira', 'Confluence', 'Software Development']
    },
    {
      id: '13',
      title: 'Atlassian Data Center Migration and Performance Optimization',
      description: 'Enterprise organization looking to migrate from Atlassian Server to Data Center. Project includes load testing, performance optimization, and ensuring high availability of Jira and Confluence instances.',
      published: createDummyDate(-4),
      deadline: createDummyDate(18),
      organization: 'Global Enterprise Solutions',
      contactInfo: 'Mike Davis, mdavis@globalenterprise.com',
      url: 'https://globalenterprise.com/procurement/atlassian',
      source: 'Industry Portal',
      tags: ['Atlassian', 'Data Center', 'Migration', 'Enterprise']
    },
    {
      id: '14',
      title: 'Atlassian Bitbucket and Bamboo CI/CD Pipeline Implementation',
      description: 'Financial technology company seeking Atlassian expert to implement and configure Bitbucket and Bamboo for continuous integration and deployment. Must meet strict security and compliance requirements.',
      published: createDummyDate(-9),
      deadline: createDummyDate(10),
      organization: 'FinTech Innovations',
      contactInfo: 'procurement@fintechinnovations.com',
      url: 'https://fintechinnovations.com/partners',
      source: 'Direct',
      tags: ['Atlassian', 'Bitbucket', 'Bamboo', 'CI/CD', 'Financial Technology']
    },
    
    // Cloud RFPs
    {
      id: '15',
      title: 'AWS Cloud Migration and Optimization Strategy',
      description: 'Healthcare provider seeking cloud partner to develop and execute migration strategy from on-premises data center to AWS. Includes assessment, planning, migration, and optimization of 200+ applications.',
      published: createDummyDate(-7),
      deadline: createDummyDate(25),
      organization: 'Regional Healthcare Network',
      contactInfo: 'it.procurement@regionalhealthcare.org',
      url: 'https://regionalhealthcare.org/procurement',
      source: 'Industry Portal',
      tags: ['Cloud', 'AWS', 'Migration', 'Healthcare']
    },
    {
      id: '16',
      title: 'Multi-Cloud Management Platform Implementation',
      description: 'Retail organization seeking implementation of cloud management platform across AWS, Azure, and Google Cloud environments. Must include cost optimization, governance, and security compliance features.',
      published: createDummyDate(-10),
      deadline: createDummyDate(15),
      organization: 'Global Retail Enterprises',
      contactInfo: 'cloud.team@globalretail.com',
      url: 'https://globalretail.com/suppliers/cloud-rfp',
      source: 'Direct',
      tags: ['Cloud', 'Multi-Cloud', 'AWS', 'Azure', 'Google Cloud', 'Retail']
    },
    {
      id: '17',
      title: 'Cloud-Native Application Development and DevOps Implementation',
      description: 'Financial services company seeking partner for cloud-native application development using microservices architecture and implementing DevOps practices. Must include CI/CD pipeline implementation and containerization strategy.',
      published: createDummyDate(-5),
      deadline: createDummyDate(20),
      organization: 'Progressive Financial Services',
      contactInfo: 'John Miller, jmiller@progressivefinancial.com',
      url: 'https://progressivefinancial.com/suppliers',
      source: 'Industry Portal',
      tags: ['Cloud', 'DevOps', 'Microservices', 'Financial Services']
    },
    
    // Cybersecurity RFPs
    {
      id: '18',
      title: 'Enterprise Cybersecurity Assessment and Roadmap Development',
      description: 'Manufacturing company seeking cybersecurity partner to conduct comprehensive assessment and develop security roadmap. Includes vulnerability assessment, threat modeling, and security architecture recommendations.',
      published: createDummyDate(-8),
      deadline: createDummyDate(22),
      organization: 'Advanced Manufacturing Inc',
      contactInfo: 'security@advancedmanufacturing.com',
      url: 'https://advancedmanufacturing.com/rfps/security',
      source: 'Direct',
      tags: ['Cybersecurity', 'Security Assessment', 'Manufacturing']
    },
    {
      id: '19',
      title: 'Zero Trust Security Architecture Implementation',
      description: 'Government agency seeking proposals for implementation of zero trust security architecture. Project includes identity and access management, network segmentation, and continuous monitoring solutions.',
      published: createDummyDate(-12),
      deadline: createDummyDate(10),
      organization: 'Federal Security Agency',
      contactInfo: 'procurement@fedsecrurity.gov',
      url: 'https://fedsecurity.gov/opportunities',
      source: 'Government Portal',
      tags: ['Cybersecurity', 'Zero Trust', 'Government', 'Security Architecture']
    },
    {
      id: '20',
      title: 'Security Operations Center (SOC) as a Service',
      description: 'Healthcare organization seeking managed SOC service provider for 24/7 threat monitoring, detection, and response. Must comply with HIPAA requirements and integrate with existing security tools.',
      published: createDummyDate(-3),
      deadline: createDummyDate(15),
      organization: 'United Healthcare Systems',
      contactInfo: 'infosec@unitedhealthcare.org',
      url: 'https://unitedhealthcare.org/procurement/security',
      source: 'Industry Portal',
      tags: ['Cybersecurity', 'SOC', 'Managed Services', 'Healthcare']
    },
    
    // Data & Artificial Intelligence RFPs
    {
      id: '21',
      title: 'Enterprise Data Lake Implementation and Analytics Platform',
      description: 'Retail company seeking partner to implement cloud-based data lake and analytics platform. Project includes data ingestion from multiple sources, data quality framework, and self-service analytics capabilities.',
      published: createDummyDate(-6),
      deadline: createDummyDate(20),
      organization: 'National Retail Corporation',
      contactInfo: 'data.analytics@nationalretail.com',
      url: 'https://nationalretail.com/suppliers/data-rfp',
      source: 'Direct',
      tags: ['Data & Artificial Intelligence', 'Data Lake', 'Analytics', 'Retail']
    },
    {
      id: '22',
      title: 'AI-Powered Customer Experience Transformation',
      description: 'Telecommunications provider seeking expertise in AI-powered customer experience solutions. Project includes implementation of chatbots, voice assistants, and personalization engines across digital channels.',
      published: createDummyDate(-9),
      deadline: createDummyDate(18),
      organization: 'Global Telecom',
      contactInfo: 'innovation@globaltelecom.com',
      url: 'https://globaltelecom.com/partners/ai-rfp',
      source: 'Industry Portal',
      tags: ['Data & Artificial Intelligence', 'AI', 'Customer Experience', 'Telecommunications']
    },
    {
      id: '23',
      title: 'Predictive Maintenance Solution Using ML and IoT',
      description: 'Manufacturing company seeking implementation of predictive maintenance solution using machine learning and IoT sensors. Project includes development of ML models, IoT integration, and dashboard development.',
      published: createDummyDate(-4),
      deadline: createDummyDate(25),
      organization: 'Precision Manufacturing Group',
      contactInfo: 'technology@precisionmfg.com',
      url: 'https://precisionmfg.com/suppliers',
      source: 'Direct',
      tags: ['Data & Artificial Intelligence', 'Machine Learning', 'IoT', 'Manufacturing']
    },
    
    // Human Capital Management RFPs
    {
      id: '24',
      title: 'Cloud-Based HCM Platform Implementation',
      description: 'Global organization seeking partner to implement comprehensive cloud-based human capital management platform. Modules include core HR, payroll, time tracking, talent management, and employee experience.',
      published: createDummyDate(-11),
      deadline: createDummyDate(15),
      organization: 'Global Enterprise Corporation',
      contactInfo: 'hr.procurement@globalenterprise.com',
      url: 'https://globalenterprise.com/procurement/hcm',
      source: 'Direct',
      tags: ['Human Capital Management', 'HCM', 'HR Technology', 'Enterprise']
    },
    {
      id: '25',
      title: 'Employee Experience Platform with AI Capabilities',
      description: 'Technology company seeking partner to implement employee experience platform with AI-powered capabilities. Features include personalized content, virtual assistants, skill development, and employee feedback analytics.',
      published: createDummyDate(-5),
      deadline: createDummyDate(20),
      organization: 'Tech Innovations Inc',
      contactInfo: 'people.ops@techinnovations.com',
      url: 'https://techinnovations.com/procurement',
      source: 'Industry Portal',
      tags: ['Human Capital Management', 'Employee Experience', 'AI', 'Technology']
    },
    {
      id: '26',
      title: 'Talent Acquisition and Onboarding System Implementation',
      description: 'Healthcare network seeking implementation of talent acquisition and onboarding system. Must include career site development, applicant tracking, assessment integration, and automated onboarding workflows.',
      published: createDummyDate(-7),
      deadline: createDummyDate(22),
      organization: 'National Healthcare Group',
      contactInfo: 'talent.acquisition@nationalhealthcare.org',
      url: 'https://nationalhealthcare.org/suppliers/hr-systems',
      source: 'Direct',
      tags: ['Human Capital Management', 'Talent Acquisition', 'Onboarding', 'Healthcare']
    },
    
    // Internet of Things (IoT) RFPs
    {
      id: '27',
      title: 'Smart Building IoT Implementation for Corporate Campus',
      description: 'Corporate enterprise seeking IoT solutions provider to implement smart building technology across corporate campus. Requirements include energy management, space utilization, environmental monitoring, and predictive maintenance.',
      published: createDummyDate(-8),
      deadline: createDummyDate(25),
      organization: 'Corporate Real Estate Holdings',
      contactInfo: 'facilities@corporaterealestate.com',
      url: 'https://corporaterealestate.com/suppliers/iot-rfp',
      source: 'Direct',
      tags: ['Internet of Things (IoT)', 'Smart Buildings', 'Corporate', 'Facilities']
    },
    {
      id: '28',
      title: 'IoT-Based Supply Chain Visibility Solution',
      description: 'Manufacturing and distribution company seeking IoT-based supply chain visibility solution. Requirements include real-time asset tracking, environmental monitoring for sensitive products, and predictive analytics for logistics optimization.',
      published: createDummyDate(-6),
      deadline: createDummyDate(18),
      organization: 'Global Supply Chain Solutions',
      contactInfo: 'procurement@globalsupplychain.com',
      url: 'https://globalsupplychain.com/partners',
      source: 'Industry Portal',
      tags: ['Internet of Things (IoT)', 'Supply Chain', 'Manufacturing', 'Logistics']
    },
    {
      id: '29',
      title: 'Industrial IoT Platform for Manufacturing Operations',
      description: 'Industrial manufacturer seeking implementation of IIoT platform for manufacturing operations. Project includes sensor integration, edge computing deployment, real-time monitoring, and predictive quality analytics.',
      published: createDummyDate(-10),
      deadline: createDummyDate(15),
      organization: 'Precision Industrial Manufacturing',
      contactInfo: 'operations.tech@precisionindustrial.com',
      url: 'https://precisionindustrial.com/rfps/iiot',
      source: 'Direct',
      tags: ['Internet of Things (IoT)', 'IIoT', 'Manufacturing', 'Industrial']
    },
    
    // Machine Learning RFPs
    {
      id: '30',
      title: 'Machine Learning Models for Financial Risk Assessment',
      description: 'Financial institution seeking partner to develop and implement machine learning models for credit risk assessment and fraud detection. Must include model development, validation, deployment, and monitoring capabilities.',
      published: createDummyDate(-7),
      deadline: createDummyDate(20),
      organization: 'National Banking Corporation',
      contactInfo: 'risk.analytics@nationalbanking.com',
      url: 'https://nationalbanking.com/suppliers/ml-rfp',
      source: 'Direct',
      tags: ['Machine Learning', 'Financial Services', 'Risk Assessment', 'Analytics']
    },
    {
      id: '31',
      title: 'Computer Vision and ML for Quality Control in Manufacturing',
      description: 'Electronics manufacturer seeking implementation of computer vision and machine learning solution for automated quality control. Must include visual inspection system, defect detection algorithms, and integration with production line.',
      published: createDummyDate(-5),
      deadline: createDummyDate(25),
      organization: 'Advanced Electronics Manufacturing',
      contactInfo: 'quality.tech@advancedelectronics.com',
      url: 'https://advancedelectronics.com/procurement',
      source: 'Industry Portal',
      tags: ['Machine Learning', 'Computer Vision', 'Quality Control', 'Manufacturing']
    },
    {
      id: '32',
      title: 'ML-Powered Demand Forecasting and Inventory Optimization',
      description: 'Retail chain seeking machine learning solution for demand forecasting and inventory optimization. Project includes development of prediction models, integration with ERP system, and user-friendly dashboards.',
      published: createDummyDate(-9),
      deadline: createDummyDate(18),
      organization: 'Nationwide Retail Group',
      contactInfo: 'supply.chain@nationwideretail.com',
      url: 'https://nationwideretail.com/partners/analytics-rfp',
      source: 'Direct',
      tags: ['Machine Learning', 'Demand Forecasting', 'Inventory', 'Retail']
    },
    
    // Managed Services RFPs
    {
      id: '33',
      title: 'Managed IT Services for Healthcare Network',
      description: 'Healthcare organization seeking managed IT services provider for comprehensive IT operations support. Services include infrastructure management, help desk, cybersecurity, and compliance monitoring for 50+ locations.',
      published: createDummyDate(-6),
      deadline: createDummyDate(20),
      organization: 'Regional Healthcare Network',
      contactInfo: 'it.procurement@regionalhealthcare.org',
      url: 'https://regionalhealthcare.org/procurement/it-services',
      source: 'Direct',
      tags: ['Managed Services', 'IT Services', 'Healthcare', 'Infrastructure']
    },
    {
      id: '34',
      title: 'Cloud Managed Services and Security Operations',
      description: 'Financial services firm seeking managed services provider for cloud infrastructure and security operations. Services include 24/7 monitoring, incident response, patch management, and compliance reporting.',
      published: createDummyDate(-8),
      deadline: createDummyDate(15),
      organization: 'Investment Management Group',
      contactInfo: 'cloud.security@investmentgroup.com',
      url: 'https://investmentgroup.com/suppliers/managed-services',
      source: 'Industry Portal',
      tags: ['Managed Services', 'Cloud', 'Security', 'Financial Services']
    },
    {
      id: '35',
      title: 'Managed Application Services for ERP and CRM',
      description: 'Manufacturing company seeking managed application services for ERP and CRM platforms. Services include application support, performance monitoring, enhancement implementation, and integration management.',
      published: createDummyDate(-3),
      deadline: createDummyDate(22),
      organization: 'Industrial Manufacturing Corporation',
      contactInfo: 'application.support@industrialmfg.com',
      url: 'https://industrialmfg.com/procurement/app-services',
      source: 'Direct',
      tags: ['Managed Services', 'Application Management', 'ERP', 'CRM', 'Manufacturing']
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
