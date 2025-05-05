import React, { useState } from 'react';
import { Check, X, Gift, RefreshCw } from 'lucide-react';
import { GiftCode } from '../../types/giftCode';
import toast from 'react-hot-toast';
import { executeScript } from '../../services/api';

interface GiftCodeTableProps {
  codes: GiftCode[];
  isLoading: boolean;
  onRefresh: () => void;
}

const GiftCodeTable: React.FC<GiftCodeTableProps> = ({ 
  codes, 
  isLoading,
  onRefresh 
}) => {
  const [redeemingCode, setRedeemingCode] = useState<string | null>(null);

  const redeemCode = async (code: string) => {
    setRedeemingCode(code);
    
    try {
      await executeScript('redeem_gift_code', { code });
      toast.success(`Gift code ${code} redeemed successfully`);
      onRefresh();
    } catch (error) {
      toast.error(`Failed to redeem code: ${(error as Error).message}`);
    } finally {
      setRedeemingCode(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'redeemed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Check size={12} className="mr-1" /> Redeemed
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <X size={12} className="mr-1" /> Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Gift size={12} className="mr-1" /> Unredeemed
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <Gift size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No Gift Codes</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gift codes will appear here once you add them.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Expiry
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {codes.map((code) => (
            <tr key={code.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                {code.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(code.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.expiry ? new Date(code.expiry).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {code.status === 'unredeemed' ? (
                  <button
                    onClick={() => redeemCode(code.code)}
                    disabled={!!redeemingCode}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
                  >
                    {redeemingCode === code.code ? (
                      <span className="flex items-center">
                        <RefreshCw size={14} className="animate-spin mr-1" /> Redeeming...
                      </span>
                    ) : (
                      'Redeem'
                    )}
                  </button>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GiftCodeTable;