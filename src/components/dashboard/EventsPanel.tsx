import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import EventCard from './EventCard';
import { GameEvent } from '../../types/event';

interface EventsPanelProps {
  events: GameEvent[];
  isLoading: boolean;
}

const EventsPanel: React.FC<EventsPanelProps> = ({ events, isLoading }) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Get unique event types for the filter dropdown
  const eventTypes = ['all', ...new Set(events.map(event => event.type))];
  
  // Filter events based on selected type
  const filteredEvents = typeFilter === 'all' 
    ? events 
    : events.filter(event => event.type === typeFilter);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar size={20} className="text-blue-500 mr-2" />
          <h2 className="text-lg font-medium">Game Events</h2>
        </div>
        
        <div className="flex items-center">
          <Filter size={16} className="text-gray-400 mr-2" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No events found. Events will appear here when detected in-game.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPanel;