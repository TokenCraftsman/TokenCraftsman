import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'addOrUpdateToken' : ActorMethod<
    [
      Principal,
      {
        'featureFlags' : boolean,
        'projectName' : string,
        'transferFee' : string,
        'tokenSymbol' : string,
        'tokenName' : string,
        'preMintedTokens' : string,
      },
    ],
    string
  >,
  'getAllTokens' : ActorMethod<
    [],
    Array<
      {
        'featureFlags' : boolean,
        'projectName' : string,
        'transferFee' : string,
        'tokenSymbol' : string,
        'tokenName' : string,
        'preMintedTokens' : string,
      }
    >
  >,
  'getToken' : ActorMethod<
    [string, string],
    [] | [
      {
        'featureFlags' : boolean,
        'projectName' : string,
        'transferFee' : string,
        'tokenSymbol' : string,
        'tokenName' : string,
        'preMintedTokens' : string,
      }
    ]
  >,
  'getUserProfile' : ActorMethod<
    [Principal],
    [] | [
      {
        'principal' : Principal,
        'tokens' : Array<
          {
            'featureFlags' : boolean,
            'projectName' : string,
            'transferFee' : string,
            'tokenSymbol' : string,
            'tokenName' : string,
            'preMintedTokens' : string,
          }
        >,
      }
    ]
  >,
}
