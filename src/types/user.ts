export interface User {
  id: number;
  characterId: string;
  adminLevel: number; // 0 = regular user, 1 = admin
  loginTime: string;
}