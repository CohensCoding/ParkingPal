/**
 * Format the current date and time in a human-readable format
 * e.g., "Tue, 4:30 PM"
 */
export function formatCurrentDateTime(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  };
  
  return now.toLocaleString('en-US', options);
}

/**
 * Convert minutes to hours and minutes format
 * @param minutes Total minutes
 * @returns Formatted string like "1h 30m" or "45m"
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  }
  
  return `${remainingMinutes}m`;
}

/**
 * Calculate time difference between two dates
 * @param start Start date
 * @param end End date
 * @returns Time difference in minutes
 */
export function getTimeDifferenceInMinutes(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 60000);
}

/**
 * Format a time string in 12-hour format
 * @param timeStr Time string in 24-hour format (HH:MM)
 * @returns Formatted time string (e.g., "4:30 PM")
 */
export function formatTime12h(timeStr: string): string {
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}
