import React, { useState } from 'react';
import { Users, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { executeScript } from '../../services/api';

const MemberImport: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const importMembers = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }
    
    setIsExecuting(true);
    
    try {
      // In a real implementation, this would upload the CSV file
      // For demo purposes, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      await executeScript('sync_alliance_members');
      toast.success('Alliance members imported successfully');
      setCsvFile(null);
    } catch (error) {
      toast.error(`Failed to import members: ${(error as Error).message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Users size={20} className="text-blue-500 mr-2" />
        <h2 className="text-lg font-medium">Member Import</h2>
      </div>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <div className="mb-4">
            <Upload size={32} className="mx-auto text-gray-400" />
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Upload a CSV file with member data or use the sync script to import members
          </p>
          
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            className="hidden"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
          />
          
          <label
            htmlFor="csvFile"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 inline-block cursor-pointer"
          >
            Choose CSV File
          </label>
          
          {csvFile && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Selected: {csvFile.name}
            </p>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={importMembers}
            disabled={!csvFile || isExecuting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : (
              <Upload size={18} className="mr-2" />
            )}
            Import Members
          </button>
          
          <button
            onClick={() => executeScript('sync_alliance_members')}
            disabled={isExecuting}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Users size={18} className="mr-2" />
            Sync Members from Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberImport;