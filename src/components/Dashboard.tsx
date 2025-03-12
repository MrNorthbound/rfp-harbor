
import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import FilterBar from './FilterBar';
import RfpCard from './RfpCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RFP } from '@/utils/types';
import { fetchData } from '@/utils/dataFetcher';
import { getRfps } from '@/utils/storage';

const Dashboard: React.FC = () => {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [filteredRfps, setFilteredRfps] = useState<RFP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      // First try to get data from localStorage
      const storedRfps = getRfps();
      
      if (storedRfps.length > 0) {
        setRfps(storedRfps);
        setFilteredRfps(storedRfps);
        const timestamp = localStorage.getItem('rfp_last_updated');
        if (timestamp) {
          setLastUpdated(new Date(timestamp));
        }
        setIsLoading(false);
      }
      
      // Then fetch fresh data in the background
      const freshData = await fetchData();
      setRfps(freshData);
      setFilteredRfps(freshData);
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

  const handleFilter = (filtered: RFP[]) => {
    setFilteredRfps(filtered);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight transition-all">ServiceNow RFP Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and track ServiceNow ecosystem procurement opportunities
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

      <FilterBar rfps={rfps} onFilter={handleFilter} />

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
            <h3 className="text-lg font-medium">No matching RFPs found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or refreshing the data</p>
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
