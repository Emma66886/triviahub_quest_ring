import dotenv from 'dotenv';
import connectDatabase from '../config/database';
import Quest from '../database/models/Quest';
import Badge from '../database/models/Badge';
import { DifficultyLevel } from '../database/models/User';
import { QuestType, QuestCategory } from '../database/models/Quest';

dotenv.config();

const seedDragDropQuests = async () => {
  try {
    await connectDatabase();

    // Clear existing quests
    await Quest.deleteMany({});
    console.log('🗑️  Cleared existing quests');

    const quests = [
      // NOVICE Level
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
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'connection', text: 'Connect to Devnet', icon: '🔌', color: 'bg-blue-500' },
              { id: 'keypair', text: 'Create Keypair', icon: '🔑', color: 'bg-purple-500' },
              { id: 'balance', text: 'Check Balance', icon: '💰', color: 'bg-green-500' },
              { id: 'log', text: 'Log Result', icon: '📋', color: 'bg-gray-500' },
            ],
            correctOrder: ['connection', 'keypair', 'balance', 'log'],
            explanation: "Perfect! You've created your first Solana interaction: (1) Connect to devnet, (2) Create a keypair, (3) Check balance, (4) Log the result!"
          }
        },
        testCases: []
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
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'connection', text: 'Connect to Network', icon: '🔌', color: 'bg-purple-500' },
              { id: 'pubkey', text: 'Get Public Key', icon: '📍', color: 'bg-blue-500' },
              { id: 'getbalance', text: 'Get Balance', icon: '💵', color: 'bg-green-500' },
              { id: 'display', text: 'Display in SOL', icon: '✨', color: 'bg-yellow-500' },
            ],
            correctOrder: ['connection', 'pubkey', 'getbalance', 'display'],
            explanation: "Excellent! Balance checking: (1) Connect to network, (2) Get the public key, (3) Fetch balance, (4) Convert and display!"
          }
        },
        testCases: []
      },
      {
        title: "Understanding Lamports",
        description: "Master the conversion between SOL and lamports",
        difficulty: DifficultyLevel.NOVICE,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.ACCOUNTS,
        experienceReward: 100,
        solReward: 2,
        order: 3,
        prerequisites: [],
        estimatedTime: 5,
        content: {
          instructions: "Arrange blocks to convert between SOL and lamports",
          starterCode: "",
          solution: "",
          hints: [
            "1 SOL = 1 billion lamports",
            "Use LAMPORTS_PER_SOL constant",
            "Multiply or divide for conversion"
          ],
          concepts: ["Lamports", "Units", "Conversions"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'constant', text: 'LAMPORTS_PER_SOL', icon: '🔢', color: 'bg-blue-500' },
              { id: 'amount', text: 'Amount in SOL', icon: '💰', color: 'bg-green-500' },
              { id: 'multiply', text: 'Multiply', icon: '✖️', color: 'bg-purple-500' },
              { id: 'result', text: 'Lamports Result', icon: '✅', color: 'bg-cyan-500' },
            ],
            correctOrder: ['amount', 'multiply', 'constant', 'result'],
            explanation: "Perfect! To convert SOL to lamports: (1) Start with SOL amount, (2) Multiply by, (3) LAMPORTS_PER_SOL constant, (4) Get lamports result!"
          }
        },
        testCases: []
      },
      {
        title: "Your First Transaction",
        description: "Send SOL from one account to another",
        difficulty: DifficultyLevel.NOVICE,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.TRANSACTIONS,
        experienceReward: 150,
        solReward: 3,
        order: 4,
        prerequisites: [],
        estimatedTime: 8,
        content: {
          instructions: "Build a basic SOL transfer transaction",
          starterCode: "",
          solution: "",
          hints: [
            "Specify sender and recipient",
            "Set the amount",
            "Sign the transaction",
            "Send and confirm"
          ],
          concepts: ["Transactions", "Transfer", "Signatures"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'sender', text: 'From: Your Wallet', icon: '👤', color: 'bg-blue-500' },
              { id: 'recipient', text: 'To: Recipient', icon: '📨', color: 'bg-purple-500' },
              { id: 'amount', text: 'Amount: 0.1 SOL', icon: '💰', color: 'bg-green-500' },
              { id: 'sign', text: 'Sign Transaction', icon: '✍️', color: 'bg-orange-500' },
              { id: 'send', text: 'Send & Confirm', icon: '🚀', color: 'bg-pink-500' },
            ],
            correctOrder: ['sender', 'recipient', 'amount', 'sign', 'send'],
            explanation: "Awesome! Basic transaction: (1) Specify sender, (2) Set recipient, (3) Define amount, (4) Sign with your key, (5) Send and confirm!"
          }
        },
        testCases: []
      },

      // EXPLORER Level
      {
        title: "Request Airdrop",
        description: "Get free devnet SOL to start building",
        difficulty: DifficultyLevel.EXPLORER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.TRANSACTIONS,
        experienceReward: 150,
        solReward: 3,
        order: 1,
        prerequisites: [],
        estimatedTime: 5,
        content: {
          instructions: "Arrange the blocks to request free SOL from the devnet faucet",
          starterCode: "",
          solution: "",
          hints: [
            "Connect to devnet first",
            "Create or specify a keypair to receive SOL",
            "Request the airdrop with an amount",
            "Wait for confirmation"
          ],
          concepts: ["Airdrop", "Devnet", "Faucet", "Transaction Confirmation"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'connect', text: 'Connect to Devnet', icon: '🔌', color: 'bg-blue-500' },
              { id: 'keypair', text: 'Your Keypair', icon: '🔑', color: 'bg-purple-500' },
              { id: 'request', text: 'Request Airdrop', icon: '🪂', color: 'bg-green-500' },
              { id: 'confirm', text: 'Wait for Confirmation', icon: '⏳', color: 'bg-yellow-500' },
            ],
            correctOrder: ['connect', 'keypair', 'request', 'confirm'],
            explanation: "Great! Airdrop process: (1) Connect to devnet, (2) Specify your keypair, (3) Request airdrop, (4) Wait for confirmation!"
          }
        },
        testCases: []
      },
      {
        title: "Reading Account Data",
        description: "Fetch detailed information about any Solana account",
        difficulty: DifficultyLevel.EXPLORER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.ACCOUNTS,
        experienceReward: 180,
        solReward: 3,
        order: 2,
        prerequisites: [],
        estimatedTime: 8,
        content: {
          instructions: "Build the sequence to read and display account information",
          starterCode: "",
          solution: "",
          hints: [
            "Connect to the network",
            "Get the account address (public key)",
            "Fetch account info from the blockchain",
            "Display the data (owner, balance, etc.)"
          ],
          concepts: ["AccountInfo", "Public Key", "Account Owner", "Data Accounts"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'connect', text: 'Connect to RPC', icon: '🔌', color: 'bg-blue-500' },
              { id: 'pubkey', text: 'Account Address', icon: '📍', color: 'bg-purple-500' },
              { id: 'fetch', text: 'Get Account Info', icon: '📡', color: 'bg-green-500' },
              { id: 'display', text: 'Display Data', icon: '📊', color: 'bg-yellow-500' },
            ],
            correctOrder: ['connect', 'pubkey', 'fetch', 'display'],
            explanation: "Perfect! Reading accounts: (1) Connect to RPC, (2) Get account address, (3) Fetch account info, (4) Display the data!"
          }
        },
        testCases: []
      },
      {
        title: "Create a Keypair",
        description: "Generate cryptographic keys for Solana accounts",
        difficulty: DifficultyLevel.EXPLORER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.ACCOUNTS,
        experienceReward: 150,
        solReward: 3,
        order: 3,
        prerequisites: [],
        estimatedTime: 5,
        content: {
          instructions: "Arrange the steps to create and save a new keypair",
          starterCode: "",
          solution: "",
          hints: [
            "Generate a random keypair",
            "Extract the public key",
            "Save the secret key securely",
            "Display the public address"
          ],
          concepts: ["Keypair", "Public Key", "Secret Key", "Ed25519"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'generate', text: 'Generate Keypair', icon: '🎲', color: 'bg-purple-500' },
              { id: 'extract', text: 'Extract Public Key', icon: '🔓', color: 'bg-blue-500' },
              { id: 'save', text: 'Save Secret Key', icon: '💾', color: 'bg-red-500' },
              { id: 'display', text: 'Display Address', icon: '📝', color: 'bg-green-500' },
            ],
            correctOrder: ['generate', 'extract', 'save', 'display'],
            explanation: "Excellent! Keypair creation: (1) Generate random keypair, (2) Extract public key, (3) Save secret key securely, (4) Display address!"
          }
        },
        testCases: []
      },

      // BUILDER Level
      {
        title: "Build a Token Transfer Program",
        description: "Transfer SPL tokens between accounts",
        difficulty: DifficultyLevel.BUILDER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.TOKENS,
        experienceReward: 250,
        solReward: 5,
        order: 1,
        prerequisites: [],
        estimatedTime: 10,
        content: {
          instructions: "Build a complete token transfer by arranging these blocks correctly",
          starterCode: "",
          solution: "",
          hints: [
            "Start with the sender information",
            "Then specify the recipient",
            "Set the amount to transfer",
            "Finally, sign to authorize the transaction"
          ],
          concepts: ["SPL Tokens", "Token Transfer", "Authority", "Signatures"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'sender', text: 'From: Alice', icon: '👤', color: 'bg-purple-500' },
              { id: 'recipient', text: 'To: Bob', icon: '👤', color: 'bg-blue-500' },
              { id: 'amount', text: 'Amount: 5 Tokens', icon: '💰', color: 'bg-green-500' },
              { id: 'signature', text: 'Sign Transaction', icon: '🔑', color: 'bg-orange-500' },
            ],
            correctOrder: ['sender', 'recipient', 'amount', 'signature'],
            explanation: "Perfect! Token transfers need: (1) Sender, (2) Recipient, (3) Amount, (4) Signature to authorize!"
          }
        },
        testCases: []
      },
      {
        title: "Create Your First NFT",
        description: "Mint a unique non-fungible token on Solana",
        difficulty: DifficultyLevel.BUILDER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.NFTS,
        experienceReward: 300,
        solReward: 6,
        order: 2,
        prerequisites: [],
        estimatedTime: 12,
        content: {
          instructions: "Follow the NFT minting process by arranging these steps",
          starterCode: "",
          solution: "",
          hints: [
            "First prepare your metadata (image, name, etc)",
            "Create the mint account",
            "Create a token account to hold it",
            "Mint exactly 1 token",
            "Freeze the mint authority to make it unique"
          ],
          concepts: ["NFTs", "Metaplex", "Token Metadata", "Mint Authority"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'metadata', text: 'Upload Metadata', icon: '📄', color: 'bg-purple-500' },
              { id: 'mint', text: 'Create Mint', icon: '🎨', color: 'bg-pink-500' },
              { id: 'token-account', text: 'Token Account', icon: '🏦', color: 'bg-blue-500' },
              { id: 'mint-to', text: 'Mint NFT', icon: '⚡', color: 'bg-yellow-500' },
              { id: 'freeze', text: 'Freeze Authority', icon: '❄️', color: 'bg-cyan-500' },
            ],
            correctOrder: ['metadata', 'mint', 'token-account', 'mint-to', 'freeze'],
            explanation: "Amazing! NFT minting: (1) Upload metadata, (2) Create mint, (3) Create token account, (4) Mint 1 token, (5) Freeze to make unique!"
          }
        },
        testCases: []
      },
      {
        title: "Token Account Creation",
        description: "Set up accounts to hold SPL tokens",
        difficulty: DifficultyLevel.BUILDER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.TOKENS,
        experienceReward: 220,
        solReward: 4,
        order: 3,
        prerequisites: [],
        estimatedTime: 8,
        content: {
          instructions: "Arrange the steps to create a token account",
          starterCode: "",
          solution: "",
          hints: [
            "Specify which token type",
            "Set the account owner",
            "Pay rent for account storage",
            "Execute the creation"
          ],
          concepts: ["Token Accounts", "Associated Token Accounts", "Rent"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'token-mint', text: 'Token Mint Address', icon: '🪙', color: 'bg-purple-500' },
              { id: 'owner', text: 'Set Owner', icon: '👤', color: 'bg-blue-500' },
              { id: 'rent', text: 'Pay Rent', icon: '💵', color: 'bg-green-500' },
              { id: 'create', text: 'Create Account', icon: '✨', color: 'bg-pink-500' },
            ],
            correctOrder: ['token-mint', 'owner', 'rent', 'create'],
            explanation: "Great! Token account creation: (1) Specify token mint, (2) Set owner, (3) Pay rent, (4) Create account!"
          }
        },
        testCases: []
      },

      // MASTER Level
      {
        title: "Build a Staking Vault",
        description: "Create a system for users to stake tokens and earn rewards",
        difficulty: DifficultyLevel.MASTER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.DEFI,
        experienceReward: 400,
        solReward: 8,
        order: 1,
        prerequisites: [],
        estimatedTime: 15,
        content: {
          instructions: "Build a staking mechanism by arranging the components correctly",
          starterCode: "",
          solution: "",
          hints: [
            "Initialize the vault account first",
            "Validate user has tokens to stake",
            "Transfer tokens to vault",
            "Record stake timestamp",
            "Calculate and track rewards"
          ],
          concepts: ["Staking", "Vault Accounts", "Rewards", "Time-locked Tokens"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'init-vault', text: 'Initialize Vault', icon: '🏦', color: 'bg-purple-500' },
              { id: 'validate', text: 'Validate Balance', icon: '✅', color: 'bg-blue-500' },
              { id: 'transfer', text: 'Transfer to Vault', icon: '➡️', color: 'bg-green-500' },
              { id: 'timestamp', text: 'Record Timestamp', icon: '⏰', color: 'bg-yellow-500' },
              { id: 'rewards', text: 'Calculate Rewards', icon: '💰', color: 'bg-pink-500' },
            ],
            correctOrder: ['init-vault', 'validate', 'transfer', 'timestamp', 'rewards'],
            explanation: "Excellent! Staking vault: (1) Initialize vault, (2) Validate user balance, (3) Transfer to vault, (4) Record timestamp, (5) Calculate rewards!"
          }
        },
        testCases: []
      },
      {
        title: "Build a Token Swap Program",
        description: "Create an automated market maker for token swaps",
        difficulty: DifficultyLevel.MASTER,
        type: QuestType.VISUAL_PROGRAMMING,
        category: QuestCategory.DEFI,
        experienceReward: 500,
        solReward: 10,
        order: 2,
        prerequisites: [],
        estimatedTime: 18,
        content: {
          instructions: "Arrange the swap logic components in the correct order",
          starterCode: "",
          solution: "",
          hints: [
            "Check liquidity pool exists",
            "Validate input token amount",
            "Calculate output amount using AMM formula",
            "Execute the swap",
            "Update pool reserves"
          ],
          concepts: ["AMM", "Liquidity Pools", "Token Swaps", "Constant Product"],
          videoUrl: "",
          blockData: {
            availableBlocks: [
              { id: 'check-pool', text: 'Check Pool Exists', icon: '🔍', color: 'bg-blue-500' },
              { id: 'validate', text: 'Validate Amount', icon: '✅', color: 'bg-purple-500' },
              { id: 'calculate', text: 'AMM Formula', icon: '🧮', color: 'bg-green-500' },
              { id: 'swap', text: 'Execute Swap', icon: '🔄', color: 'bg-orange-500' },
              { id: 'update', text: 'Update Reserves', icon: '📊', color: 'bg-pink-500' },
            ],
            correctOrder: ['check-pool', 'validate', 'calculate', 'swap', 'update'],
            explanation: "Perfect! Token swap: (1) Check pool exists, (2) Validate input, (3) Calculate with AMM formula, (4) Execute swap, (5) Update pool reserves!"
          }
        },
        testCases: []
      }
    ];

    await Quest.insertMany(quests);
    console.log(`✅ ${quests.length} drag-and-drop quests seeded successfully`);

    // Seed badges
    await Badge.deleteMany({});
    
    const badges = [
      {
        name: 'First Steps',
        description: 'Completed your first Solana quest',
        icon: '🎯',
        imageUrl: 'https://via.placeholder.com/150?text=First+Steps',
        requirement: 'Complete 1 quest',
        rarity: 'COMMON'
      },
      {
        name: 'Novice Developer',
        description: 'Completed all NOVICE quests',
        icon: '🌱',
        imageUrl: 'https://via.placeholder.com/150?text=Novice',
        requirement: 'Complete all NOVICE difficulty quests',
        rarity: 'COMMON'
      },
      {
        name: 'Explorer',
        description: 'Completed all EXPLORER quests',
        icon: '🧭',
        imageUrl: 'https://via.placeholder.com/150?text=Explorer',
        requirement: 'Complete all EXPLORER difficulty quests',
        rarity: 'RARE'
      },
      {
        name: 'Builder',
        description: 'Completed all BUILDER quests',
        icon: '🔨',
        imageUrl: 'https://via.placeholder.com/150?text=Builder',
        requirement: 'Complete all BUILDER difficulty quests',
        rarity: 'EPIC'
      },
      {
        name: 'Master',
        description: 'Completed all MASTER quests',
        icon: '👑',
        imageUrl: 'https://via.placeholder.com/150?text=Master',
        requirement: 'Complete all MASTER difficulty quests',
        rarity: 'LEGENDARY'
      }
    ];

    await Badge.insertMany(badges);
    console.log(`✅ ${badges.length} badges seeded successfully`);

    console.log('🎉 Database seeded successfully with drag-and-drop quests!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDragDropQuests();
