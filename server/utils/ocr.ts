import { createWorker } from 'tesseract.js';
import { OCRResult, ParkingRuleSet, ParkingRule } from '@shared/types';

// Function to extract text from image using Tesseract.js
export async function extractTextFromImage(imageData: string): Promise<OCRResult> {
  try {
    // Create a worker for OCR processing
    const worker = await createWorker('eng');
    
    // Prepare the image data (remove data URL prefix if present)
    const processedImageData = imageData.startsWith('data:image')
      ? imageData
      : `data:image/jpeg;base64,${imageData}`;
      
    // Recognize text in the image
    const result = await worker.recognize(processedImageData);
    
    // Terminate the worker
    await worker.terminate();
    
    // Check if text was detected
    if (!result.data.text || result.data.text.trim().length === 0) {
      return { 
        success: false, 
        text: '', 
        error: 'No text detected in the image' 
      };
    }
    
    return { success: true, text: result.data.text };
  } catch (error) {
    console.error('OCR processing error:', error);
    return { 
      success: false, 
      text: '', 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Common parking sign keywords and patterns
const PARKING_KEYWORDS = [
  'parking', 'hour', 'minute', 'hr', 'min', 'am', 'pm',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
  'no parking', 'loading', 'permit', 'zone', 'except', 'vehicles',
  'street cleaning', 'school days', 'holidays'
];

const TIME_REGEX = /(\d{1,2})(:|\.)?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)/i;
const HOUR_LIMIT_REGEX = /(\d+)\s*(hour|hr)/i;
const MINUTE_LIMIT_REGEX = /(\d+)\s*(minute|min)/i;

// Process the OCR text to extract parking rules
export function processParkingSign(text: string): ParkingRuleSet {
  // Normalize text: remove extra whitespace, convert to lowercase
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ').trim();
  
  // Check if the text contains parking-related keywords
  const containsParkingInfo = PARKING_KEYWORDS.some(keyword => normalizedText.includes(keyword));
  
  if (!containsParkingInfo) {
    // Return default ruleset if no parking info is found
    return {
      rules: [
        {
          type: 'notAllowed',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          startTime: '00:00',
          endTime: '23:59',
          description: 'No clear parking rules detected'
        }
      ],
      signText: text
    };
  }
  
  const rules: ParkingRule[] = [];
  
  // Check for no parking zones
  if (normalizedText.includes('no parking')) {
    // Try to extract time ranges and days for no parking
    const noParkingRule = extractTimeBasedRule(normalizedText, 'notAllowed');
    if (noParkingRule) {
      rules.push(noParkingRule);
    } else {
      // Default no parking rule if specifics can't be extracted
      rules.push({
        type: 'notAllowed',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        startTime: '00:00',
        endTime: '23:59',
        description: 'No parking'
      });
    }
  }
  
  // Check for time-limited parking
  const hourLimitMatch = HOUR_LIMIT_REGEX.exec(normalizedText);
  const minuteLimitMatch = MINUTE_LIMIT_REGEX.exec(normalizedText);
  
  if (hourLimitMatch || minuteLimitMatch) {
    let durationMinutes = 0;
    
    if (hourLimitMatch) {
      durationMinutes += parseInt(hourLimitMatch[1], 10) * 60;
    }
    
    if (minuteLimitMatch) {
      durationMinutes += parseInt(minuteLimitMatch[1], 10);
    }
    
    const timeRule = extractTimeBasedRule(normalizedText, 'allowed');
    if (timeRule) {
      rules.push({
        ...timeRule,
        durationMinutes
      });
    } else {
      // Default time limited rule
      rules.push({
        type: 'allowed',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '08:00',
        endTime: '18:00',
        description: `${durationMinutes/60} hour parking`,
        durationMinutes
      });
    }
  }
  
  // If no specific rules were extracted, create a default allowed rule
  if (rules.length === 0) {
    rules.push({
      type: 'allowed',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      startTime: '00:00',
      endTime: '23:59',
      description: 'Parking allowed'
    });
  }
  
  return {
    rules,
    signText: text
  };
}

// Helper function to extract time-based rules
function extractTimeBasedRule(text: string, type: 'allowed' | 'notAllowed'): ParkingRule | null {
  // Try to find time ranges in the text
  const timeMatches = [...text.matchAll(TIME_REGEX)];
  
  if (timeMatches.length >= 2) {
    // Extract start and end times
    const startTimeStr = timeMatches[0][0];
    const endTimeStr = timeMatches[1][0];
    
    const startTime = convertTo24Hour(startTimeStr);
    const endTime = convertTo24Hour(endTimeStr);
    
    // Detect days mentioned in the text
    const days = extractDays(text);
    
    return {
      type,
      days,
      startTime,
      endTime,
      description: type === 'allowed' 
        ? `Parking allowed from ${startTimeStr} to ${endTimeStr}` 
        : `No parking from ${startTimeStr} to ${endTimeStr}`
    };
  }
  
  return null;
}

// Helper function to extract days from text
function extractDays(text: string): string[] {
  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const shortDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  
  const mentionedDays: string[] = [];
  
  // Check for specific days
  for (let i = 0; i < allDays.length; i++) {
    if (text.includes(allDays[i]) || text.includes(shortDays[i])) {
      mentionedDays.push(allDays[i]);
    }
  }
  
  // Check for "weekdays" or "weekends"
  if (text.includes('weekday')) {
    mentionedDays.push(...allDays.slice(0, 5));
  }
  
  if (text.includes('weekend')) {
    mentionedDays.push(...allDays.slice(5, 7));
  }
  
  // If "all days" or "everyday" is mentioned
  if (text.includes('all day') || text.includes('everyday') || text.includes('all days')) {
    return allDays;
  }
  
  // If "except holidays" is mentioned
  if (text.includes('except holiday')) {
    // For simplicity, we'll just return weekdays
    return allDays.slice(0, 5);
  }
  
  // If no specific days are mentioned, default to weekdays
  return mentionedDays.length > 0 ? [...new Set(mentionedDays)] : allDays.slice(0, 5);
}

// Helper function to convert AM/PM time to 24-hour format
function convertTo24Hour(timeStr: string): string {
  const match = TIME_REGEX.exec(timeStr);
  if (!match) return '00:00';
  
  let hours = parseInt(match[1], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  const isPM = match[4].toLowerCase().includes('p');
  
  if (isPM && hours < 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
