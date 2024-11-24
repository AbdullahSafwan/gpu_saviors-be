/**
 * Formats a phone number to include the "92" country code for Pakistan, normalizing it from various formats.
 * 
 * @param number - The input phone number as a string. May include non-digit characters or various prefixes.
 * @returns A standardized phone number string with the "92" country code, or the cleaned number if invalid.
 * 
 * Rules for normalization:
 * - Starts with "92" and is 11 digits: returned as is.
 * - Starts with "0092" and is 14 digits: converted to "92".
 * - Starts with "92" and is 13 digits: returned as is.
 * - Starts with "0" and is 11 digits: replaced with "92".
 * - Starts with "3" and is 10 digits: prefixed with "92".
 * - Non-matching numbers are returned as their cleaned version.
 */
const formatWhatsAppNumber = (number: string): string => {
  // Remove any non-digit characters (including spaces, dashes, etc.)
  let cleanedNumber = number.replace(/[^\d]/g, "");

  // Check for different variations of the number and normalize
  if (cleanedNumber.startsWith("92") && cleanedNumber.length === 11) {
    // If the number starts with "92" (Pakistan country code) and is 11 digits, return as is
    return cleanedNumber;
  } else if (cleanedNumber.startsWith("0092") && cleanedNumber.length === 14) {
    // If the number starts with "0092" and is 14 digits, replace with "92"
    return `92${cleanedNumber.slice(4)}`;
  } else if (cleanedNumber.startsWith("92") && cleanedNumber.length === 13) {
    // If the number already starts with "92" and is 13 digits, return it as is
    return cleanedNumber;
  } else if (cleanedNumber.startsWith("0") && cleanedNumber.length === 11) {
    // If the number starts with "0", replace it with "92"
    return `92${cleanedNumber.slice(1)}`;
  } else if (cleanedNumber.startsWith("3") && cleanedNumber.length === 10) {
    // If the number starts with "3", prepend "92"
    return `92${cleanedNumber}`;
  }

  // If the number is not valid, return the cleaned number
  return cleanedNumber;
};

export { formatWhatsAppNumber };
