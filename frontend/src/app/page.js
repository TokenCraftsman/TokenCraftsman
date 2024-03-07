
"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { initializeContract } from './icp';
import { getAllTokens, addOrUpdateToken, getUserProfile } from './craftsman';
import { Principal } from "@dfinity/principal";

const IDENTITY_PROVIDER = `http://bd3sg-teaaa-aaaaa-qaaba-cai.localhost:4943/#authorize`;

export default function CreateToken() {
  const [formData, setFormData] = useState({
    projectName: '',
    tokenName: '',
    tokenSymbol: '',
    preMintedTokens: '',
    transferFee: '',
    featureFlags: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userPrincipal, setUserPrincipal] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  useEffect(async () => {
    const checkAuthentication = async () => {
      const authClient = window.auth.client;

      setIsAuthenticated(window.auth.isAuthenticated);
      if (window.auth.isAuthenticated) {
        const identity = window.auth.identity;
        console.log(`identity is: ${identity}`)
        const principal = window.auth.principalText;

        setUserPrincipal(principal);
        console.log("Authenticated Principal:", principal); // Log the full principal
      }
    };

    const fetchUserProfile = async () => {
      if (window.auth.isAuthenticated) {
        const principal = Principal.fromText(window.auth.principalText);
        try {
          const profile = await getUserProfile(principal);
          setUserProfile(profile); // Assuming profile structure matches your needs
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
  
    await initializeContract()
    await checkAuthentication();
    await fetchUserProfile();

    const principal = window.auth.principalText;
    console.log(`principal is ${principal}`)

    const thePrincipal = Principal.from(principal);

    // await fetchTokensAndLog()
    const prof = await getUserProfile(thePrincipal)
    console.log(`Profile:`, JSON.stringify(prof, null, 2)); // Pretty print the object


  }, []);

  const fetchTokensAndLog = async () => {
    try {
      const toks = await getAllTokens(); // Ensure getAllTokens is awaited
      console.log(`tokens created: ${JSON.stringify(toks, null, 2)}`); // Properly log the resolved tokens
    } catch (err) {
      console.error("Failed to fetch tokens:", err);
    }
  };

  const MAX_TTL = 7 * 24 * 60 * 60 * 1000 * 1000 * 1000;

  const login = async () => {
    const authClient = window.auth.client;

    const isAuthenticated = await authClient.isAuthenticated();

    if (!isAuthenticated) {
      await authClient?.login({
        identityProvider: IDENTITY_PROVIDER,
        onSuccess: async () => {
          window.auth.isAuthenticated = await authClient.isAuthenticated();
          window.location.reload();
        },
        maxTimeToLive: MAX_TTL,
      });
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to create a token.");
      return;
    }

    const submitUrl = 'http://localhost:8000/setupICRC1Ledger';
    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const thePrincipal = Principal.from(userPrincipal);

      const updateResponse = await addOrUpdateToken(thePrincipal, formData);
      console.log(updateResponse); // Log the response from addOrUpdateToken
      alert('Token created and updated successfully!');
    } catch (error) {
      console.error('Failed to create or update token:', error);
      alert('Failed to create or update token. Please try again.');
    }
  };



  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Principal copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const formatPrincipal = (principal) => {
    if (!principal || principal.length <= 10) return principal;
    return `${principal.substring(0, 5)}...${principal.substring(principal.length - 5)}`;
  };

  if (isAuthenticated === null) {
    return <div className="text-center">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Please Log In to Create a Token</h1>
        <button onClick={login} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Login with Internet Identity
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {isAuthenticated && userPrincipal && (
        <div className="text-center mb-4">
          <p>Your Principal ID: {formatPrincipal(userPrincipal)}</p>
          <button onClick={() => copyToClipboard(userPrincipal)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            Copy
          </button>
        </div>
        
      )}
      {/* Form rendering logic remains the same */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
          <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="tokenName" className="block text-gray-700 text-sm font-bold mb-2">Token Name</label>
          <input type="text" id="tokenName" name="tokenName" value={formData.tokenName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="tokenSymbol" className="block text-gray-700 text-sm font-bold mb-2">Token Symbol</label>
          <input type="text" id="tokenSymbol" name="tokenSymbol" value={formData.tokenSymbol} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="preMintedTokens" className="block text-gray-700 text-sm font-bold mb-2">Pre-Minted Tokens</label>
          <input type="number" id="preMintedTokens" name="preMintedTokens" value={formData.preMintedTokens} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="transferFee" className="block text-gray-700 text-sm font-bold mb-2">Transfer Fee</label>
          <input type="number" id="transferFee" name="transferFee" value={formData.transferFee} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Feature Flags</label>
          <label className="inline-flex items-center">
            <input type="checkbox" id="featureFlags" name="featureFlags" checked={formData.featureFlags} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" /><span className="ml-2 text-gray-700">Enable Feature Flags</span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Create Token
          </button>
        </div>
      </form>
      {userProfile && (
  <UserProfileSection userProfile={userProfile} />
)}
    </div>
  );
}



const UserProfileSection = ({ userProfile }) => {
  // Parse userProfile if it's a string to an object
  const profileData = typeof userProfile === 'string' ? JSON.parse(userProfile) : userProfile;
  
  // Since the profileData appears to be an array, take the first item for simplicity
  const profile = profileData.length ? profileData[0] : null;

  return (
    <div className="mt-8 p-4 border rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">User Profile</h3>
      {profile ? (
        <>
          <p><strong>Principal:</strong> {profile.principal.__principal__}</p>
          <h4 className="font-medium mt-4 mb-2">Tokens:</h4>
          <ul>
            {profile.tokens.map((token, index) => (
              <li key={index} className="mb-2">
                <p>Token Name: {token.tokenName}</p>
                <p>Token Symbol: {token.tokenSymbol}</p>
                <p>Pre-Minted Tokens: {token.preMintedTokens}</p>
                <p>Transfer Fee: {token.transferFee}</p>
                <p>Feature Flags: {token.featureFlags ? 'Enabled' : 'Disabled'}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};
