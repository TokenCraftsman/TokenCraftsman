
const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const { promisify } = require('util');
const cors = require('cors');
const writeFileAsync = promisify(fs.writeFile);
const app = express();
const port = 8000;

app.use(cors({
  origin: 'http://127.0.0.1:4943', // Allow only the frontend to make requests
  methods: ['GET', 'POST'], // Specify which HTTP methods are allowed
  credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // Middleware to parse JSON bodies

// Helper function to execute shell commands
function execCommand(command) {
  console.log(`Executing: ${command}`);
  return execSync(command, { stdio: 'inherit' });
}

// Main async function to setup ICRC-1 ledger with local files
async function setupICRC1Ledger(projectName, tokenName, tokenSymbol, preMintedTokens, transferFee, featureFlags) {
 console.log("hit")
  try {
    if (!projectName) throw new Error('Project name is required');
    console.log(`Creating a new dfx project: ${projectName}...`);
    execCommand(`dfx new ${projectName}`);
    process.chdir(`./${projectName}`);

    const canisterDir = `./canisters/${projectName}`;
    if (!fs.existsSync(canisterDir)) {
      fs.mkdirSync(canisterDir, { recursive: true });
    }

    console.log('Configuring the dfx.json file...');
    const dfxConfig = {
      canisters: {
        [projectName]: {
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

    console.log(`Deploying the ${projectName} canister...`);
    const deployCommand = `dfx deploy ${projectName} --argument "(variant {Init = record {token_symbol = \\"${tokenSymbol}\\"; token_name = \\"${tokenName}\\"; minting_account = record { owner = principal \\"$(dfx identity get-principal)\\" }; transfer_fee = ${transferFee}; metadata = vec {}; feature_flags = opt record{icrc2 = ${featureFlags}}; initial_balances = vec { record { record { owner = principal \\"$(dfx identity get-principal)\\"; }; ${preMintedTokens}; }; }; archive_options = record {num_blocks_to_archive = 1000; trigger_threshold = 2000; controller_id = principal \\"$(dfx identity get-principal)\\"; cycles_for_archive_creation = opt 10000000000000; }; }})"`;
    execCommand(deployCommand);
    return `ICRC-1 ledger setup complete for project: ${projectName}`;
  } catch (error) {
    console.error('Failed to setup the ICRC-1 ledger:', error);
    throw error; // Throw the error to be caught by the Express error handler
  }
}

app.post('/setupICRC1Ledger', async (req, res, next) => {
  try {
    const { projectName, tokenName, tokenSymbol, preMintedTokens, transferFee, featureFlags } = req.body;
    const result = await setupICRC1Ledger(projectName, tokenName, tokenSymbol, preMintedTokens, transferFee, featureFlags);
    // res.send(result);
    res.json({ message: 'ICRC-1 ledger setup complete for project: ' + projectName });

  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`ICRC-1 ledger setup API listening at http://localhost:${port}`);
});
