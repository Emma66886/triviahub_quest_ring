import Quest from '../database/models/Quest';
import Badge from '../database/models/Badge';
import { DifficultyLevel } from '../database/models/User';
import { QuestType, QuestCategory } from '../database/models/Quest';

const seedQuests = async () => {
  const quests = [
    // NOVICE Level - Drag & Drop
    {
      title: "Welcome to Solana",
      description: "Build your first Solana connection by arranging blocks in the correct order",
      difficulty: DifficultyLevel.NOVICE,
      type: QuestType.VISUAL_PROGRAMMING,
      category: QuestCategory.ACCOUNTS,
      experienceReward: 100,
      solReward: 2,
      order: 1,
      prerequisites: [],
      estimatedTime: 5,
      content: {
        instructions: "Drag the blocks in the correct order to connect to Solana and check your setup",
        starterCode: "",
        solution: "",
        hints: [
          "Start by connecting to the network",
          "Then create your identity (keypair)",
          "Check your balance",
          "Finally, log the result"
        ],
        concepts: ["Connection", "Keypair", "Balance Check", "Devnet"],
        videoUrl: ""
      }
    },
    {
      title: "Check Your Balance",
      description: "Learn how to query account balances on Solana",
      difficulty: DifficultyLevel.NOVICE,
      type: QuestType.VISUAL_PROGRAMMING,
      category: QuestCategory.ACCOUNTS,
      experienceReward: 120,
      solReward: 2,
      order: 2,
      prerequisites: [],
      estimatedTime: 5,
      content: {
        instructions: "Arrange the steps to check an account balance on Solana",
        starterCode: "",
        solution: "",
        hints: [
          "First connect to the network",
          "Get the public key you want to check",
          "Fetch the balance",
          "Convert from lamports to SOL for display"
        ],
        concepts: ["Balance", "Lamports", "Public Key", "RPC"],
        videoUrl: ""
      }
    },
    {
      title: "Check Your Balance",
      description: "Query the blockchain to check any account's SOL balance",
      difficulty: DifficultyLevel.NOVICE,
      type: QuestType.CODE_COMPLETION,
      category: QuestCategory.ACCOUNTS,
      experienceReward: 180,
      solReward: 2,
      order: 4,
      prerequisites: [],
      estimatedTime: 18,
      content: {
        instructions: "Complete the code to check an account balance on Solana.",
        starterCode: `import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

async function checkBalance(address: string) {
  // TODO: Create a PublicKey from the address
  const publicKey = ___________;
  
  // TODO: Get the balance in lamports
  const balanceInLamports = await ___________;
  
  // TODO: Convert to SOL
  const balanceInSOL = balanceInLamports / ___________;
  
  console.log(\`Balance: \${balanceInSOL} SOL\`);
  return balanceInSOL;
}`,
        solution: `import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

async function checkBalance(address: string) {
  const publicKey = new PublicKey(address);
  const balanceInLamports = await connection.getBalance(publicKey);
  const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
  
  console.log(\`Balance: \${balanceInSOL} SOL\`);
  return balanceInSOL;
}`,
        hints: [
          "Use 'new PublicKey(address)' to create a PublicKey object",
          "Use 'connection.getBalance()' to fetch the balance",
          "Divide by LAMPORTS_PER_SOL to convert to SOL"
        ],
        concepts: ["Connection", "PublicKey", "Balance", "Lamports"],
        videoUrl: ""
      }
    },
    
    // EXPLORER Level - Guided Code
    {
      title: "Reading Account Data",
      description: "Fetch and decode detailed account information from the blockchain",
      difficulty: DifficultyLevel.EXPLORER,
      type: QuestType.CODE_COMPLETION,
      category: QuestCategory.ACCOUNTS,
      experienceReward: 200,
      solReward: 3,
      order: 1,
      prerequisites: [],
      estimatedTime: 20,
      content: {
        instructions: "Complete the code to fetch complete account data from the Solana blockchain.",
        starterCode: `import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

async function getAccountInfo(address: string) {
  const publicKey = new PublicKey(address);
  
  // TODO: Fetch the account info
  const accountInfo = await ___________;
  
  if (!accountInfo) {
    throw new Error('Account not found');
  }
  
  console.log('Balance:', accountInfo.lamports);
  console.log('Owner:', accountInfo.owner.toBase58());
  console.log('Executable:', accountInfo.executable);
  
  return accountInfo;
}`,
        solution: `import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

async function getAccountInfo(address: string) {
  const publicKey = new PublicKey(address);
  const accountInfo = await connection.getAccountInfo(publicKey);
  
  if (!accountInfo) {
    throw new Error('Account not found');
  }
  
  console.log('Balance:', accountInfo.lamports);
  console.log('Owner:', accountInfo.owner.toBase58());
  console.log('Executable:', accountInfo.executable);
  
  return accountInfo;
}`,
        hints: [
          "Use 'connection.getAccountInfo()' to fetch account data",
          "The method returns null if the account doesn't exist",
          "AccountInfo contains balance, owner, and data fields"
        ],
        concepts: ["Connection", "PublicKey", "AccountInfo", "Account Owner"],
        videoUrl: ""
      }
    },
    {
      title: "Create a Keypair",
      description: "Generate a new keypair for creating accounts on Solana",
      difficulty: DifficultyLevel.EXPLORER,
      type: QuestType.CODE_COMPLETION,
      category: QuestCategory.ACCOUNTS,
      experienceReward: 220,
      solReward: 3,
      order: 2,
      prerequisites: [],
      estimatedTime: 25,
      content: {
        instructions: "Learn how to create new keypairs - essential for account creation and testing.",
        starterCode: `import { Keypair } from '@solana/web3.js';

function createNewKeypair() {
  // TODO: Generate a new keypair
  const keypair = ___________;
  
  console.log('Public Key:', keypair.publicKey.toBase58());
  console.log('Secret Key length:', keypair.secretKey.length);
  
  return keypair;
}`,
        solution: `import { Keypair } from '@solana/web3.js';

function createNewKeypair() {
  const keypair = Keypair.generate();
  
  console.log('Public Key:', keypair.publicKey.toBase58());
  console.log('Secret Key length:', keypair.secretKey.length);
  
  return keypair;
}`,
        hints: [
          "Use 'Keypair.generate()' to create a new keypair",
          "A keypair contains both public and secret keys",
          "Never share your secret key!"
        ],
        concepts: ["Keypair", "Public Key", "Secret Key", "Account Creation"],
        videoUrl: ""
      }
    },
    {
      title: "Request Airdrop",
      description: "Request devnet SOL airdrop to fund your account for testing",
      difficulty: DifficultyLevel.EXPLORER,
      type: QuestType.CODE_COMPLETION,
      category: QuestCategory.TRANSACTIONS,
      experienceReward: 250,
      solReward: 3.5,
      order: 3,
      prerequisites: [],
      estimatedTime: 20,
      content: {
        instructions: "Request free devnet SOL to test your programs without spending real money.",
        starterCode: `import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

async function requestAirdrop(address: string, amountInSOL: number) {
  const publicKey = new PublicKey(address);
  
  // TODO: Calculate lamports
  const lamports = amountInSOL * ___________;
  
  // TODO: Request airdrop
  const signature = await ___________;
  
  // TODO: Confirm transaction
  await ___________;
  
  console.log('Airdrop successful! Signature:', signature);
  return signature;
}`,
        solution: `import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

async function requestAirdrop(address: string, amountInSOL: number) {
  const publicKey = new PublicKey(address);
  const lamports = amountInSOL * LAMPORTS_PER_SOL;
  
  const signature = await connection.requestAirdrop(publicKey, lamports);
  await connection.confirmTransaction(signature);
  
  console.log('Airdrop successful! Signature:', signature);
  return signature;
}`,
        hints: [
          "Multiply SOL amount by LAMPORTS_PER_SOL",
          "Use 'connection.requestAirdrop()' to request SOL",
          "Always confirm the transaction before proceeding"
        ],
        concepts: ["Airdrop", "Devnet", "Transaction Confirmation"],
        videoUrl: ""
      }
    },
    
    // BUILDER Level - Build from scratch
    {
      title: "Build a Token Transfer Program",
      description: "Create a complete program that transfers SPL tokens between accounts",
      difficulty: DifficultyLevel.BUILDER,
      type: QuestType.BUILD_FROM_SCRATCH,
      category: QuestCategory.TOKENS,
      experienceReward: 500,
      solReward: 5,
      order: 1,
      prerequisites: [],
      estimatedTime: 45,
      content: {
        instructions: "Build a complete SPL token transfer function from scratch. This is your first real-world Solana program!",
        starterCode: `// Write your token transfer program here\n// Hint: You'll need @solana/spl-token`,
        solution: "",
        hints: [
          "Import necessary modules from @solana/spl-token",
          "Create token accounts for sender and receiver",
          "Use the transfer instruction",
          "Don't forget to sign the transaction"
        ],
        concepts: ["SPL Tokens", "Token Accounts", "Transfer Instructions", "Associated Token Accounts"],
        videoUrl: ""
      }
    },
    {
      title: "Create Your First NFT",
      description: "Mint and configure a non-fungible token on Solana",
      difficulty: DifficultyLevel.BUILDER,
      type: QuestType.BUILD_FROM_SCRATCH,
      category: QuestCategory.NFTS,
      experienceReward: 600,
      solReward: 6,
      order: 2,
      prerequisites: [],
      estimatedTime: 60,
      content: {
        instructions: "Create and mint your first NFT using Metaplex standards. Add metadata and make it truly unique!",
        starterCode: `// Build your NFT minting program here`,
        solution: "",
        hints: [
          "Use Metaplex Token Metadata program",
          "NFTs have supply of 1 and decimals of 0",
          "Add metadata with name, symbol, and URI",
          "Update authority controls who can modify the NFT"
        ],
        concepts: ["NFTs", "Metaplex", "Token Metadata", "Minting"],
        videoUrl: ""
      }
    },
    
    // MASTER Level - Advanced challenges
    {
      title: "Build a Staking Vault",
      description: "Create a secure staking program with rewards distribution",
      difficulty: DifficultyLevel.MASTER,
      type: QuestType.BUILD_FROM_SCRATCH,
      category: QuestCategory.DEFI,
      experienceReward: 1000,
      solReward: 10,
      order: 1,
      prerequisites: [],
      estimatedTime: 90,
      content: {
        instructions: "Build a DeFi staking vault with deposit, withdraw, and reward features. Implement proper security and access controls.",
        starterCode: `// Build your staking vault program here`,
        solution: "",
        hints: [
          "Use PDAs to derive vault addresses",
          "Implement proper access controls",
          "Add emergency pause functionality",
          "Calculate and distribute rewards proportionally"
        ],
        concepts: ["PDAs", "Anchor Framework", "Security", "Access Control", "State Management"],
        videoUrl: ""
      }
    },
    {
      title: "Build a Token Swap Program",
      description: "Create an automated market maker (AMM) for token swaps",
      difficulty: DifficultyLevel.MASTER,
      type: QuestType.BUILD_FROM_SCRATCH,
      category: QuestCategory.DEFI,
      experienceReward: 1200,
      solReward: 12,
      order: 2,
      prerequisites: [],
      estimatedTime: 120,
      content: {
        instructions: "Build a decentralized exchange program similar to Uniswap. Implement constant product formula and liquidity pools.",
        starterCode: `// Build your AMM swap program here`,
        solution: "",
        hints: [
          "Implement x * y = k constant product formula",
          "Create liquidity pool accounts",
          "Calculate swap amounts with slippage",
          "Add liquidity provider fees"
        ],
        concepts: ["AMM", "Liquidity Pools", "Constant Product", "Slippage", "LP Tokens"],
        videoUrl: ""
      }
    }
  ];

  for (const quest of quests) {
    await Quest.findOneAndUpdate(
      { title: quest.title },
      quest,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Quests seeded successfully');
};

const seedBadges = async () => {
  const badges = [
    {
      name: "First Steps",
      description: "Complete your first quest",
      icon: "🎯",
      requirement: "Complete 1 quest",
      rarity: "COMMON",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "achievement", level: "beginner" }
      }
    },
    {
      name: "Novice Graduate",
      description: "Complete all Novice level quests",
      icon: "🌟",
      requirement: "Complete all NOVICE quests",
      rarity: "RARE",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "milestone", level: "novice" }
      }
    },
    {
      name: "Explorer Champion",
      description: "Master the Explorer level",
      icon: "🧭",
      requirement: "Complete all EXPLORER quests",
      rarity: "RARE",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "milestone", level: "explorer" }
      }
    },
    {
      name: "Builder Expert",
      description: "Conquer the Builder challenges",
      icon: "🏗️",
      requirement: "Complete all BUILDER quests",
      rarity: "EPIC",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "milestone", level: "builder" }
      }
    },
    {
      name: "Master Developer",
      description: "Achieve mastery in Solana development",
      icon: "👑",
      requirement: "Complete all MASTER quests",
      rarity: "LEGENDARY",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "milestone", level: "master" }
      }
    },
    {
      name: "Speed Runner",
      description: "Complete a quest in under 5 minutes",
      icon: "⚡",
      requirement: "Complete quest under 5 minutes",
      rarity: "EPIC",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "achievement", category: "speed" }
      }
    },
    {
      name: "Perfect Score",
      description: "Complete a quest without using hints",
      icon: "💯",
      requirement: "Complete quest with 0 hints used",
      rarity: "EPIC",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "achievement", category: "perfection" }
      }
    },
    {
      name: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      requirement: "7 day streak",
      rarity: "RARE",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "achievement", category: "consistency" }
      }
    },
    {
      name: "Token Expert",
      description: "Complete all token-related quests",
      icon: "🪙",
      requirement: "Complete all TOKENS quests",
      rarity: "EPIC",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "achievement", category: "tokens" }
      }
    },
    {
      name: "NFT Creator",
      description: "Complete all NFT quests",
      icon: "🎨",
      requirement: "Complete all NFTS quests",
      rarity: "EPIC",
      nftMetadata: {
        imageUri: "",
        attributes: { type: "achievement", category: "nfts" }
      }
    }
  ];

  for (const badge of badges) {
    await Badge.findOneAndUpdate(
      { name: badge.name },
      badge,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Badges seeded successfully');
};

export const seedDatabase = async () => {
  try {
    await seedQuests();
    await seedBadges();
    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
