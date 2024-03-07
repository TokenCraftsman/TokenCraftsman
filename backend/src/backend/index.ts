
import { query, update, text, bool, Principal, Record, Variant, Vec, Opt, StableBTreeMap, None, Some, Canister } from "azle";

const Token = Record({
    projectName: text,
    tokenName: text,
    tokenSymbol: text,
    preMintedTokens: text, // Assuming string to handle large numbers or specific formats
    transferFee: text, // Assuming string for flexibility in specifying units
    featureFlags: bool
});

const UserProfile = Record({
    principal: Principal,
    tokens: Vec(Token) // A vector to store multiple tokens
});

const TokenStorage = StableBTreeMap(0, text, Token);
const UserProfileStorage = StableBTreeMap(1, Principal, Vec(Token));


export default Canister({
    // Add or update a token in the global storage and associate it with a user's profile   
    addOrUpdateToken: update([Principal, Token], text, (principal, token) => {
        const currentTokensOpt = UserProfileStorage.get(principal);
        let tokens = []; // Initialize tokens as an empty array

        // Check if currentTokensOpt is not undefined and has tokens
        if (currentTokensOpt !== undefined && "Some" in currentTokensOpt) {
            tokens = currentTokensOpt.Some;
        }

        // Proceed with the rest of your logic
        const index = tokens.findIndex((t: { tokenName: string; tokenSymbol: string; }) => t.tokenName === token.tokenName && t.tokenSymbol === token.tokenSymbol);
        if (index > -1) {
            tokens[index] = token; // Update existing token
        } else {
            tokens.push(token); // Add new token
        }

        UserProfileStorage.insert(principal, tokens);
        TokenStorage.insert(`${token.tokenName}_${token.tokenSymbol}`, token);

        return "Token added or updated successfully";
    }),
    
    // Retrieve a user's profile with all their tokens
    getUserProfile: query([Principal], Opt(UserProfile), (principal) => {
        const tokens = UserProfileStorage.get(principal);
        if ("None" in tokens) {
            return None;
        }
        return Some({ principal, tokens: tokens.Some });
    }),

    // Retrieve a specific token by its name and symbol
    getToken: query([text, text], Opt(Token), (tokenName, tokenSymbol) => {
        return TokenStorage.get(`${tokenName}_${tokenSymbol}`);
    }),

    // Retrieve all tokens created on the platform
    getAllTokens: query([], Vec(Token), () => {
        return TokenStorage.values();
    })
});
