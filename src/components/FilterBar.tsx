
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RFP } from '@/utils/types';

interface FilterBarProps {
  rfps: RFP[];
  onFilter: (filtered: RFP[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ rfps, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Extract all unique tags from RFPs
  useEffect(() => {
    if (rfps.length > 0) {
      const allTags = rfps
        .flatMap(rfp => rfp.tags || [])
        .filter((tag, index, self) => self.indexOf(tag) === index && tag);
        
      setAvailableTags(allTags);
    }
  }, [rfps]);

  // Apply filters when search term or selected tags change
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const filtered = rfps.filter(rfp => {
      // Search term filter
      const matchesSearch = lowerSearchTerm === '' || 
        (rfp.title && rfp.title.toLowerCase().includes(lowerSearchTerm)) ||
        (rfp.description && rfp.description.toLowerCase().includes(lowerSearchTerm)) ||
        (rfp.organization && rfp.organization.toLowerCase().includes(lowerSearchTerm));
      
      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => rfp.tags && rfp.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
    
    onFilter(filtered);
  }, [searchTerm, selectedTags, rfps, onFilter]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by keyword, organization, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 transition-all"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <Button
          variant={filterMenuOpen ? "default" : "outline"}
          onClick={toggleFilterMenu}
          className="transition-all duration-200"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters {selectedTags.length > 0 && `(${selectedTags.length})`}
        </Button>
        {(searchTerm || selectedTags.length > 0) && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter menu */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${filterMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-all"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No tags available</span>
            )}
          </div>
        </div>
      </div>

      {/* Selected filters */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => toggleTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
