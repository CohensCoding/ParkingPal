import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processParkingSign, extractTextFromImage } from "./utils/ocr";
import { analyzeParkingRules } from "./utils/parkingRules";
import { z } from "zod";
import { insertParkingHistorySchema, insertParkingSignSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // API route to process parking sign image
  apiRouter.post('/analyze-sign', async (req, res) => {
    try {
      const schema = z.object({
        imageData: z.string(),
        location: z.string().optional(),
      });

      const validatedData = schema.parse(req.body);
      
      // Extract text from image using OCR
      const ocrResult = await extractTextFromImage(validatedData.imageData);
      
      if (!ocrResult.success) {
        return res.status(400).json({ 
          message: "Could not process the image", 
          error: ocrResult.error 
        });
      }
      
      // Process the extracted text to identify parking rules
      const ruleSet = processParkingSign(ocrResult.text);
      
      // Analyze the rules based on current time
      const analysisResult = analyzeParkingRules(ruleSet);
      
      // Store the parking sign data
      const parkingSign = await storage.createParkingSign({
        userId: 1, // Default user ID for now
        imageText: ocrResult.text,
        rules: ruleSet,
        location: validatedData.location,
      });
      
      // Create a history record
      await storage.createParkingHistory({
        userId: 1, // Default user ID for now
        signId: parkingSign.id,
        isAllowed: analysisResult.isAllowed,
        timeRemaining: analysisResult.timeRemaining,
        startTime: new Date(),
        endTime: analysisResult.endTime ? new Date(analysisResult.endTime) : undefined,
      });
      
      return res.status(200).json(analysisResult);
    } catch (error) {
      console.error('Error processing parking sign:', error);
      return res.status(500).json({ 
        message: "Failed to process parking sign", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get user's parking history
  apiRouter.get('/history', async (req, res) => {
    try {
      const userId = 1; // Default user ID for now
      const history = await storage.getParkingHistoryByUserId(userId);
      
      // Enrich history with sign data
      const enrichedHistory = await Promise.all(
        history.map(async (entry) => {
          const sign = await storage.getParkingSign(entry.signId);
          return {
            ...entry,
            sign
          };
        })
      );
      
      return res.status(200).json(enrichedHistory);
    } catch (error) {
      console.error('Error retrieving parking history:', error);
      return res.status(500).json({ 
        message: "Failed to retrieve parking history", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Mount the API router
  app.use('/api', apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
