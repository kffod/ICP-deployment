import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Block {
  'hash' : string,
  'nonce' : bigint,
  'timestamp' : bigint,
  'index' : bigint,
  'transactions' : Array<Transaction>,
  'previousHash' : string,
}
export interface Challenge {
  'id' : string,
  'startTime' : bigint,
  'status' : string,
  'creator' : Principal,
  'participants' : Array<Principal>,
  'endTime' : bigint,
  'name' : string,
  'description' : string,
  'currentReps' : bigint,
  'targetReps' : bigint,
  'rewards' : bigint,
}
export type Result = { 'ok' : User } |
  { 'err' : string };
export type Result_1 = { 'ok' : Challenge } |
  { 'err' : string };
export type Result_2 = { 'ok' : Transaction } |
  { 'err' : string };
export interface Transaction {
  'id' : string,
  'signature' : string,
  'transactionType' : TransactionType,
  'recipient' : Principal,
  'sender' : Principal,
  'timestamp' : bigint,
  'priority' : bigint,
  'amount' : bigint,
}
export type TransactionType = {
    'REP_COIN_REWARD' : { 'multiplier' : bigint, 'reason' : string }
  } |
  { 'MARKETPLACE_PURCHASE' : { 'itemId' : string, 'price' : bigint } } |
  {
    'CURRENCY_EXCHANGE' : {
      'externalTxId' : string,
      'exchangeRate' : bigint,
      'currencyType' : string,
    }
  } |
  {
    'EXERCISE_RECORD' : {
      'duration' : bigint,
      'reps' : bigint,
      'caloriesBurned' : bigint,
    }
  } |
  {
    'CHALLENGE_CREATE' : {
      'reward' : bigint,
      'duration' : bigint,
      'name' : string,
      'challengeId' : string,
      'targetReps' : bigint,
    }
  } |
  { 'CHALLENGE_COMPLETE' : { 'totalReps' : bigint, 'challengeId' : string } } |
  { 'CHALLENGE_JOIN' : { 'challengeId' : string } };
export interface User {
  'id' : Principal,
  'streak' : bigint,
  'username' : string,
  'totalCaloriesBurned' : bigint,
  'level' : bigint,
  'repCoins' : bigint,
  'achievements' : Array<string>,
  'lastExerciseTime' : bigint,
}
export interface _SERVICE {
  'addTransaction' : ActorMethod<
    [Principal, bigint, TransactionType],
    Result_2
  >,
  'completeChallenge' : ActorMethod<[string, Principal], Result_1>,
  'createChallenge' : ActorMethod<
    [string, string, string, bigint, bigint, bigint, Principal],
    Result_1
  >,
  'exchangeRepCoinsForCurrency' : ActorMethod<
    [bigint, string, bigint, string],
    Result_2
  >,
  'getActiveChallenges' : ActorMethod<[], Array<Challenge>>,
  'getChain' : ActorMethod<[], Array<Block>>,
  'getChallenges' : ActorMethod<[], Array<Challenge>>,
  'getExchangeRates' : ActorMethod<[], Array<[string, bigint]>>,
  'getLatestBlock' : ActorMethod<[], [] | [Block]>,
  'getLeaderboard' : ActorMethod<[bigint], Array<User>>,
  'getPendingTransactions' : ActorMethod<[], Array<Transaction>>,
  'getUser' : ActorMethod<[], Result>,
  'getUserByPrincipal' : ActorMethod<[Principal], Result>,
  'joinChallenge' : ActorMethod<[string, Principal], Result_1>,
  'registerUser' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
