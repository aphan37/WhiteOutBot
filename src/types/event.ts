export interface GameEvent {
  id: number;
  eventId: string;
  type: string; // e.g., fishing, bear_hunt
  characterId: number;
  timestamp: string;
  details?: string;
}