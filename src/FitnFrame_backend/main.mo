import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Trie "mo:base/Trie";
import List "mo:base/List";
import Debug "mo:base/Debug";

actor FitnFrame {
  // Type definitions
  type User = {
    id : Principal;
    username : Text;
    repCoins : Nat;
    streak : Nat;
    lastExerciseTime : Int;
    achievements : [Text];
    totalCaloriesBurned : Nat;
    level : Nat;
  };

  type Exercise = {
    id : Text;
    name : Text;
    reps : Nat;
    duration : Int;
    caloriesBurned : Nat;
    timestamp : Int;
    userId : Principal;
  };

  type Challenge = {
    id : Text;
    name : Text;
    description : Text;
    startTime : Int;
    endTime : Int;
    participants : [Principal];
    rewards : Nat;
    status : Text; // "ACTIVE", "COMPLETED", "CANCELLED"
    targetReps : Nat;
    currentReps : Nat;
    creator : Principal;
  };

  type Achievement = {
    id : Text;
    name : Text;
    description : Text;
    reward : Nat;
    requirements : [Text];
  };

  type TransactionType = {
    #EXERCISE_RECORD : {
      reps : Nat;
      duration : Int;
      caloriesBurned : Nat;
    };
    #CHALLENGE_CREATE : {
      challengeId : Text;
      name : Text;
      targetReps : Nat;
      duration : Int;
      reward : Nat;
    };
    #CHALLENGE_COMPLETE : {
      challengeId : Text;
      totalReps : Nat;
    };
    #CHALLENGE_JOIN : {
      challengeId : Text;
    };
    #REP_COIN_REWARD : {
      multiplier : Nat;
      reason : Text;
    };
    #MARKETPLACE_PURCHASE : {
      itemId : Text;
      price : Nat;
    };
    #CURRENCY_EXCHANGE : {
      currencyType : Text;
      exchangeRate : Nat;
      externalTxId : Text;
    };
  };

  type Transaction = {
    id : Text;
    sender : Principal;
    recipient : Principal;
    amount : Nat;
    timestamp : Int;
    signature : Text;
    transactionType : TransactionType;
    priority : Nat;
  };

  type Block = {
    index : Nat;
    timestamp : Int;
    transactions : [Transaction];
    previousHash : Text;
    hash : Text;
    nonce : Nat;
  };

  // Storage variables
  private stable var chain : [Block] = [];
  private stable var pendingTransactions : [Transaction] = [];
  private stable var userTrie = Trie.empty<Principal, User>();
  private stable var exerciseTrie = Trie.empty<Text, Exercise>();
  private stable var challengeTrie = Trie.empty<Text, Challenge>();
  private stable var achievementTrie = Trie.empty<Text, Achievement>();
  private stable var transactionTrie = Trie.empty<Text, Transaction>();

  // Constants
  private let BASE_REP_REWARD : Nat = 10;
  private let REP_MULTIPLIER : Nat = 2;
  private let DURATION_MULTIPLIER : Nat = 3;
  private let CALORIES_MULTIPLIER : Nat = 4;
  private let STREAK_BONUS_MULTIPLIER : Nat = 2;
  private let CHALLENGE_COMPLETION_BONUS : Nat = 50;
  private let DIFFICULTY = 2; // For mining (number of leading zeros)
  private let MAX_TRANSACTIONS_PER_BLOCK = 10;
  private let STREAK_THRESHOLD_HOURS = 24; // Hours within which a new exercise maintains streak

  // Exchange rate constants (in real system, these would be updated via oracles)
  private let ETH_RATE : Nat = 1000000; // 1 ETH = 1,000,000 RepCoins
  private let BTC_RATE : Nat = 15000000; // 1 BTC = 15,000,000 RepCoins
  private let USDC_RATE : Nat = 100; // 1 USDC = 100 RepCoins
  private let USDT_RATE : Nat = 100; // 1 USDT = 100 RepCoins
  private let ICP_RATE : Nat = 10000; // 1 ICP = 10,000 RepCoins
  private let USD_RATE : Nat = 100; // 1 USD = 100 RepCoins
  private let INR_RATE : Nat = 1; // 1 INR = 1 RepCoin
  private let EUR_RATE : Nat = 110; // 1 EUR = 110 RepCoins
  private let GBP_RATE : Nat = 125; // 1 GBP = 125 RepCoins
  private let JPY_RATE : Nat = 1; // 1 JPY = 1 RepCoin
  private let AUD_RATE : Nat = 65; // 1 AUD = 65 RepCoins
  private let CAD_RATE : Nat = 72; // 1 CAD = 72 RepCoins

  // Helper functions
  private func principalKey(p : Principal) : Trie.Key<Principal> {
    { key = p; hash = Principal.hash(p) };
  };

  private func textKey(t : Text) : Trie.Key<Text> {
    { key = t; hash = Text.hash(t) };
  };

  // User Management Functions
  public shared (msg) func registerUser(username : Text) : async Result.Result<User, Text> {
    let caller = msg.caller;
    let userKey = principalKey(caller);

    switch (Trie.get(userTrie, userKey, Principal.equal)) {
      case (?existingUser) {
        return #err("User already registered");
      };
      case null {
        let newUser : User = {
          id = caller;
          username = username;
          repCoins = 100; // Starting coins
          streak = 0;
          lastExerciseTime = 0;
          achievements = [];
          totalCaloriesBurned = 0;
          level = 1;
        };

        userTrie := Trie.put(userTrie, userKey, Principal.equal, newUser).0;
        return #ok(newUser);
      };
    };
  };

  public query (msg) func getUser() : async Result.Result<User, Text> {
    let userKey = principalKey(msg.caller);

    switch (Trie.get(userTrie, userKey, Principal.equal)) {
      case (?user) {
        return #ok(user);
      };
      case null {
        return #err("User not found");
      };
    };
  };

  public query func getUserByPrincipal(userId : Principal) : async Result.Result<User, Text> {
    let userKey = principalKey(userId);

    switch (Trie.get(userTrie, userKey, Principal.equal)) {
      case (?user) {
        return #ok(user);
      };
      case null {
        return #err("User not found");
      };
    };
  };

  // Helper function to parse the transaction type from text
  private func parseTransactionType(transactionType : Text, data : Text, amount : Nat) : Result.Result<TransactionType, Text> {
    switch (transactionType) {
      case ("EXERCISE_RECORD") {
        #ok(#EXERCISE_RECORD({ reps = amount; duration = 0; caloriesBurned = 0 }));
      };
      case ("CHALLENGE_CREATE") {
        #ok(#CHALLENGE_CREATE({ challengeId = data; name = ""; targetReps = amount; duration = 0; reward = amount }));
      };
      case ("CHALLENGE_COMPLETE") {
        #ok(#CHALLENGE_COMPLETE({ challengeId = data; totalReps = amount }));
      };
      case ("REP_COIN_REWARD") {
        #ok(#REP_COIN_REWARD({ multiplier = amount; reason = data }));
      };
      case ("CURRENCY_EXCHANGE") {
        #ok(#CURRENCY_EXCHANGE({ currencyType = data; exchangeRate = amount; externalTxId = "" }));
      };
      case _ { #err("Invalid transaction type") };
    };
  };

  // Transaction Management
  public shared (msg) func addTransaction(recipient : Principal, amount : Nat, txType : TransactionType) : async Result.Result<Transaction, Text> {
    // Verify sender exists
    let senderKey = principalKey(msg.caller);
    switch (Trie.get(userTrie, senderKey, Principal.equal)) {
      case null {
        return #err("Sender not registered");
      };
      case (?sender) {
        if (txType == #MARKETPLACE_PURCHASE({ itemId = ""; price = 0 }) and sender.repCoins < amount) {
          return #err("Insufficient RepCoins for this transaction");
        };
      };
    };

    let transaction : Transaction = {
      id = genTxId(msg.caller, Time.now());
      sender = msg.caller;
      recipient = recipient;
      amount = amount;
      timestamp = Time.now();
      signature = ""; // In a real system, we would use cryptographic signing
      transactionType = txType;
      priority = getPriority(txType);
    };

    if (not validateTransaction(transaction)) {
      return #err("Invalid transaction");
    };

    let key = textKey(transaction.id);
    transactionTrie := Trie.put(transactionTrie, key, Text.equal, transaction).0;

    // Update pending transactions and create block if needed
    let pendingBuffer = Buffer.fromArray<Transaction>(pendingTransactions);
    pendingBuffer.add(transaction);
    pendingTransactions := Buffer.toArray(pendingBuffer);

    if (pendingTransactions.size() >= MAX_TRANSACTIONS_PER_BLOCK) {
      await createBlock();
    };

    // Update user state based on transaction type
    switch (txType) {
      case (#EXERCISE_RECORD(data)) {
        await recordExercise(msg.caller, data.reps, data.duration, data.caloriesBurned);
      };
      case (#CHALLENGE_CREATE(data)) {
        ignore await createChallenge(data.challengeId, data.name, "", data.targetReps, data.duration, data.reward, msg.caller);
      };
      case (#CHALLENGE_COMPLETE(data)) {
        ignore await completeChallenge(data.challengeId, msg.caller);
      };
      case (#CHALLENGE_JOIN(data)) {
        ignore await joinChallenge(data.challengeId, msg.caller);
      };
      case (_) {};
    };

    #ok(transaction);
  };

  private func genTxId(principal : Principal, timestamp : Int) : Text {
    let hashInput = Principal.toText(principal) # Int.toText(timestamp) # Nat.toText(pendingTransactions.size());
    Text.concat("tx", Nat32.toText(Text.hash(hashInput)));
  };

  // Blockchain Functions
  private func createBlock() : async () {
    let previousBlock = if (chain.size() > 0) { chain[chain.size() - 1] } else {
      createGenesisBlock();
    };

    let tempHash = calculateHash(chain.size(), previousHash(previousBlock), Time.now(), pendingTransactions);
    var nonce = 0;
    var blockHash = tempHash;

    // Simple proof of work simulation - in a real blockchain this would be more robust
    while (not isValidHashDifficulty(blockHash, DIFFICULTY)) {
      nonce := nonce + 1;
      blockHash := calculateHash(chain.size(), previousHash(previousBlock), Time.now(), pendingTransactions) # Nat.toText(nonce);
    };

    let newBlock : Block = {
      index = chain.size();
      timestamp = Time.now();
      transactions = pendingTransactions;
      previousHash = previousHash(previousBlock);
      hash = blockHash;
      nonce = nonce;
    };

    let chainBuffer = Buffer.fromArray<Block>(chain);
    chainBuffer.add(newBlock);
    chain := Buffer.toArray(chainBuffer);
    pendingTransactions := [];

    Debug.print("New block created with index: " # Nat.toText(newBlock.index) # " and " # Nat.toText(newBlock.transactions.size()) # " transactions.");
  };

  private func previousHash(block : Block) : Text {
    block.hash;
  };

  private func createGenesisBlock() : Block {
    {
      index = 0;
      timestamp = Time.now();
      transactions = [];
      previousHash = "0";
      hash = "genesis_block_hash";
      nonce = 0;
    };
  };

  private func calculateHash(index : Nat, previousHash : Text, timestamp : Int, transactions : [Transaction]) : Text {
    let transactionIds = Array.map<Transaction, Text>(transactions, func(tx : Transaction) : Text { tx.id });
    let transactionsText = Text.join(",", Array.vals(transactionIds));
    let hashInput = Nat.toText(index) # previousHash # Int.toText(timestamp) # transactionsText;
    let hashValue = Text.hash(hashInput);
    Nat32.toText(hashValue);
  };

  private func isValidHashDifficulty(hash : Text, difficulty : Nat) : Bool {
    let prefix = Array.tabulate<Text>(difficulty, func(_) { "0" });
    let prefixText = Text.join("", prefix.vals());
    Text.startsWith(hash, #text prefixText);
  };

  // Validate a transaction
  private func validateTransaction(tx : Transaction) : Bool {
    let currentTime = Time.now();
    // Transaction shouldn't be from the future or too old
    if (tx.timestamp < currentTime - 3600_000_000_000 or tx.timestamp > currentTime + 60_000_000_000) {
      return false;
    };

    // Validate transaction type-specific fields
    switch (tx.transactionType) {
      case (#EXERCISE_RECORD(data)) {
        if (data.reps == 0 or data.duration <= 0) {
          return false;
        };
      };
      case (#CHALLENGE_CREATE(data)) {
        if (data.targetReps == 0 or data.duration <= 0) {
          return false;
        };
      };
      case (#CHALLENGE_COMPLETE(data)) {
        if (data.totalReps == 0) {
          return false;
        };
      };
      case (#CURRENCY_EXCHANGE(data)) {
        if (data.exchangeRate == 0 or Text.size(data.currencyType) == 0) {
          return false;
        };
      };
      case (_) {};
    };

    true;
  };

  private func getPriority(txType : TransactionType) : Nat {
    switch (txType) {
      case (#EXERCISE_RECORD(_)) { 1 };
      case (#CHALLENGE_CREATE(_)) { 2 };
      case (#CHALLENGE_JOIN(_)) { 2 };
      case (#CHALLENGE_COMPLETE(_)) { 3 };
      case (#REP_COIN_REWARD(_)) { 4 };
      case (#MARKETPLACE_PURCHASE(_)) { 5 };
      case (#CURRENCY_EXCHANGE(_)) { 6 };
    };
  };

  // Exercise Management
  private func recordExercise(userId : Principal, reps : Nat, duration : Int, caloriesBurned : Nat) : async () {
    let userKey = principalKey(userId);

    switch (Trie.get(userTrie, userKey, Principal.equal)) {
      case (?user) {
        let exerciseId = Text.concat("ex_", Nat32.toText(Text.hash(Principal.toText(userId) # Int.toText(Time.now()))));

        let exercise : Exercise = {
          id = exerciseId;
          name = "Workout Session";
          reps = reps;
          duration = duration;
          caloriesBurned = caloriesBurned;
          timestamp = Time.now();
          userId = userId;
        };

        exerciseTrie := Trie.put(exerciseTrie, textKey(exerciseId), Text.equal, exercise).0;

        // Update user stats
        let currentTime = Time.now();
        let hoursDiff = if (user.lastExerciseTime == 0) {
          25 // First exercise
        } else {
          Int.abs(currentTime - user.lastExerciseTime) / (3600_000_000_000); // Convert nanoseconds to hours
        };

        let newStreak = if (hoursDiff <= STREAK_THRESHOLD_HOURS) {
          user.streak + 1;
        } else {
          1 // Reset streak but count current exercise
        };

        let rewardPoints = calculateReward(reps, caloriesBurned, newStreak);

        // Level up logic - every 1000 points
        let newLevel = (user.repCoins + rewardPoints) / 1000 + 1;
        let leveledUp = newLevel > user.level;

        let updatedUser : User = {
          id = user.id;
          username = user.username;
          repCoins = user.repCoins + rewardPoints;
          streak = newStreak;
          lastExerciseTime = currentTime;
          achievements = if (leveledUp) {
            Array.append(user.achievements, ["Reached Level " # Nat.toText(newLevel)]);
          } else {
            user.achievements;
          };
          totalCaloriesBurned = user.totalCaloriesBurned + caloriesBurned;
          level = newLevel;
        };

        userTrie := Trie.put(userTrie, userKey, Principal.equal, updatedUser).0;

        if (leveledUp) {
          Debug.print("User " # updatedUser.username # " leveled up to " # Nat.toText(newLevel) # "!");
        };
      };
      case null {
        // User not found - this shouldn't happen if we validate properly
        Debug.print("Error recording exercise: User not found");
      };
    };
  };

  private func calculateReward(reps : Nat, caloriesBurned : Nat, streak : Nat) : Nat {
    let baseReward = BASE_REP_REWARD;
    let repMultiplier = reps / 10; // 1 point per 10 reps
    let calorieMultiplier = caloriesBurned / 5; // 1 point per 5 calories
    let streakBonus = if (streak >= 7) {
      streak / 7 * 20 // 20 bonus points for each week of streak
    } else {
      0;
    };

    baseReward + repMultiplier + calorieMultiplier + streakBonus;
  };

  // Challenge Management
  public shared (msg) func createChallenge(
    id : Text,
    name : Text,
    description : Text,
    targetReps : Nat,
    durationHours : Int,
    reward : Nat,
    creator : Principal,
  ) : async Result.Result<Challenge, Text> {
    let challengeId = if (Text.size(id) > 0) {
      id;
    } else {
      "ch_" # Nat32.toText(Text.hash(name # Principal.toText(creator) # Int.toText(Time.now())));
    };

    let startTime = Time.now();
    let endTime = startTime + (durationHours * 3600_000_000_000); // Convert hours to nanoseconds

    let challenge : Challenge = {
      id = challengeId;
      name = name;
      description = description;
      startTime = startTime;
      endTime = endTime;
      participants = [creator]; // Creator automatically joins
      rewards = reward;
      status = "ACTIVE";
      targetReps = targetReps;
      currentReps = 0;
      creator = creator;
    };

    challengeTrie := Trie.put(challengeTrie, textKey(challengeId), Text.equal, challenge).0;
    #ok(challenge);
  };

  public shared (msg) func joinChallenge(challengeId : Text, userId : Principal) : async Result.Result<Challenge, Text> {
    let challengeKey = textKey(challengeId);

    switch (Trie.get(challengeTrie, challengeKey, Text.equal)) {
      case (?challenge) {
        if (challenge.status != "ACTIVE") {
          return #err("Challenge is not active");
        };

        if (Time.now() > challenge.endTime) {
          return #err("Challenge has ended");
        };

        // Check if user is already a participant
        let isParticipant = Array.find<Principal>(challenge.participants, func(p) { Principal.equal(p, userId) });
        if (Option.isSome(isParticipant)) {
          return #err("Already joined this challenge");
        };

        // Add user to participants
        let updatedParticipants = Array.append(challenge.participants, [userId]);
        let updatedChallenge = {
          id = challenge.id;
          name = challenge.name;
          description = challenge.description;
          startTime = challenge.startTime;
          endTime = challenge.endTime;
          participants = updatedParticipants;
          rewards = challenge.rewards;
          status = challenge.status;
          targetReps = challenge.targetReps;
          currentReps = challenge.currentReps;
          creator = challenge.creator;
        };

        challengeTrie := Trie.put(challengeTrie, challengeKey, Text.equal, updatedChallenge).0;
        #ok(updatedChallenge);
      };
      case null {
        #err("Challenge not found");
      };
    };
  };

  public shared (msg) func completeChallenge(challengeId : Text, userId : Principal) : async Result.Result<Challenge, Text> {
    let challengeKey = textKey(challengeId);

    switch (Trie.get(challengeTrie, challengeKey, Text.equal)) {
      case (?challenge) {
        if (challenge.status != "ACTIVE") {
          return #err("Challenge is not active");
        };

        // Check if user is a participant
        let isParticipant = Array.find<Principal>(challenge.participants, func(p) { Principal.equal(p, userId) });
        if (Option.isNull(isParticipant)) {
          return #err("Not a participant in this challenge");
        };

        // Mark challenge as completed
        let updatedChallenge = {
          id = challenge.id;
          name = challenge.name;
          description = challenge.description;
          startTime = challenge.startTime;
          endTime = challenge.endTime;
          participants = challenge.participants;
          rewards = challenge.rewards;
          status = "COMPLETED";
          targetReps = challenge.targetReps;
          currentReps = challenge.targetReps; // Assume target met
          creator = challenge.creator;
        };

        challengeTrie := Trie.put(challengeTrie, challengeKey, Text.equal, updatedChallenge).0;

        // Reward participants
        for (participant in Array.vals(challenge.participants)) {
          let userKey = principalKey(participant);
          switch (Trie.get(userTrie, userKey, Principal.equal)) {
            case (?user) {
              let updatedUser : User = {
                id = user.id;
                username = user.username;
                repCoins = user.repCoins + challenge.rewards;
                streak = user.streak;
                lastExerciseTime = user.lastExerciseTime;
                achievements = Array.append(user.achievements, ["Completed Challenge: " # challenge.name]);
                totalCaloriesBurned = user.totalCaloriesBurned;
                level = user.level;
              };
              userTrie := Trie.put(userTrie, userKey, Principal.equal, updatedUser).0;
            };
            case null {};
          };
        };

        #ok(updatedChallenge);
      };
      case null {
        #err("Challenge not found");
      };
    };
  };

  // Query Functions
  public query func getChain() : async [Block] {
    chain;
  };

  public query func getPendingTransactions() : async [Transaction] {
    pendingTransactions;
  };

  public query func getLatestBlock() : async ?Block {
    if (chain.size() > 0) {
      ?chain[chain.size() - 1];
    } else {
      null;
    };
  };

  public query func getChallenges() : async [Challenge] {
    Trie.toArray<Text, Challenge, Challenge>(
      challengeTrie,
      func(k, v) { v },
    );
  };

  public query func getActiveChallenges() : async [Challenge] {
    let challenges = Trie.toArray<Text, Challenge, Challenge>(
      challengeTrie,
      func(k, v) { v },
    );

    Array.filter<Challenge>(
      challenges,
      func(c) {
        c.status == "ACTIVE" and c.endTime > Time.now()
      },
    );
  };

  public query func getLeaderboard(limit : Nat) : async [User] {
    let users = Trie.toArray<Principal, User, User>(
      userTrie,
      func(k, v) { v },
    );

    // Sort by repCoins (descending)
    let sortedUsers = Array.sort<User>(
      users,
      func(a, b) { Nat.compare(b.repCoins, a.repCoins) },
    );

    // Return top N users
    let resultSize = if (limit > 0 and limit < sortedUsers.size()) {
      limit;
    } else {
      sortedUsers.size();
    };

    Array.subArray<User>(sortedUsers, 0, resultSize);
  };

  // Get current exchange rates
  public query func getExchangeRates() : async [(Text, Nat)] {
    return [
      ("ETH", ETH_RATE),
      ("BTC", BTC_RATE),
      ("USDC", USDC_RATE),
      ("USDT", USDT_RATE),
      ("ICP", ICP_RATE),
      ("USD", USD_RATE),
      ("INR", INR_RATE),
      ("EUR", EUR_RATE),
      ("GBP", GBP_RATE),
      ("JPY", JPY_RATE),
      ("AUD", AUD_RATE),
      ("CAD", CAD_RATE),
    ];
  };

  // System Upgrade and Management
  system func preupgrade() {
    // Data is already in stable variables
    Debug.print("Preparing for canister upgrade.");
  };

  system func postupgrade() {
    Debug.print("Canister upgrade complete.");
  };

  // Currency Exchange Function
  public shared (msg) func exchangeRepCoinsForCurrency(amount : Nat, currencyType : Text, exchangeRate : Nat, externalTxId : Text) : async Result.Result<Transaction, Text> {
    // Verify sender exists and has enough RepCoins
    let senderKey = principalKey(msg.caller);

    switch (Trie.get(userTrie, senderKey, Principal.equal)) {
      case null {
        return #err("User not registered");
      };
      case (?user) {
        if (user.repCoins < amount) {
          return #err("Insufficient RepCoins for exchange");
        };

        // Create a transaction for the exchange
        let txType = #CURRENCY_EXCHANGE({
          currencyType = currencyType;
          exchangeRate = exchangeRate;
          externalTxId = externalTxId;
        });

        // Create the transaction
        let transaction : Transaction = {
          id = genTxId(msg.caller, Time.now());
          sender = msg.caller;
          recipient = msg.caller; // Self transaction for exchange
          amount = amount;
          timestamp = Time.now();
          signature = ""; // In a real system, we would use cryptographic signing
          transactionType = txType;
          priority = getPriority(txType);
        };

        if (not validateTransaction(transaction)) {
          return #err("Invalid transaction");
        };

        // Update the user's repcoins (deduct the exchanged amount)
        let updatedUser : User = {
          id = user.id;
          username = user.username;
          repCoins = user.repCoins - amount;
          streak = user.streak;
          lastExerciseTime = user.lastExerciseTime;
          achievements = user.achievements;
          totalCaloriesBurned = user.totalCaloriesBurned;
          level = user.level;
        };

        userTrie := Trie.put(userTrie, senderKey, Principal.equal, updatedUser).0;

        // Store the transaction
        let key = textKey(transaction.id);
        transactionTrie := Trie.put(transactionTrie, key, Text.equal, transaction).0;

        // Update pending transactions and create block if needed
        let pendingBuffer = Buffer.fromArray<Transaction>(pendingTransactions);
        pendingBuffer.add(transaction);
        pendingTransactions := Buffer.toArray(pendingBuffer);

        if (pendingTransactions.size() >= MAX_TRANSACTIONS_PER_BLOCK) {
          await createBlock();
        };

        return #ok(transaction);
      };
    };
  };
};
