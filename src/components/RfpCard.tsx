
import React from 'react';
import { CalendarClock, Building2, ChevronRight, Tag } from 'lucide-react';
import { RFP } from '@/utils/types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface RfpCardProps {
  rfp: RFP;
}

const RfpCard: React.FC<RfpCardProps> = ({ rfp }) => {
  const daysToDeadline = rfp.deadline 
    ? Math.ceil((new Date(rfp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const deadlineStatus = () => {
    if (!daysToDeadline) return null;
    
    if (daysToDeadline <= 0) {
      return { text: 'Closed', color: 'text-destructive' };
    } else if (daysToDeadline <= 5) {
      return { text: `${daysToDeadline} days left`, color: 'text-destructive' };
    } else if (daysToDeadline <= 14) {
      return { text: `${daysToDeadline} days left`, color: 'text-amber-500' };
    } else {
      return { text: `${daysToDeadline} days left`, color: 'text-green-500' };
    }
  };

  const publishedDate = rfp.published ? new Date(rfp.published) : null;
  const publishedText = publishedDate 
    ? `Published ${formatDistanceToNow(publishedDate, { addSuffix: true })}` 
    : 'Recently published';

  const status = deadlineStatus();

  return (
    <div className="glass-card group hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2 mb-2">
              {rfp.tags && rfp.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            {status && (
              <div className={`text-sm font-medium whitespace-nowrap ${status.color}`}>
                {status.text}
              </div>
            )}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <h3 className="text-xl font-medium mt-1 mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors">
                {rfp.title}
              </h3>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{rfp.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap gap-2 mt-2">
                  {rfp.tags && rfp.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Organization</span>
                  <span className="font-medium">{rfp.organization || 'Not specified'}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <span className="font-medium">
                    {publishedDate ? publishedDate.toLocaleDateString() : 'Not available'}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <span className="font-medium">
                    {rfp.deadline ? new Date(rfp.deadline).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="font-medium">{rfp.source || 'Not available'}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Description</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {rfp.description || 'No detailed description available.'}
                </div>
              </div>
              
              {rfp.contactInfo && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="text-sm text-muted-foreground">
                    {rfp.contactInfo}
                  </div>
                </div>
              )}
              
              {rfp.url && (
                <div className="mt-6 flex justify-end">
                  <Button asChild>
                    <a href={rfp.url} target="_blank" rel="noopener noreferrer">
                      View Original <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          <p className="text-muted-foreground line-clamp-2">
            {rfp.description || 'No description available.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            <span className="truncate max-w-[200px]">{rfp.organization || 'Unknown organization'}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
            <span>{publishedText}</span>
          </div>
        </div>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-primary/5 group-hover:bg-primary/10 transition-colors py-2 flex justify-center items-center cursor-pointer border-t border-border/40">
            <span className="text-sm font-medium text-primary">View Details</span>
            <ChevronRight className="ml-1 h-4 w-4 text-primary" />
          </div>
        </DialogTrigger>
        
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {/* Same content as above */}
          <DialogHeader>
            <DialogTitle className="text-2xl">{rfp.title}</DialogTitle>
            <DialogDescription className="flex flex-wrap gap-2 mt-2">
              {rfp.tags && rfp.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Organization</span>
              <span className="font-medium">{rfp.organization || 'Not specified'}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Published</span>
              <span className="font-medium">
                {publishedDate ? publishedDate.toLocaleDateString() : 'Not available'}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Deadline</span>
              <span className="font-medium">
                {rfp.deadline ? new Date(rfp.deadline).toLocaleDateString() : 'Not specified'}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Source</span>
              <span className="font-medium">{rfp.source || 'Not available'}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {rfp.description || 'No detailed description available.'}
            </div>
          </div>
          
          {rfp.contactInfo && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="text-sm text-muted-foreground">
                {rfp.contactInfo}
              </div>
            </div>
          )}
          
          {rfp.url && (
            <div className="mt-6 flex justify-end">
              <Button asChild>
                <a href={rfp.url} target="_blank" rel="noopener noreferrer">
                  View Original <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RfpCard;
