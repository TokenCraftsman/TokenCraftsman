
# Craft Your Digital Destiny: The TokenCraftsman Experience

Welcome to a world where the power to mint and manage digital assets on the blockchain is at your fingertips. With TokenCraftsman, the future of token creation on the Internet Computer Protocol is not only accessible—it's intuitive, immediate, and incredibly empowering. Join us on this journey to democratize digital asset creation, making it a reality for everyone, everywhere.

## Introduction

Welcome to the TokenCraftsman project, your gateway to launching fungible tokens on the Internet Computer Protocol (ICP) effortlessly. Our mission is to democratize the creation of digital assets on the blockchain by making it accessible to everyone, regardless of their technical background. Whether you're an artist looking to tokenize your work, a community leader aiming to create a digital currency for your ecosystem, or an entrepreneur exploring the potential of blockchain, TokenCraftsman offers you a seamless and straightforward path to bring your visions to life.

TokenCraftsman is designed with simplicity in mind, enabling users to build and deploy fungible tokens (adhering to the ICRC-1/ICRC-2 standards) on ICP with just a few clicks. 

TokenCraftsman is more than just a tool; it's a movement towards opening the blockchain to everyone. By removing technical barriers, we hope to foster innovation, creativity, and inclusivity in the digital economy. Whether you're taking your first steps into the world of blockchain or looking to expand your digital portfolio, TokenCraftsman provides everything you need to succeed in the fast-evolving landscape of digital tokens.

Embark on your token creation journey with TokenCraftsman and unlock the full potential of the Internet Computer Protocol. Welcome to the future of tokenization, where your vision can become a reality in just seconds.

## Project Structure

The project is organized under the umbrella folder `TokenCraftsman`, which contains three subfolders:

1. `backend` - Contains the backend canister code for token and user data management.
2. `frontend` - Houses the frontend code; serves as the asset canister for the project.
3. `createTokenAPI` - A conventional backend that includes the script and logic for creating ICRC-1/ICRC-2 tokens.

## Prerequisites

- Node.js (version 18 recommended)
- DFX (version 0.15.0 recommended)
- Internet access for downloading dependencies and deploying canisters.

## Local Development Setup

Follow these steps to set up the TokenCraftsman project locally:

### 1. Clone the Repository

Start by cloning the TokenCraftsman repository to your local machine.
 ```sh
git clone https://github.com/doyeninnit/TokenCraftsman.git
   ```
### 2. Start the Local Internet Computer Replica

1. Navigate to the root directory of the cloned repository and switch to the assets branch:
   ```sh
   cd TokenCraftsman
   ```
    ```sh
   git switch asset
   ```
2. Run the following command to start a local Internet Computer replica in the background:
   ```sh
   dfx start --background
   ```

### 3. Setup the createTokenAPI

1. Change directory to the `createTokenAPI` folder:
   ```sh
   cd createTokenAPI
   ```
2. Install necessary dependencies:
   ```sh
   npm install
   ```
3. Start the backend server to run the token creation script:
   ```sh
   node index
   ```

### 4. Deploy the Backend Canister

1. Change directory to the `backend` folder:
   ```sh
   cd ../backend
   ```
2. Deploy the backend canister to the local Internet Computer replica:
   ```sh
   dfx deploy
   ```
3. (Optional) Generate necessary artifacts:
   ```sh
   dfx generate
   ```

### 5. Setup the Frontend

1. Change directory to the `frontend` folder:
   ```sh
   cd ../frontend
   ```
2. Install necessary dependencies:
   ```sh
   npm install
   ```
3. Update the `CANISTER_ID` in the `canisterFactory.js` file to match your deployed backend canister ID.
4. Deploy the Internet Identity canister (if not already done):
   ```sh
   dfx deploy internet_identity
   ```
5. Update the `IDENTITY_PROVIDER` variable in the `page.js` file to use the deployed Internet Identity canister ID.
6. Deploy the frontend canister:
   ```sh
   dfx deploy frontend
   ```

### 6. Access the Application

After deploying the frontend canister, use the provided URL to access the application in your browser.

## Contributing

We welcome contributions to the TokenCraftsman project. Please ensure you follow the guidelines for pull requests and issue reporting. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

