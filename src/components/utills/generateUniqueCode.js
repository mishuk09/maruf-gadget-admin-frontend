/**
 * Fetch all existing codes from database
 */
const fetchExistingCodes = async () => {
    try {
        // Fetch all products to get existing codes
        const response = await fetch('https://maruf-gadget-admin-backend.onrender.com/posts');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch codes: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract codes from response
        const products = Array.isArray(data) ? data : data?.data || data?.items || [];
        const existingCodes = products
            .map(product => product?.code)
            .filter(Boolean); // Remove undefined/null
        
        return existingCodes;
    } catch (error) {
        console.error('Error fetching existing codes:', error);
        return [];
    }
};

/**
 * Generate a single unique code
 * Format: [Single Letter A-Z][3 Digits 000-999]
 * Example: A123, B456, Z999
 */
const generateSingleCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return randomLetter + randomDigits;
};

/**
 * Generate a unique code that doesn't exist in database
 * @returns {Promise<string>} - Unique code like "A123"
 */
export const generateUniqueCode = async () => {
    try {
        // Fetch all existing codes
        const existingCodes = await fetchExistingCodes();
        const existingCodesSet = new Set(existingCodes);

        let newCode;
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loop

        // Generate codes until we find a unique one
        do {
            newCode = generateSingleCode();
            attempts++;
        } while (existingCodesSet.has(newCode) && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            throw new Error('Could not generate unique code after maximum attempts');
        }

        return newCode;
    } catch (error) {
        console.error('Error generating unique code:', error);
        throw error;
    }
};
