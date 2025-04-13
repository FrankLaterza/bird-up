/**
 * Clean and format a bird species name from ML model format to display format
 * @param {string} speciesName - Raw species name (e.g., "141.artic_tern")
 * @returns {string} - Formatted species name (e.g., "Arctic Tern")
 */
export function formatSpeciesName(speciesName) {
  if (!speciesName) return 'Unknown Species';
  
  try {
    // Remove number prefix (e.g., "141.")
    let formatted = speciesName.replace(/^\d+\./, '');
    
    // Replace underscores with spaces
    formatted = formatted.replace(/_/g, ' ');
    
    // Capitalize each word
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (error) {
    console.error('Error formatting species name:', error);
    return speciesName; // Return original as fallback
  }
}

/**
 * Format a timestamp into a more readable date and time format
 * @param {string} timestamp - Timestamp in format 'YYYY-MM-DD HH:MM:SS'
 * @returns {string} - Formatted date and time string
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return 'Just now';

  try {
    // Parse the timestamp
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Just now'; // Return default if parsing failed
    }

    // Format options for date
    const dateOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    // Format options for time
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    // Format the date and time
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    // Combine them
    return `${formattedDate} at ${formattedTime}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Just now'; // Return default as fallback
  }
}
