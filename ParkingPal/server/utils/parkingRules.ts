import { ParkingRuleSet, ParkingAnalysisResult, ParkingRule } from '@shared/types';

// Analyze parking rules based on current time
export function analyzeParkingRules(ruleSet: ParkingRuleSet): ParkingAnalysisResult {
  const now = new Date();
  const currentDay = getDayName(now).toLowerCase();
  const currentTime = formatTime(now);
  
  // Format for display
  const formattedDate = now.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric' 
  });
  
  const formattedTime = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  });
  
  // Check if parking is allowed based on the rules
  const { isAllowed, rule, endTime } = isParkingAllowed(ruleSet.rules, currentDay, currentTime);
  
  // Calculate time remaining if parking is allowed
  let timeRemaining: string | undefined;
  if (isAllowed && rule && rule.durationMinutes) {
    timeRemaining = calculateTimeRemaining(rule.durationMinutes);
  } else if (isAllowed && endTime) {
    timeRemaining = calculateTimeDifference(currentTime, endTime);
  }
  
  return {
    isAllowed,
    timeRemaining,
    currentTime: formattedTime,
    date: formattedDate,
    startTime: rule?.startTime,
    endTime: isAllowed ? endTime : getNearestAllowedTime(ruleSet.rules, currentDay, currentTime),
    reason: isAllowed ? undefined : "Parking not allowed during this time",
    rules: ruleSet.rules,
    signText: ruleSet.signText
  };
}

// Check if parking is allowed based on current day and time
function isParkingAllowed(
  rules: ParkingRule[], 
  currentDay: string, 
  currentTime: string
): { isAllowed: boolean; rule?: ParkingRule; endTime?: string } {
  // First, check explicitly disallowed rules
  const notAllowedRules = rules.filter(rule => 
    rule.type === 'notAllowed' && 
    rule.days.includes(currentDay) &&
    isTimeInRange(currentTime, rule.startTime, rule.endTime)
  );
  
  if (notAllowedRules.length > 0) {
    return { 
      isAllowed: false, 
      rule: notAllowedRules[0],
      endTime: notAllowedRules[0].endTime
    };
  }
  
  // Then, check allowed rules
  const allowedRules = rules.filter(rule => 
    rule.type === 'allowed' && 
    rule.days.includes(currentDay) &&
    isTimeInRange(currentTime, rule.startTime, rule.endTime)
  );
  
  if (allowedRules.length > 0) {
    return { 
      isAllowed: true, 
      rule: allowedRules[0],
      endTime: allowedRules[0].endTime
    };
  }
  
  // Default case: parking not allowed
  return { isAllowed: false };
}

// Check if a time is within a given range
function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  return time >= startTime && time <= endTime;
}

// Get the name of the day for a given date
function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Format time as HH:MM in 24-hour format
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Calculate time remaining in hours and minutes
function calculateTimeRemaining(durationMinutes: number): string {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

// Calculate the time difference between two times in HH:MM format
function calculateTimeDifference(startTime: string, endTime: string): string {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  
  // Handle time wrapping around midnight
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

// Get the nearest time when parking will be allowed
function getNearestAllowedTime(
  rules: ParkingRule[], 
  currentDay: string, 
  currentTime: string
): string | undefined {
  // Find allowed rules for the current day that start after the current time
  const allowedRules = rules
    .filter(rule => 
      rule.type === 'allowed' && 
      rule.days.includes(currentDay) &&
      rule.startTime > currentTime
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  if (allowedRules.length > 0) {
    // Convert 24-hour format to 12-hour format for display
    const [hours, minutes] = allowedRules[0].startTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  return undefined;
}
