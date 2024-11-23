 const formatWhatsAppNumber = (number: string): string => {
    // Remove any non-digit characters (including spaces, dashes, etc.)
    let cleanedNumber = number.replace(/[^\d]/g, "");
  
    // Check for different variations of the number (like +92, 0092, etc.) and normalize
    if (cleanedNumber.startsWith("+92") && cleanedNumber.length === 11) {
      // If the number starts with "92" (Pakistan country code) and is 11 digits, return as is
      return `+${cleanedNumber}`;
    } else if (cleanedNumber.startsWith("0092") && cleanedNumber.length === 14) {
      // If the number starts with "0092" and is 13 digits, replace with +92
      return `92${cleanedNumber.slice(4)}`;
    } else if (cleanedNumber.startsWith("92") && cleanedNumber.length === 13) {
      // If the number already starts with +92 and is 13 digits, return it as is
      return cleanedNumber;
    } else if (cleanedNumber.startsWith("0") && cleanedNumber.length === 11) {
      // If the number starts with "0", replace it with "+92"
      return `92${cleanedNumber.slice(1)}`;
    } else if (cleanedNumber.startsWith("3")&& cleanedNumber.length === 10) {
      
      return `92${cleanedNumber.slice(0)}`;
    } 
    // If the number is not valid, return null or an empty string
    return cleanedNumber;  // or return "" if you want to keep it empty when invalid
  };


export {formatWhatsAppNumber};
  