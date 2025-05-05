import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { createOrUpdateAlliance } from '../../services/api';

interface AllianceFormProps {
  onAllianceCreated: () => void;
}

const AllianceForm: React.FC<AllianceFormProps> = ({ onAllianceCreated }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter an alliance name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createOrUpdateAlliance(name);
      toast.success('Alliance created/updated successfully');
      setName('');
      onAllianceCreated();
    } catch (error) {
      toast.error(`Failed to create/update alliance: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-5 border border-gray-100 dark:border-gray-700 mb-6">
      <div className="flex items-center mb-4">
        <Shield size={20} className="text-blue-500 mr-2" />
        <h2 className="text-lg font-medium">Alliance Management</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="allianceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alliance Name
            </label>
            <input
              type="text"
              id="allianceName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter alliance name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Shield size={18} className="mr-2" />
              )}
              Create/Update Alliance
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AllianceForm;