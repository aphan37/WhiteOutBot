import React from 'react';
import { Users, Trophy, Shield, Target } from 'lucide-react';
import { Alliance } from '../../types/alliance';

interface AllianceStatsProps {
  alliance: Alliance | null;
  isLoading: boolean;
}

const AllianceStats: React.FC<AllianceStatsProps> = ({ alliance, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-24">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!alliance) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No alliance data available. Try running the sync script to fetch alliance information.
        </p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Members',
      value: alliance.memberCount,
      icon: <Users className="text-blue-500" size={20} />,
    },
    {
      name: 'Power',
      value: alliance.power?.toLocaleString() || 'N/A',
      icon: <Trophy className="text-amber-500" size={20} />,
    },
    {
      name: 'Territory',
      value: alliance.territory || 'N/A',
      icon: <Target className="text-green-500" size={20} />,
    },
    {
      name: 'Rank',
      value: alliance.rank?.toLocaleString() || 'N/A',
      icon: <Shield className="text-purple-500" size={20} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div 
          key={stat.name} 
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-2">
            {stat.icon}
            <h3 className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.name}
            </h3>
          </div>
          <p className="text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AllianceStats;