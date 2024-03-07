export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addOrUpdateToken' : IDL.Func(
        [
          IDL.Principal,
          IDL.Record({
            'featureFlags' : IDL.Bool,
            'projectName' : IDL.Text,
            'transferFee' : IDL.Text,
            'tokenSymbol' : IDL.Text,
            'tokenName' : IDL.Text,
            'preMintedTokens' : IDL.Text,
          }),
        ],
        [IDL.Text],
        [],
      ),
    'getAllTokens' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'featureFlags' : IDL.Bool,
              'projectName' : IDL.Text,
              'transferFee' : IDL.Text,
              'tokenSymbol' : IDL.Text,
              'tokenName' : IDL.Text,
              'preMintedTokens' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getToken' : IDL.Func(
        [IDL.Text, IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'featureFlags' : IDL.Bool,
              'projectName' : IDL.Text,
              'transferFee' : IDL.Text,
              'tokenSymbol' : IDL.Text,
              'tokenName' : IDL.Text,
              'preMintedTokens' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Opt(
            IDL.Record({
              'principal' : IDL.Principal,
              'tokens' : IDL.Vec(
                IDL.Record({
                  'featureFlags' : IDL.Bool,
                  'projectName' : IDL.Text,
                  'transferFee' : IDL.Text,
                  'tokenSymbol' : IDL.Text,
                  'tokenName' : IDL.Text,
                  'preMintedTokens' : IDL.Text,
                })
              ),
            })
          ),
        ],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
