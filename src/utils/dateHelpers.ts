/**
 * Calculate the number of days remaining until a subscription expires.
 * 
 * @param subscriptionDate - The subscription start date in YYYY-MM-DD format
 * @returns The number of days remaining (0 if expired)
 */
export function getDaysLeft(subscriptionDate: string): number {
  try {
    // Parse the subscription date (YYYY-MM-DD format)
    const startDate = new Date(subscriptionDate);
    
    // Validate the date
    if (isNaN(startDate.getTime())) {
      console.warn(`Invalid subscription date: ${subscriptionDate}`);
      return 0;
    }
    
    // Calculate expiration date (subscription_date + 30 days)
    const expirationDate = new Date(startDate);
    expirationDate.setDate(startDate.getDate() + 30);
    
    // Get current date (timezone-safe by using local date)
    const currentDate = new Date();
    
    // Reset time components to avoid timezone issues with day calculations
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const expirationDateOnly = new Date(expirationDate.getFullYear(), expirationDate.getMonth(), expirationDate.getDate());
    
    // Calculate difference in milliseconds
    const timeDifference = expirationDateOnly.getTime() - currentDateOnly.getTime();
    
    // Convert to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    // Return 0 if expired (negative days), otherwise return the days remaining
    return Math.max(0, daysDifference);
  } catch (error) {
    console.error(`Error calculating days left for date ${subscriptionDate}:`, error);
    return 0;
  }
}