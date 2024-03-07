
// Add or update a token associated with a user
export async function addOrUpdateToken(principal, token) {
    try {
        const response = await window.canister.backend.addOrUpdateToken(principal, token);
        return response;
    } catch (err) {
        console.error('Error adding or updating token:', err);
        throw err; // Or handle error as appropriate
    }
}


// Retrieve a user's profile and their tokens
export async function getUserProfile(principal) {
    try {
        const userProfile = await window.canister.backend.getUserProfile(principal);
        return userProfile;
    } catch (err) {
        console.error('Error fetching user profile:', err);
        return null; // Or handle error as appropriate
    }
}

// Retrieve a specific token by its name and symbol
export async function getToken(tokenName, tokenSymbol) {
    try {
        const token = await window.canister.backend.getToken(tokenName, tokenSymbol);
        return token;
    } catch (err) {
        console.error('Error fetching token:', err);
        return null; // Or handle error as appropriate
    }
}

// Retrieve all tokens created on the platform
export async function getAllTokens() {
    try {
        const tokens = await window.canister.backend.getAllTokens();
        return tokens;
    } catch (err) {
        console.error('Error fetching all tokens:', err);
        return []; // Or handle error as appropriate
    }
}
