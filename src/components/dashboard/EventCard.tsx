import React from 'react';
import { GameEvent } from '../../types/event';
import { Calendar, Clock } from 'lucide-react';

interface EventCardProps {
  event: GameEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Format date and time for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    }).format(date);
  };

  // Get background color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'fishing':
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'bear_hunt':
        return 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case 'alliance':
        return 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  // Get text for event type
  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'fishing':
        return 'Fishing Event';
      case 'bear_hunt':
        return 'Bear Hunt';
      case 'alliance':
        return 'Alliance Event';
      default:
        return type.replace('_', ' ');
    }
  };

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${getEventColor(event.type)}`}>
      <h3 className="font-medium text-lg capitalize mb-2">
        {getEventTypeText(event.type)}
      </h3>
      
      <div className="space-y-2 text-gray-600 dark:text-gray-300">
        <div className="flex items-center text-sm">
          <Calendar size={16} className="mr-2" />
          <span>{formatDate(event.timestamp)}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock size={16} className="mr-2" />
          <span>{formatTime(event.timestamp)}</span>
        </div>
      </div>
      
      {event.details && (
        <p className="mt-3 text-sm border-t pt-2 border-gray-200 dark:border-gray-700">
          {event.details}
        </p>
      )}
    </div>
  );
};

export default EventCard;