import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import AllianceForm from '../components/admin/AllianceForm';
import MemberImport from '../components/admin/MemberImport';
import { fetchAlliances } from '../services/api';
import { Alliance } from '../types/alliance';

const AdminPage: React.FC = () => {
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAlliances = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAlliances();
      setAlliances(data);
    } catch (error) {
      console.error('Failed to load alliances', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlliances();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-6">
        <Shield size={24} className="text-blue-500 mr-3" />
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <AllianceForm onAllianceCreated={loadAlliances} />
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-5 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4">Alliances</h2>
            
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : alliances.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No alliances found. Create your first alliance above.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {alliances.map((alliance) => (
                  <li key={alliance.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{alliance.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {alliance.memberCount} members
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {new Date(alliance.lastChecked || '').toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div>
          <MemberImport />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;