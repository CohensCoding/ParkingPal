import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const parkingSigns = pgTable("parking_signs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imageText: text("image_text").notNull(),
  rules: json("rules").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parkingHistory = pgTable("parking_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  signId: integer("sign_id").references(() => parkingSigns.id),
  isAllowed: boolean("is_allowed").notNull(),
  timeRemaining: text("time_remaining"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertParkingSignSchema = createInsertSchema(parkingSigns).pick({
  userId: true,
  imageText: true,
  rules: true,
  location: true,
});

export const insertParkingHistorySchema = createInsertSchema(parkingHistory).pick({
  userId: true,
  signId: true,
  isAllowed: true,
  timeRemaining: true,
  startTime: true,
  endTime: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertParkingSign = z.infer<typeof insertParkingSignSchema>;
export type ParkingSign = typeof parkingSigns.$inferSelect;

export type InsertParkingHistory = z.infer<typeof insertParkingHistorySchema>;
export type ParkingHistory = typeof parkingHistory.$inferSelect;
