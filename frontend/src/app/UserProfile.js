// pages/user-profile.js
import React from 'react';

const UserProfile = () => {
  // Placeholder for user profile data. You might want to fetch the actual data or pass it through context or props
  const userProfile = {
    principal: "ooq3m-n45j6-2z734-hran3-6yt6s-mvmey-x4lfd-ha36j-nvi5u-5xyf2-uqe",
    tokens: [
      {
        featureFlags: false,
        projectName: "Jin",
        transferFee: "1",
        tokenSymbol: "JITK",
        tokenName: "JIN",
        preMintedTokens: "10000"
      }
    ]
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p>Principal: {userProfile.principal}</p>
      <h2 className="text-xl font-bold mt-6 mb-4">Tokens:</h2>
      {userProfile.tokens.map((token, index) => (
        <div key={index} className="mb-4">
          <p>Token Name: {token.tokenName}</p>
          <p>Token Symbol: {token.tokenSymbol}</p>
          <p>Pre-Minted Tokens: {token.preMintedTokens}</p>
          <p>Transfer Fee: {token.transferFee}</p>
          <p>Feature Flags: {token.featureFlags ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
