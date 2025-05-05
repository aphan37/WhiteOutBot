import React, { useState, useEffect } from 'react';
import AllianceStats from '../components/dashboard/AllianceStats';
import EventsPanel from '../components/dashboard/EventsPanel';
import ScriptActions from '../components/dashboard/ScriptActions';
import { fetchAlliance, fetchEvents } from '../services/api';
import { GameEvent } from '../types/event';
import { Alliance } from '../types/alliance';

const DashboardPage: React.FC = () => {
  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isLoadingAlliance, setIsLoadingAlliance] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allianceData, eventsData] = await Promise.all([
          fetchAlliance(),
          fetchEvents()
        ]);
        
        setAlliance(allianceData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoadingAlliance(false);
        setIsLoadingEvents(false);
      }
    };
    
    loadData();
    
    // Set up polling for events every 5 minutes
    const pollInterval = setInterval(async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to poll events', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <AllianceStats alliance={alliance} isLoading={isLoadingAlliance} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <EventsPanel events={events} isLoading={isLoadingEvents} />
        </div>
        <div>
          <ScriptActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;