import React, { useState } from 'react';
import { Play, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { executeScript } from '../../services/api';

const ScriptActions: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentScript, setCurrentScript] = useState<string | null>(null);

  const scripts = [
    {
      id: 'sync_alliance_members',
      name: 'Sync Alliance Members',
      description: 'Fetch and update your alliance member list',
      icon: <RefreshCw size={18} />,
    },
    {
      id: 'fetch_alliance_data',
      name: 'Fetch Alliance Data',
      description: 'Retrieve current stats for your alliance',
      icon: <RefreshCw size={18} />,
    },
  ];

  const runScript = async (scriptId: string) => {
    setIsExecuting(true);
    setCurrentScript(scriptId);
    
    try {
      const result = await executeScript(scriptId);
      toast.success(`Script "${scriptId}" executed successfully`);
      return result;
    } catch (error) {
      toast.error(`Failed to execute script: ${(error as Error).message}`);
    } finally {
      setIsExecuting(false);
      setCurrentScript(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Play size={20} className="text-blue-500 mr-2" />
        <h2 className="text-lg font-medium">Script Actions</h2>
      </div>
      
      <div className="space-y-3">
        {scripts.map((script) => (
          <button
            key={script.id}
            onClick={() => runScript(script.id)}
            disabled={isExecuting}
            className={`w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-left
              ${isExecuting && currentScript === script.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }
              transition-colors duration-200`}
          >
            <div className="flex items-center">
              <span className="mr-3 text-gray-500 dark:text-gray-400">{script.icon}</span>
              <div>
                <h3 className="font-medium">{script.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{script.description}</p>
              </div>
            </div>
            
            {isExecuting && currentScript === script.id ? (
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <Play size={18} className="text-gray-400" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm flex items-start">
        <AlertCircle size={18} className="text-amber-500 mr-2 shrink-0 mt-0.5" />
        <p className="text-amber-800 dark:text-amber-200">
          Scripts may take time to complete depending on game server response times.
          Please be patient while the operation finishes.
        </p>
      </div>
    </div>
  );
};

export default ScriptActions;