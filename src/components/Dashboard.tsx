
import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, ChevronDown } from 'lucide-react';
import FilterBar from './FilterBar';
import RfpCard from './RfpCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RFP } from '@/utils/types';
import { fetchData } from '@/utils/dataFetcher';
import { getRfps } from '@/utils/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: 'ServiceNow', description: 'Monitor and track ServiceNow ecosystem procurement opportunities' },
  { name: 'Salesforce', description: 'Track Salesforce platform and CRM procurement opportunities' },
  { name: 'Atlassian', description: 'Discover Atlassian tools and solutions procurement opportunities' },
  { name: 'Cloud', description: 'Explore cloud infrastructure and services procurement opportunities' },
  { name: 'Cybersecurity', description: 'Find cybersecurity solutions and services procurement opportunities' },
  { name: 'Data & Artificial Intelligence', description: 'Access data and AI-related procurement opportunities' },
  { name: 'Human Capital Management', description: 'View HCM solutions procurement opportunities' },
  { name: 'Internet of Things (IoT)', description: 'Browse IoT solutions procurement opportunities' },
  { name: 'Machine Learning', description: 'Discover machine learning solutions procurement opportunities' },
  { name: 'Managed Services', description: 'Explore managed services procurement opportunities' },
];

const Dashboard: React.FC = () => {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [filteredRfps, setFilteredRfps] = useState<RFP[]>([]);
  const [categoryFilteredRfps, setCategoryFilteredRfps] = useState<RFP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const { toast } = useToast();

  // Set up listener for storage events to detect data changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rfp_data' || e.key === 'custom_data_sources') {
        console.log('Storage changed, reloading data');
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  // Filter RFPs whenever the selected category changes
  useEffect(() => {
    filterRfpsByCategory(rfps);
  }, [selectedCategory, rfps]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // First try to get data from localStorage
      const storedRfps = getRfps();
      
      if (storedRfps.length > 0) {
        setRfps(storedRfps);
        const now = new Date();
        setLastUpdated(now);
        setIsLoading(false);
      }
      
      // Then fetch fresh data in the background
      const freshData = await fetchData();
      setRfps(freshData);
      const now = new Date();
      setLastUpdated(now);
      localStorage.setItem('rfp_last_updated', now.toISOString());
      
    } catch (error) {
      console.error('Error loading RFP data:', error);
      toast({
        title: "Error",
        description: "Failed to load RFP data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterRfpsByCategory = (rfpsToFilter: RFP[]) => {
    // Filter RFPs based on selected category
    const filtered = rfpsToFilter.filter(rfp => {
      // Check if the RFP title, description, or tags contain the category name
      const categoryName = selectedCategory.name.toLowerCase();
      const titleMatch = rfp.title?.toLowerCase().includes(categoryName);
      const descriptionMatch = rfp.description?.toLowerCase().includes(categoryName);
      
      // Check if any of the tags match or are related to the category
      const tagsMatch = rfp.tags?.some(tag => {
        return tag.toLowerCase().includes(categoryName) ||
               // For broader categories, check related terms
               (categoryName === 'cloud' && 
                ['aws', 'azure', 'google cloud', 'cloud computing', 'saas', 'paas', 'iaas'].some(t => 
                  tag.toLowerCase().includes(t))) ||
               (categoryName === 'artificial intelligence' && 
                ['ai', 'machine learning', 'neural network', 'deep learning'].some(t => 
                  tag.toLowerCase().includes(t)));
      });
      
      return titleMatch || descriptionMatch || tagsMatch;
    });
    
    setCategoryFilteredRfps(filtered);
    // Apply any existing search/filter criteria to the category-filtered RFPs
    handleFilter(filtered);
  };

  const handleRefresh = async () => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest RFP opportunities...",
    });
    
    await loadData();
    
    toast({
      title: "Data refreshed",
      description: "The latest RFP opportunities have been loaded.",
    });
  };

  const handleFilter = (rfpsToFilter: RFP[]) => {
    setFilteredRfps(rfpsToFilter);
  };

  const handleCategoryChange = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    
    // Show a toast to indicate category change
    toast({
      title: `${category.name} Dashboard`,
      description: `Showing ${category.name} related procurement opportunities.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 font-bold text-3xl tracking-tight hover:no-underline flex items-center gap-2"
              >
                {selectedCategory.name} RFP Dashboard
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.name}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-muted-foreground mt-1">
            {selectedCategory.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="transition-all duration-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <FilterBar rfps={categoryFilteredRfps} onFilter={handleFilter} />

      <div className="grid grid-cols-1 gap-6 animate-fade-in">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-40 glass-card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="flex justify-between mt-6">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))
        ) : filteredRfps.length > 0 ? (
          filteredRfps.map((rfp, index) => (
            <div key={rfp.id} className={`slide-up opacity-0 delay-${index % 5 + 1}00`}>
              <RfpCard rfp={rfp} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium">No matching RFPs found for {selectedCategory.name}</h3>
            <p className="text-muted-foreground mt-1">Try selecting a different category or refreshing the data</p>
            <Button variant="outline" className="mt-4" onClick={() => handleRefresh()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
