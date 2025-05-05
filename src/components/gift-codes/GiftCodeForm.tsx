import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { addGiftCode } from '../../services/api';

interface GiftCodeFormProps {
  onCodeAdded: () => void;
}

const GiftCodeForm: React.FC<GiftCodeFormProps> = ({ onCodeAdded }) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error('Please enter a gift code');
      return;
    }
    
    // Simple validation for code format (8 characters, alphanumeric)
    const codeRegex = /^[A-Z0-9]{8}$/;
    if (!codeRegex.test(code)) {
      toast.error('Gift code must be 8 characters (A-Z, 0-9)');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addGiftCode(code);
      toast.success('Gift code added successfully');
      setCode('');
      onCodeAdded();
    } catch (error) {
      toast.error(`Failed to add gift code: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="giftCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Gift Code
          </label>
          <input
            type="text"
            id="giftCode"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter 8-character code"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={isSubmitting}
            maxLength={8}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : (
              <Plus size={18} className="mr-2" />
            )}
            Add Code
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Enter a valid gift code from the game. Only alphanumeric, 8-character codes are supported.
      </p>
    </form>
  );
};

export default GiftCodeForm;