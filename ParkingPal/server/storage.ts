import { 
  User, InsertUser, 
  ParkingSign, InsertParkingSign,
  ParkingHistory, InsertParkingHistory
} from "@shared/schema";
import { ParkingAnalysisResult, ParkingRuleSet } from "@shared/types";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Parking sign operations
  createParkingSign(sign: InsertParkingSign): Promise<ParkingSign>;
  getParkingSign(id: number): Promise<ParkingSign | undefined>;
  getParkingSignsByUserId(userId: number): Promise<ParkingSign[]>;
  
  // Parking history operations
  createParkingHistory(history: InsertParkingHistory): Promise<ParkingHistory>;
  getParkingHistoryByUserId(userId: number): Promise<ParkingHistory[]>;
  getRecentParkingHistory(limit: number): Promise<ParkingHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parkingSigns: Map<number, ParkingSign>;
  private parkingHistory: Map<number, ParkingHistory>;
  private currentUserId: number;
  private currentSignId: number;
  private currentHistoryId: number;

  constructor() {
    this.users = new Map();
    this.parkingSigns = new Map();
    this.parkingHistory = new Map();
    this.currentUserId = 1;
    this.currentSignId = 1;
    this.currentHistoryId = 1;
    
    // Create a default user
    this.createUser({
      username: "user1",
      password: "password123",
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Parking sign methods
  async createParkingSign(insertSign: InsertParkingSign): Promise<ParkingSign> {
    const id = this.currentSignId++;
    const sign: ParkingSign = { 
      ...insertSign, 
      id, 
      createdAt: new Date() 
    };
    this.parkingSigns.set(id, sign);
    return sign;
  }
  
  async getParkingSign(id: number): Promise<ParkingSign | undefined> {
    return this.parkingSigns.get(id);
  }
  
  async getParkingSignsByUserId(userId: number): Promise<ParkingSign[]> {
    return Array.from(this.parkingSigns.values()).filter(
      (sign) => sign.userId === userId
    );
  }
  
  // Parking history methods
  async createParkingHistory(insertHistory: InsertParkingHistory): Promise<ParkingHistory> {
    const id = this.currentHistoryId++;
    const history: ParkingHistory = { 
      ...insertHistory, 
      id, 
      createdAt: new Date() 
    };
    this.parkingHistory.set(id, history);
    return history;
  }
  
  async getParkingHistoryByUserId(userId: number): Promise<ParkingHistory[]> {
    return Array.from(this.parkingHistory.values())
      .filter((history) => history.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getRecentParkingHistory(limit: number): Promise<ParkingHistory[]> {
    return Array.from(this.parkingHistory.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
