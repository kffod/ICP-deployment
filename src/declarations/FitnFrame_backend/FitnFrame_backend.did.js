export const idlFactory = ({ IDL }) => {
  const TransactionType = IDL.Variant({
    'REP_COIN_REWARD' : IDL.Record({
      'multiplier' : IDL.Nat,
      'reason' : IDL.Text,
    }),
    'MARKETPLACE_PURCHASE' : IDL.Record({
      'itemId' : IDL.Text,
      'price' : IDL.Nat,
    }),
    'CURRENCY_EXCHANGE' : IDL.Record({
      'externalTxId' : IDL.Text,
      'exchangeRate' : IDL.Nat,
      'currencyType' : IDL.Text,
    }),
    'EXERCISE_RECORD' : IDL.Record({
      'duration' : IDL.Int,
      'reps' : IDL.Nat,
      'caloriesBurned' : IDL.Nat,
    }),
    'CHALLENGE_CREATE' : IDL.Record({
      'reward' : IDL.Nat,
      'duration' : IDL.Int,
      'name' : IDL.Text,
      'challengeId' : IDL.Text,
      'targetReps' : IDL.Nat,
    }),
    'CHALLENGE_COMPLETE' : IDL.Record({
      'totalReps' : IDL.Nat,
      'challengeId' : IDL.Text,
    }),
    'CHALLENGE_JOIN' : IDL.Record({ 'challengeId' : IDL.Text }),
  });
  const Transaction = IDL.Record({
    'id' : IDL.Text,
    'signature' : IDL.Text,
    'transactionType' : TransactionType,
    'recipient' : IDL.Principal,
    'sender' : IDL.Principal,
    'timestamp' : IDL.Int,
    'priority' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : Transaction, 'err' : IDL.Text });
  const Challenge = IDL.Record({
    'id' : IDL.Text,
    'startTime' : IDL.Int,
    'status' : IDL.Text,
    'creator' : IDL.Principal,
    'participants' : IDL.Vec(IDL.Principal),
    'endTime' : IDL.Int,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'currentReps' : IDL.Nat,
    'targetReps' : IDL.Nat,
    'rewards' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : Challenge, 'err' : IDL.Text });
  const Block = IDL.Record({
    'hash' : IDL.Text,
    'nonce' : IDL.Nat,
    'timestamp' : IDL.Int,
    'index' : IDL.Nat,
    'transactions' : IDL.Vec(Transaction),
    'previousHash' : IDL.Text,
  });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'streak' : IDL.Nat,
    'username' : IDL.Text,
    'totalCaloriesBurned' : IDL.Nat,
    'level' : IDL.Nat,
    'repCoins' : IDL.Nat,
    'achievements' : IDL.Vec(IDL.Text),
    'lastExerciseTime' : IDL.Int,
  });
  const Result = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  return IDL.Service({
    'addTransaction' : IDL.Func(
        [IDL.Principal, IDL.Nat, TransactionType],
        [Result_2],
        [],
      ),
    'completeChallenge' : IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
    'createChallenge' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Int,
          IDL.Nat,
          IDL.Principal,
        ],
        [Result_1],
        [],
      ),
    'exchangeRepCoinsForCurrency' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Nat, IDL.Text],
        [Result_2],
        [],
      ),
    'getActiveChallenges' : IDL.Func([], [IDL.Vec(Challenge)], ['query']),
    'getChain' : IDL.Func([], [IDL.Vec(Block)], ['query']),
    'getChallenges' : IDL.Func([], [IDL.Vec(Challenge)], ['query']),
    'getExchangeRates' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getLatestBlock' : IDL.Func([], [IDL.Opt(Block)], ['query']),
    'getLeaderboard' : IDL.Func([IDL.Nat], [IDL.Vec(User)], ['query']),
    'getPendingTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'getUser' : IDL.Func([], [Result], ['query']),
    'getUserByPrincipal' : IDL.Func([IDL.Principal], [Result], ['query']),
    'joinChallenge' : IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
    'registerUser' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
