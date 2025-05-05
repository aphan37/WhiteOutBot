import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import GiftCodeForm from '../components/gift-codes/GiftCodeForm';
import GiftCodeTable from '../components/gift-codes/GiftCodeTable';
import { fetchGiftCodes } from '../services/api';
import { GiftCode } from '../types/giftCode';

const GiftCodesPage: React.FC = () => {
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGiftCodes = async () => {
    try {
      setIsLoading(true);
      const codes = await fetchGiftCodes();
      setGiftCodes(codes);
    } catch (error) {
      console.error('Failed to load gift codes', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGiftCodes();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-6">
        <Gift size={24} className="text-blue-500 mr-3" />
        <h1 className="text-2xl font-semibold">Gift Codes</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <GiftCodeForm onCodeAdded={loadGiftCodes} />
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-medium mb-4">Your Gift Codes</h2>
          <GiftCodeTable 
            codes={giftCodes} 
            isLoading={isLoading} 
            onRefresh={loadGiftCodes} 
          />
        </div>
      </div>
    </div>
  );
};

export default GiftCodesPage;