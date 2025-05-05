export interface Alliance {
  id: number;
  name: string;
  memberCount: number;
  power?: number;
  rank?: number;
  territory?: string;
  lastChecked?: string;
  createdBy: number;
}