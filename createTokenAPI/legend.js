
// const { execSync } = require('child_process');
// const fs = require('fs');
// const { promisify } = require('util');
// const writeFileAsync = promisify(fs.writeFile);

// // Helper function to execute shell commands
// function execCommand(command) {
//   console.log(`Executing: ${command}`);
//   return execSync(command, { stdio: 'inherit' });
// }

// // Main async function to setup ICRC-1 ledger with local files
// async function setupICRC1Ledger(tokenName, tokenSymbol, preMintedTokens, transferFee, featureFlags) {
//   try {
   
//     // Step 1: Ensure dfx is installed (omitted)

//     // Step 2: Create a new dfx project
//     execCommand('dfx new icrc1_ledger_canister');
//     process.chdir('./icrc1_ledger_canister');

//     // Create canisters directory if it doesn't exist
//     if (!fs.existsSync('./canisters/icrc1_ledger')) {
//       fs.mkdirSync('./canisters/icrc1_ledger', { recursive: true });
//     }

//     // Step 4: Configure the dfx.json file
//     console.log('Configuring the dfx.json file...');
//     const dfxConfig = {
//       canisters: {
//         icrc1_ledger_canister: {
//           type: "custom",
//           candid: "https://raw.githubusercontent.com/dfinity/ic/d87954601e4b22972899e9957e800406a0a6b929/rs/rosetta-api/icrc1/ledger/ledger.did",
//           wasm: "https://download.dfinity.systems/ic/d87954601e4b22972899e9957e800406a0a6b929/canisters/ic-icrc1-ledger.wasm.gz"
//         }
//       },
//       defaults: {
//         build: {
//           args: "",
//           packtool: ""
//         }
//       },
//       output_env_file: ".env",
//       version: 1
//     };
//     await writeFileAsync('dfx.json', JSON.stringify(dfxConfig, null, 2));

//     // Step 5: Start a local replica
//     // execCommand('dfx start --background --clean');

//     // Step 6: Deploy the ICRC-1 ledger canister with dynamic variables
//     console.log('Deploying the ICRC-1 ledger canister...');
//     const deployCommand = `dfx deploy icrc1_ledger_canister --argument "(variant {Init = record {token_symbol = \\"${tokenSymbol}\\"; token_name = \\"${tokenName}\\"; minting_account = record { owner = principal \\"$(dfx identity get-principal)\\" }; transfer_fee = ${transferFee}; metadata = vec {}; feature_flags = opt record{icrc2 = ${featureFlags}}; initial_balances = vec { record { record { owner = principal \\"$(dfx identity get-principal)\\"; }; ${preMintedTokens}; }; }; archive_options = record {num_blocks_to_archive = 1000; trigger_threshold = 2000; controller_id = principal \\"$(dfx identity get-principal)\\"; cycles_for_archive_creation = opt 10000000000000; }; }})"`;
//     execCommand(deployCommand);
//   } catch (error) {
//     console.error('Failed to setup the ICRC-1 ledger:', error);
//   }
// }

// // Example usage with hardcoded values for simplicity
// setupICRC1Ledger(
//   "My Token",
//   "MTK",
//   "100000000000", // 1000 tokens, assuming 8 decimal places
//   "10000",         // 0.0001 tokens as the transfer fee
//   "false"          // Feature flags set to false
// ).then(() => console.log("ICRC-1 ledger setup complete.")).catch(console.error);




const { execSync } = require('child_process');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

// Helper function to execute shell commands
function execCommand(command) {
  console.log(`Executing: ${command}`);
  return execSync(command, { stdio: 'inherit' });
}

// Main async function to setup ICRC-1 ledger with local files
async function setupICRC1Ledger(projectName, tokenName, tokenSymbol, preMintedTokens, transferFee, featureFlags) {
  try {
    // Validate or sanitize projectName if necessary
    if (!projectName) throw new Error('Project name is required');

    // Step 1: Ensure dfx is installed (omitted)

    // Step 2: Dynamically create a new dfx project based on the given project name
    console.log(`Creating a new dfx project: ${projectName}...`);
    execCommand(`dfx new ${projectName}`);
    process.chdir(`./${projectName}`);

    // Create canisters directory if it doesn't exist
    const canisterDir = `./canisters/${projectName}`;
    if (!fs.existsSync(canisterDir)) {
      fs.mkdirSync(canisterDir, { recursive: true });
    }

    // Step 4: Configure the dfx.json file
    console.log('Configuring the dfx.json file...');
    const dfxConfig = {
      canisters: {
        [projectName]: { // Use the projectName variable to dynamically name the canister
          type: "custom",
          candid: "https://raw.githubusercontent.com/dfinity/ic/d87954601e4b22972899e9957e800406a0a6b929/rs/rosetta-api/icrc1/ledger/ledger.did",
          wasm: "https://download.dfinity.systems/ic/d87954601e4b22972899e9957e800406a0a6b929/canisters/ic-icrc1-ledger.wasm.gz"
        }
      },
      defaults: {
        build: {
          args: "",
          packtool: ""
        }
      },
      output_env_file: ".env",
      version: 1
    };
    await writeFileAsync('dfx.json', JSON.stringify(dfxConfig, null, 2));

    // Step 5: Start a local replica
    // Commented out to avoid restarting replicas for each setup
    // execCommand('dfx start --background --clean');

    // Step 6: Deploy the ICRC-1 ledger canister with dynamic variables
    console.log(`Deploying the ${projectName} canister...`);
    const deployCommand = `dfx deploy ${projectName} --argument "(variant {Init = record {token_symbol = \\"${tokenSymbol}\\"; token_name = \\"${tokenName}\\"; minting_account = record { owner = principal \\"$(dfx identity get-principal)\\" }; transfer_fee = ${transferFee}; metadata = vec {}; feature_flags = opt record{icrc2 = ${featureFlags}}; initial_balances = vec { record { record { owner = principal \\"$(dfx identity get-principal)\\"; }; ${preMintedTokens}; }; }; archive_options = record {num_blocks_to_archive = 1000; trigger_threshold = 2000; controller_id = principal \\"$(dfx identity get-principal)\\"; cycles_for_archive_creation = opt 10000000000000; }; }})"`;
    execCommand(deployCommand);
  } catch (error) {
    console.error('Failed to setup the ICRC-1 ledger:', error);
  }
}

// Example usage with variable project names
setupICRC1Ledger(
  "icrc1_custom_token2", // New project name parameter
  "My Token2",
  "MTK2",
  "100000000000", // 1000 tokens, assuming 8 decimal places
  "10000",         // 0.0001 tokens as the transfer fee
  "false"          // Feature flags set to false
).then(() => console.log("ICRC-1 ledger setup complete.")).catch(console.error);
