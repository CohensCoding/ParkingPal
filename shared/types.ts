export interface ParkingRule {
  type: 'allowed' | 'notAllowed';
  days: string[];
  startTime: string;
  endTime: string;
  description: string;
  durationMinutes?: number;
}

export interface ParkingRuleSet {
  rules: ParkingRule[];
  signText: string;
}

export interface ParkingAnalysisResult {
  isAllowed: boolean;
  timeRemaining?: string;
  currentTime: string;
  date: string;
  endTime?: string;
  startTime?: string;
  reason?: string;
  rules: ParkingRule[];
  signText: string;
}

export interface ParkingSignSubmission {
  imageData: string;
  location?: string;
}

export type OCRResult = {
  success: boolean;
  text: string;
  error?: string;
};
