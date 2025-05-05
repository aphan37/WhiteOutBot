import { User } from '../types/user';
import { GameEvent } from '../types/event';
import { Alliance } from '../types/alliance';
import { GiftCode } from '../types/giftCode';

// For demo purposes, we'll use mock data
// In a real implementation, these would make API calls

// Mock data
const mockUser: User = {
  id: 1,
  characterId: 'player12345',
  adminLevel: 1, // Admin for demo
  loginTime: new Date().toISOString()
};

const mockEvents: GameEvent[] = [
  {
    id: 1,
    eventId: 'evt123',
    type: 'fishing',
    characterId: 1,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    details: 'Fishing event started at Location A'
  },
  {
    id: 2,
    eventId: 'evt124',
    type: 'bear_hunt',
    characterId: 1,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    details: 'Bear Hunt event at Mountain Ridge'
  },
  {
    id: 3,
    eventId: 'evt125',
    type: 'alliance',
    characterId: 1,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    details: 'Alliance war preparation phase'
  }
];

const mockAlliance: Alliance = {
  id: 1,
  name: 'Winter Warriors',
  memberCount: 25,
  power: 12500000,
  rank: 12,
  territory: 'North Region',
  lastChecked: new Date().toISOString(),
  createdBy: 1
};

const mockAlliances: Alliance[] = [
  mockAlliance,
  {
    id: 2,
    name: 'Frost Fighters',
    memberCount: 18,
    power: 9200000,
    rank: 23,
    territory: 'East Region',
    lastChecked: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 1
  }
];

const mockGiftCodes: GiftCode[] = [
  {
    id: 1,
    code: 'ABC12345',
    status: 'redeemed',
    expiry: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
    userId: 1
  },
  {
    id: 2,
    code: 'XYZ98765',
    status: 'unredeemed',
    expiry: new Date(Date.now() + 259200000).toISOString() // 3 days from now
  },
  {
    id: 3,
    code: 'DEF55555',
    status: 'expired',
    expiry: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userId: 1
  }
];

// Auth
export const loginUser = async (characterId: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would validate the character ID
  if (characterId.trim().length < 5) {
    throw new Error('Invalid character ID format');
  }
  
  // Return our mock user with the provided character ID
  return {
    ...mockUser,
    characterId
  };
};

// Events
export const fetchEvents = async (): Promise<GameEvent[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockEvents];
};

// Alliance
export const fetchAlliance = async (): Promise<Alliance> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  return { ...mockAlliance };
};

export const fetchAlliances = async (): Promise<Alliance[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockAlliances];
};

export const createOrUpdateAlliance = async (name: string): Promise<Alliance> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would actually create/update the alliance
  return {
    ...mockAlliance,
    name,
    lastChecked: new Date().toISOString()
  };
};

// Gift Codes
export const fetchGiftCodes = async (): Promise<GiftCode[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockGiftCodes];
};

export const addGiftCode = async (code: string): Promise<GiftCode> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would actually add the code
  const newCode: GiftCode = {
    id: Math.floor(Math.random() * 10000),
    code,
    status: 'unredeemed',
    expiry: new Date(Date.now() + 604800000).toISOString() // 7 days from now
  };
  
  mockGiftCodes.push(newCode);
  return newCode;
};

// Script execution
export const executeScript = async (
  scriptName: string, 
  params: Record<string, any> = {}
): Promise<any> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, this would call the backend to execute the script
  switch (scriptName) {
    case 'redeem_gift_code':
      const { code } = params;
      const giftCode = mockGiftCodes.find(c => c.code === code);
      if (giftCode) {
        giftCode.status = 'redeemed';
      }
      return { success: true, message: `Redeemed code: ${code}` };
      
    case 'sync_alliance_members':
      // Simulate updating alliance member list
      return { 
        success: true, 
        message: 'Alliance members synced',
        memberCount: mockAlliance.memberCount
      };
      
    case 'fetch_alliance_data':
      // Simulate fetching updated alliance data
      return {
        success: true,
        message: 'Alliance data fetched',
        alliance: mockAlliance
      };
      
    default:
      throw new Error(`Unknown script: ${scriptName}`);
  }
};