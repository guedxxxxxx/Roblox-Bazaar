require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// Updated server configuration for Roblox Bazaar
const SERVER_ID = '1395915214582714418';
const BUYER_ROLE_ID = '1396976275964432454';
const OWNER_ROLE_ID = '1395915214582714422';
const MODERATOR_ROLE_ID = '1395915214582714420'; // Former server manager role
const TICKET_CREATION_CHANNEL_ID = '1395915215027306521';
const VOUCH_CHANNEL_ID = '1396973300474712225';
const SPENDING_LOG_CHANNEL_ID = '1396973366157512855';
const CUSTOM_PRODUCTS_LOG_CHANNEL_ID = '1398157780266913822'; // Custom products log channel

// Thread channel IDs for category redirects
const THREAD_CHANNELS = {
  'grow_garden': '1395916682475733062',
  'steal_brainrot': '1396365176311124008',
  'robux': '1395916801761742896',
  'accounts': '1395916859940802671',
  'mm2': '1395916762452852777',
  'adopt_me': '1395916725362360400'
};

// Thread messages content
const THREAD_MESSAGES = {
  'grow_garden': `## __VALUED PETS__
> ### - <a:arrow:1396727506970611762> queen bee <:queenbee:1396728659733119097> = $3 | 800 robux
> ### - <a:arrow:1396727506970611762> mimic octopus <:mimicoctopus:1396728617303670794> = $3.5 | 900 robux
> ### - <a:arrow:1396727506970611762> t-rex <:trex:1396728568872046754>﻿ = $4 | 1000 robux
> ### - <a:arrow:1396727506970611762> dragonfly <:dragonfly:1396728518322421770> = $4.5 | 1100 robux
> ### - <a:arrow:1396727506970611762> spinosaurus <:spinosaurus:1396728468393168966> = $5.5 | 1300 robux
> ### - <a:arrow:1396727506970611762> fennec fox <:FennecFox:1396728422192906300> = $6.5 | 1400 robux
> ### - <a:arrow:1396727506970611762> butterfly 🦋﻿ = $6.5 | 1400 robux
> ### - <a:arrow:1396727506970611762> raccoon 🦝 = $7.5 | 1700 robux
> ### - <a:arrow:1396727506970611762> disco bee <:discobee:1396728748384063572> = $8.5 | 1900 robux

## __PETS__
> ### - <a:arrow:1396727506970611762> red fox <:redfox:1396727303714766919> = $1 | 300 robux
> ### - <a:arrow:1396727506970611762> chicken zombie <:ChickenZombie:1396727233586004120> = $3 | 800 robux

# ROBUX TAXES COVERED BY ME! <:heh:1395940875078733844> 
# IF YOU HAVE ANY PET REQUESTS OPEN TICKET FOR "others"
\`\`\` \`\`\`
# PAYMENTS
> ### - <:Robux:1396727560330678314> robux
> ### - <:Litecoin:1396727350355300382> litecoin (20% less)
> ### - <:Amazon:1396727398514561176> amazon gc (NA)
> ### - <:Cashapp:1390325857540636754> cashapp (NA)
> ### - <:Paypal:1390441988112908288> paypal fnf (15% fee)
> ### - <:apple:1384382193786294313> apple cash (10% fee)
# MAKE A TICKET TO BUY
-# @everyone`,
  'steal_brainrot': `## SECRETS
> ### - <a:arrow:1396727506970611762> La Vacca = 1.5$ | 400 robux
> ### - <a:arrow:1396727506970611762> Spiderini Chimpanzini = 2$ | 550 robux
> ### - <a:arrow:1396727506970611762> Los Tralalitos = 5$ | 1200 robux
> ### - <a:arrow:1396727506970611762> Graipus Medussi = 6$ | 1400 robux
> ### - <a:arrow:1396727506970611762> La grande combination = 15$ | 3500 robux

## BRAINROT GODS
> ### - <a:arrow:1396727506970611762> Tralalero Tralala = 0.5$ | 150
> ### - <a:arrow:1396727506970611762> Odin din dun = 1$ | 300 robux
# ROBUX TAXES COVERED BY ME! 
\`\`\` \`\`\`
# PAYMENTS
> ### - <:Robux:1396727560330678314> robux
> ### - <:Litecoin:1396727350355300382> litecoin (20% less)
> ### - <:Amazon:1396727398514561176> amazon gc (NA)
> ### - <:Cashapp:1390325857540636754> cashapp (NA)
> ### - <:Paypal:1390441988112908288> paypal fnf (15% fee)
> ### - <:apple:1384382193786294313> apple cash (10% fee)
# MAKE A TICKET TO BUY
-# @everyone`,
  'robux': `> ## ROBUX
> ### - <a:arrow:1396727506970611762> 1K = 5$ per 1k
> ### - <a:arrow:1396727506970611762> 5K+ = 4.5$ per 1k
> ### - <a:arrow:1396727506970611762> 10k+ = 4$ per 1k
> ### - <a:arrow:1396727506970611762> 20k+ = 3$ per 1k
## IF U WANT MORE THAN 20K DM ME PRIVATE
# PAYMENTS
> ### - <:Litecoin:1396727350355300382> litecoin (20% less)
> ### - <:Amazon:1396727398514561176> amazon gc (NA)
> ### - <:Cashapp:1390325857540636754> cashapp (NA)
> ### - <:Paypal:1390441988112908288> paypal fnf (15% fee)
> ### - <:apple:1384382193786294313> apple cash (10% fee)
# MAKE A TICKET TO BUY
-# @everyone`,
  'accounts': `## ACCOUNTS
> ### - <a:arrow:1396727506970611762> Korblox account = 25$ | 6000 robux
> ### - <a:arrow:1396727506970611762> Headless account = 50$ | 12000 robux
> ### - <a:arrow:1396727506970611762> Headless + Korblox Account = 65$  | 15000 robux

# PAYMENTS
> ### - <:Robux:1396727560330678314> robux
> ### - <:Litecoin:1396727350355300382> litecoin (20% less)
> ### - <:Amazon:1396727398514561176> amazon gc (NA)
> ### - <:Cashapp:1390325857540636754> cashapp (NA)
> ### - <:Paypal:1390441988112908288> paypal fnf (15% fee)
> ### - <:apple:1384382193786294313> apple cash (10% fee)
# MAKE A TICKET TO BUY
-# @everyone`,
  'mm2': `## STARPETS
> ### - <a:arrow:1396727506970611762> Starpets is a place to buy MM2 stuff
> ### - <a:arrow:1396727506970611762> My starpets link is https://starpets.pw/mm2/user/687dd5c470bd92789cfd6fbc (for mm2)
> ### - <a:arrow:1396727506970611762> Open a ticket to get items 15% cheaper!

> # PAYMENTS
> ### - <:Litecoin:1396727350355300382> litecoin (20% less)
> ### - <:Amazon:1396727398514561176> amazon gc (NA)
> ### - <:Cashapp:1390325857540636754> cashapp (NA)
> ### - <:Paypal:1390441988112908288> paypal fnf (15% fee)
> ### - <:apple:1384382193786294313> apple cash (10% fee)
> # MAKE A TICKET TO BUY
> -# @everyone

# MAKE A TICKET TO BUY
-# @everyone`,
  'adopt_me': `## STARPETS
> ### - <a:arrow:1396727506970611762> Starpets is a place to buy pets and stuff
> ### - <a:arrow:1396727506970611762> My starpets link is https://starpets.pw/user/687dd5c470bd92789cfd6fbc (for adopt me)
> ### - <a:arrow:1396727506970611762> Open a ticket to get items 15% cheaper!

# PAYMENTS
> ### - <:Litecoin:1396727350355300382> litecoin (20% less)
> ### - <:Amazon:1396727398514561176> amazon gc (NA)
> ### - <:Cashapp:1390325857540636754> cashapp (NA)
> ### - <:Paypal:1390441988112908288> paypal fnf (15% fee)
> ### - <:apple:1384382193786294313> apple cash (10% fee)
# MAKE A TICKET TO BUY
-# @everyone`
};

// Payment methods for Roblox Bazaar
const CASHAPP_TAG = '$strzsnipes';
const LTC_ADDRESS = 'LbWR3z3Xg9WuAH69cbsSxfRg5bsqLGP9pr';
const PAYPAL_EMAIL = 'myrow383@gmail.com';

// Color scheme - Blue (80%) and Gray (20%)
const BLUE_COLOR = 0x4A90E2;
const GRAY_COLOR = 0x808080;

// Roblox Bazaar product categories
const BAZAAR_CATEGORIES = {
  'grow_garden': {
    name: 'Grow a garden',
    thread_id: '1395916682475733062'
  },
  'steal_brainrot': {
    name: 'Steal a brainrot',
    thread_id: '1396365176311124008'
  },
  'robux': {
    name: 'Robux',
    thread_id: '1395916801761742896'
  },
  'accounts': {
    name: 'Accounts',
    thread_id: '1395916859940802671'
  },
  'mm2': {
    name: 'MM2',
    thread_id: '1395916762452852777'
  },
  'adopt_me': {
    name: 'Adopt me',
    thread_id: '1395916725362360400'
  }
};

// Steal a Brainrot products with gamepass links
const STEAL_BRAINROT_PRODUCTS = {
  'la_vacca': {
    name: 'La Vacca',
    emoji: '🐄',
    price_usd: 1.5,
    price_robux: 400,
    gamepass: 'https://www.roblox.com/game-pass/1337634832/La-Vacca'
  },
  'spiderini_chimpanzini': {
    name: 'Spiderini Chimpanzini',
    emoji: '🕷️',
    price_usd: 2,
    price_robux: 550,
    gamepass: 'https://www.roblox.com/game-pass/1339481002/Spiderini-Chimpanzini'
  },
  'los_tralalitos': {
    name: 'Los Tralalitos',
    emoji: '🎵',
    price_usd: 5,
    price_robux: 1200,
    gamepass: 'https://www.roblox.com/game-pass/1336655120/Los-Tralalitos'
  },
  'graipus_medussi': {
    name: 'Graipus Medussi',
    emoji: '🪼',
    price_usd: 6,
    price_robux: 1400,
    gamepass: 'https://www.roblox.com/game-pass/1337305244/Graipus-Medussi'
  },
  'la_grande': {
    name: 'La grande combination',
    emoji: '👑',
    price_usd: 15,
    price_robux: 3500,
    gamepass: 'https://www.roblox.com/game-pass/1339796946/La-grande-combination'
  },
  'tralalero_tralala': {
    name: 'Tralalero Tralala',
    emoji: '🦈',
    price_usd: 0.5,
    price_robux: 150,
    gamepass: 'https://www.roblox.com/game-pass/1340534676/Tralalero-Tralala'
  },
  'odin_din_dun': {
    name: 'Odin din dun',
    emoji: '⚡',
    price_usd: 1,
    price_robux: 300,
    gamepass: 'https://www.roblox.com/game-pass/1335343638/Odin-din-dun'
  }
};

// Grow a Garden products with gamepass links
const GROW_GARDEN_PRODUCTS = {
  'queen_bee': {
    name: 'Queen Bee',
    emoji: '<:queenbee:1396728659733119097>',
    price_usd: 3,
    price_robux: 800,
    gamepass: 'https://www.roblox.com/game-pass/1340346708/queen-bee'
  },
  'mimic_octopus': {
    name: 'Mimic Octopus',
    emoji: '<:mimicoctopus:1396728617303670794>',
    price_usd: 3.5,
    price_robux: 900,
    gamepass: 'https://www.roblox.com/game-pass/1336953352/mimic-octopus'
  },
  't_rex': {
    name: 'T-Rex',
    emoji: '<:trex:1396728568872046754>',
    price_usd: 4,
    price_robux: 1000,
    gamepass: 'https://www.roblox.com/game-pass/1342090640/t-rex'
  },
  'dragonfly': {
    name: 'Dragonfly',
    emoji: '<:dragonfly:1396728518322421770>',
    price_usd: 4.5,
    price_robux: 1100,
    gamepass: 'https://www.roblox.com/game-pass/1336531289/dragonfly'
  },
  'spinosaurus': {
    name: 'Spinosaurus',
    emoji: '<:spinosaurus:1396728468393168966>',
    price_usd: 5.5,
    price_robux: 1300,
    gamepass: 'https://www.roblox.com/game-pass/1337638731/spinosaurus'
  },
  'fennec_fox': {
    name: 'Fennec Fox',
    emoji: '<:FennecFox:1396728422192906300>',
    price_usd: 6.5,
    price_robux: 1400,
    gamepass: 'https://www.roblox.com/game-pass/1335343646/fennec-fox'
  },
  'butterfly': {
    name: 'Butterfly',
    emoji: '🦋',
    price_usd: 6.5,
    price_robux: 1400,
    gamepass: 'https://www.roblox.com/game-pass/1339345016/butterfly'
  },
  'raccoon': {
    name: 'Raccoon',
    emoji: '🦝',
    price_usd: 7.5,
    price_robux: 1700,
    gamepass: 'https://www.roblox.com/game-pass/1340662549/raccoon'
  },
  'disco_bee': {
    name: 'Disco Bee',
    emoji: '<:discobee:1396728748384063572>',
    price_usd: 8.5,
    price_robux: 1900,
    gamepass: 'https://www.roblox.com/game-pass/1334941914/bee'
  },
  'red_fox': {
    name: 'Red Fox',
    emoji: '<:redfox:1396727303714766919>',
    price_usd: 1,
    price_robux: 300,
    gamepass: 'https://www.roblox.com/game-pass/1336201503/red-fox'
  },
  'chicken_zombie': {
    name: 'Chicken Zombie',
    emoji: '<:ChickenZombie:1396727233586004120>',
    price_usd: 3,
    price_robux: 800,
    gamepass: 'https://www.roblox.com/game-pass/1336201504/chicken-zombie'
  }
};

// Accounts products with gamepass links
const ACCOUNTS_PRODUCTS = {
  'korblox': {
    name: 'Korblox',
    emoji: '⚔️',
    price_usd: 25,
    price_robux: 6000,
    gamepass: 'https://www.roblox.com/game-pass/1342300571/Korblox'
  },
  'headless': {
    name: 'Headless',
    emoji: '👻',
    price_usd: 50,
    price_robux: 12000,
    gamepass: 'https://www.roblox.com/game-pass/1338541195/Headless'
  },
  'korblox_headless': {
    name: 'Korblox + Headless',
    emoji: '💀',
    price_usd: 65,
    price_robux: 15000,
    gamepass: 'https://www.roblox.com/game-pass/1341084477/Headless-Korblox'
  }
};

// User shopping carts - separate carts for each category
let userCarts = new Map(); // userId -> { grow_garden: [], steal_brainrot: [], accounts: [] }

// Custom products storage
let customProducts = {
  'grow_garden': {},
  'steal_brainrot': {},
  'accounts': {}
};

// Product creation sessions
let productCreationSessions = new Map();

let userTickets = new Map();
let userSpending = new Map();

// Check if user has admin permissions
function hasAdminPermissions(userId, member) {
  return userId === OWNER_ROLE_ID || 
         (member && (member.roles.cache.has(MODERATOR_ROLE_ID) || member.roles.cache.has(OWNER_ROLE_ID)));
}

// Get step number for product creation
function getStepNumber(step) {
  const steps = {
    'gamepass_link': 1,
    'product_name': 2,
    'product_emoji': 3,
    'price_usd': 4,
    'price_robux': 5,
    'category': 6
  };
  return steps[step] || 0;
}

// Count user's active tickets
function countUserTickets(userId) {
  let count = 0;
  for (const [ticketUserId, ticketId] of userTickets.entries()) {
    if (ticketUserId === userId) {
      const channel = client.channels.cache.get(ticketId);
      if (channel && channel.isThread() && !channel.archived) {
        count++;
      }
    }
  }
  return count;
}

// Load database
function loadDatabase() {
    try {
        const data = fs.readFileSync('database.json', 'utf8');
        const parsedData = JSON.parse(data);
        userTickets = new Map(Object.entries(parsedData.userTickets || {}));
        userSpending = new Map(Object.entries(parsedData.userSpending || {}));
        console.log('✅ Database loaded successfully!');
    } catch (error) {
        console.warn('⚠️ Could not load database.json. Starting with empty data.', error);
        userTickets = new Map();
        userSpending = new Map();
    }
}

// Save database
function saveDatabase() {
    const dataToSave = {
        userTickets: Object.fromEntries(userTickets),
        userSpending: Object.fromEntries(userSpending)
    };
    fs.writeFileSync('database.json', JSON.stringify(dataToSave, null, 2), 'utf8');
    console.log('💾 Database saved!');
}

// Update spending in the logging channel
async function updateSpendingLog(userId, totalUSD, totalRobux) {
  try {
    const logChannel = client.channels.cache.get(SPENDING_LOG_CHANNEL_ID);
    if (!logChannel) {
      console.warn('⚠️ Spending log channel not found');
      return;
    }

    const user = await client.users.fetch(userId);
    const messageFormat = `${user.username} (${userId}): $${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`;

    // Search for existing message for this user
    let foundMessage = null;
    let lastMessageId = null;
    let searchCount = 0;
    const maxSearches = 20;

    while (!foundMessage && searchCount < maxSearches) {
      const fetchOptions = { limit: 100 };
      if (lastMessageId) {
        fetchOptions.before = lastMessageId;
      }

      const messages = await logChannel.messages.fetch(fetchOptions);
      if (messages.size === 0) break;

      for (const [messageId, message] of messages) {
        if (message.author.id === client.user.id) {
          const pattern = new RegExp(`\\(${userId}\\):\\s*\\$[\\d,]+\\.\\d{2}\\s*USD\\s*\\|\\s*[\\d,]+\\s*Robux$`);
          if (pattern.test(message.content)) {
            foundMessage = message;
            break;
          }
        }
      }

      if (!foundMessage) {
        lastMessageId = messages.last().id;
        searchCount++;
      }

      if (messages.size < 100) break;
    }

    if (foundMessage) {
      await foundMessage.edit(messageFormat);
      console.log(`💰 Updated spending log for ${user.username}: $${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`);
    } else {
      await logChannel.send(messageFormat);
      console.log(`💰 Created new spending log for ${user.username}: $${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`);
    }

  } catch (error) {
    console.error('Error updating spending log:', error);
  }
}

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  // Handle product creation sessions
  if (productCreationSessions.has(message.author.id)) {
      const session = productCreationSessions.get(message.author.id);

      // Check if message is in the same channel as the session
      if (session.channelId !== message.channel.id) {
          return; // Ignore messages from other channels
      }

      // Handle cancel command
      if (message.content.toLowerCase() === 'cancel') {
          productCreationSessions.delete(message.author.id);
          return message.reply('❌ Product creation cancelled.');
      }

      const member = message.guild.members.cache.get(message.author.id);
      if (!hasAdminPermissions(message.author.id, member)) {
          productCreationSessions.delete(message.author.id);
          return message.reply('❌ Permission denied. Session cancelled.');
      }

      // Process the current step
      const content = message.content.trim();
      let nextStep = null;
      let promptMessage = '';

      switch (session.step) {
          case 'gamepass_link':
              if (!content.includes('roblox.com/game-pass/')) {
                  return message.reply('❌ Please provide a valid Roblox gamepass link! Example: https://www.roblox.com/game-pass/123456/cool-pet');
              }
              session.data.gamepass = content;
              nextStep = 'product_name';
              promptMessage = 'Great! Now please provide the **Product Name**.';
              break;

          case 'product_name':
              if (content.length < 2 || content.length > 50) {
                  return message.reply('❌ Product name must be between 2 and 50 characters!');
              }
              session.data.name = content;
              nextStep = 'product_emoji';
              promptMessage = 'Perfect! Now please provide an **Emoji** for this product (like 🐸 or 🌟).';
              break;

          case 'product_emoji':
              session.data.emoji = content;
              nextStep = 'price_usd';
              promptMessage = 'Nice! Now please provide the **Price in USD** (numbers only, like 5.50).';
              break;

          case 'price_usd':
              const priceUsd = parseFloat(content.replace(/[^\d.-]/g, ''));
              if (isNaN(priceUsd) || priceUsd < 0) {
                  return message.reply('❌ Please provide a valid USD price! Example: 5.50');
              }
              session.data.price_usd = priceUsd;
              nextStep = 'price_robux';
              promptMessage = 'Excellent! Now please provide the **Price in Robux** (numbers only, like 1200).';
              break;

          case 'price_robux':
              const priceRobux = parseInt(content.replace(/[^\d]/g, ''));
              if (isNaN(priceRobux) || priceRobux < 0) {
                  return message.reply('❌ Please provide a valid Robux price! Example: 1200');
              }
              session.data.price_robux = priceRobux;
              nextStep = 'category';
              promptMessage = 'Almost done! Now please provide the **Category** (grow_garden, steal_brainrot, or accounts).';
              break;

          case 'category':
              const category = content.toLowerCase();
              if (!['grow_garden', 'steal_brainrot', 'accounts'].includes(category)) {
                  return message.reply('❌ Invalid category! Please use: grow_garden, steal_brainrot, or accounts');
              }
              session.data.category = category;

              // Complete the product creation
              try {
                  const logChannel = client.channels.cache.get(CUSTOM_PRODUCTS_LOG_CHANNEL_ID);
                  if (!logChannel) {
                      productCreationSessions.delete(message.author.id);
                      return message.reply('❌ Custom products log channel not found!');
                  }

                  // Create unique key for the product
                  const productKey = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                  const newProduct = {
                      name: session.data.name,
                      emoji: session.data.emoji,
                      price_usd: session.data.price_usd,
                      price_robux: session.data.price_robux,
                      gamepass: session.data.gamepass,
                      custom: true
                  };

                  // Add to custom products storage
                  customProducts[session.data.category][productKey] = newProduct;

                  // Log the new product
                  const logEmbed = new EmbedBuilder()
                      .setTitle('✅ New Custom Product Added')
                      .addFields(
                          { name: 'Product Name', value: session.data.name, inline: true },
                          { name: 'Category', value: session.data.category, inline: true },
                          { name: 'Emoji', value: session.data.emoji, inline: true },
                          { name: 'Price USD', value: `$${session.data.price_usd.toFixed(2)}`, inline: true },
                          { name: 'Price Robux', value: `${session.data.price_robux.toLocaleString()}`, inline: true },
                          { name: 'Gamepass Link', value: session.data.gamepass, inline: false },
                          { name: 'Product ID', value: productKey, inline: false }
                      )
                      .setColor(BLUE_COLOR)
                      .setFooter({ text: `Added by ${message.author.username}` })
                      .setTimestamp();

                  // Add copy button for the product ID
                  const copyButton = new ButtonBuilder()
                      .setCustomId(`copy_product_id_${productKey}`)
                      .setLabel('Copy Product ID')
                      .setStyle(ButtonStyle.Secondary)
                      .setEmoji('📋');

                  const copyRow = new ActionRowBuilder().addComponents(copyButton);

                  const logMessage = await logChannel.send({ embeds: [logEmbed], components: [copyRow] });

                  // Update thread with new product
                  await updateThreadWithCustomProducts(session.data.category);

                  // Success message with thread link
                  const successEmbed = new EmbedBuilder()
                      .setTitle('🎉 Product Created Successfully!')
                      .setDescription(`**${session.data.name}** has been added to **${session.data.category}**!`)
                      .addFields(
                          { name: '📝 Details', value: `${session.data.emoji} **${session.data.name}**\n$${session.data.price_usd.toFixed(2)} USD | ${session.data.price_robux.toLocaleString()} Robux`, inline: false },
                          { name: '🔗 Product created at', value: `[View Log Message](${logMessage.url})`, inline: false }
                      )
                      .setColor(BLUE_COLOR)
                      .setTimestamp();

                  await message.reply({ embeds: [successEmbed] });

                  // Clean up session
                  productCreationSessions.delete(message.author.id);
                  return;

              } catch (error) {
                  console.error('Error creating product:', error);
                  productCreationSessions.delete(message.author.id);
                  return message.reply('❌ An error occurred while creating the product. Please try again.');
              }
      }

      // Update session and send next prompt
      if (nextStep) {
          session.step = nextStep;
          productCreationSessions.set(message.author.id, session);

          const promptEmbed = new EmbedBuilder()
              .setTitle('🛠️ Product Creation - Step ' + getStepNumber(nextStep) + '/6')
              .setDescription(promptMessage)
              .setColor(BLUE_COLOR)
              .setFooter({ text: 'Type "cancel" to cancel this process' });

          await message.reply({ embeds: [promptEmbed] });
      }

      return; // Don't process other commands during product creation
  }

  if (message.content.toLowerCase() === '!market') {
    const member = message.guild.members.cache.get(message.author.id);

    if (!hasAdminPermissions(message.author.id, member)) {
      return message.reply('❌ Only authorized staff can use this command!');
    }

    const bannerEmbed = new EmbedBuilder()
      .setImage("https://cdn.discordapp.com/attachments/1395915215027306522/1397436859466125362/standard_3-1.gif?ex=6881b7fe&is=6880667e&hm=f591ac20a93a3ef90cb29fc15abed4a7e58e81ff0c349e2f7beaf146b0f28379&")
      .setColor(BLUE_COLOR);

    const welcomeEmbed = new EmbedBuilder()
      .setTitle("__**✨ Welcome to the Roblox Bazaar✨**__")
      .setDescription(
        "This is the official server for our Roblox marketplace! We're thrilled to have you here.\n\n" +
        "🧺 **What you'll find here:**\n" +
        "🌸 Exclusive pets like Dragonfly, Raccoon, and others.\n" +
        "💳 Cheap Robux\n" +
        "🥷 Many more games like steal a brainrot, adopt me, and mm2!\n\n" +
        "💬 Got questions? Just ping staff and we'll help you out.\n\n" +
        "💫 **Payment methods accepted:**\n" +
        "Cashapp, PayPal, Litecoin, and Robux\n\n" +
        "**Please don't send payment unless staff is present!**\n\n" +
        "📋 **Ticket Rules:**\n" +
        "• When making a ticket state what you are purchasing and the payment type.\n" +
        "• Tell your username to the seller after paying to avoid giving to another person.\n" +
        "• When paying with a gift card ALWAYS send the code in the dms of the seller, not in the ticket.\n" +
        "• Please do not create a ticket if you do not have the required amount of robux/money.\n" +
        "• https://nohello.net/\n" +
        "• https://dontasktoask.com/"
      )
      .setColor(BLUE_COLOR);

    const growGardenButton = new ButtonBuilder()
      .setCustomId('redirect_grow_garden')
      .setLabel('🌱 Grow a garden')
      .setStyle(ButtonStyle.Primary);

    const stealBrainrotButton = new ButtonBuilder()
      .setCustomId('redirect_steal_brainrot')
      .setLabel('🧠 Steal a brainrot')
      .setStyle(ButtonStyle.Primary);

    const robuxButton = new ButtonBuilder()
      .setCustomId('redirect_robux')
      .setLabel('💰 Robux')
      .setStyle(ButtonStyle.Primary);

    const accountsButton = new ButtonBuilder()
      .setCustomId('redirect_accounts')
      .setLabel('👤 Accounts')
      .setStyle(ButtonStyle.Primary);

    const mm2Button = new ButtonBuilder()
      .setCustomId('redirect_mm2')
      .setLabel('🔪 MM2')
      .setStyle(ButtonStyle.Primary);

    const adoptMeButton = new ButtonBuilder()
      .setCustomId('redirect_adopt_me')
      .setLabel('🐾 Adopt me')
      .setStyle(ButtonStyle.Primary);

    const myTicketsButton = new ButtonBuilder()
      .setCustomId('my_tickets')
      .setLabel('My Tickets')
      .setStyle(ButtonStyle.Success)
      .setEmoji('🎫');

    const row1 = new ActionRowBuilder().addComponents(growGardenButton, stealBrainrotButton, robuxButton);
    const row2 = new ActionRowBuilder().addComponents(accountsButton, mm2Button, adoptMeButton);
    const row3 = new ActionRowBuilder().addComponents(myTicketsButton);

    await message.channel.send({ embeds: [bannerEmbed] });
    await message.channel.send({ embeds: [welcomeEmbed], components: [row1, row2, row3] });
  }

  if (message.content.toLowerCase().startsWith('!addspending')) {
    const member = message.guild.members.cache.get(message.author.id);

    if (!hasAdminPermissions(message.author.id, member)) {
      return message.reply("❌ You don't have permission to use this command!");
    }

    const args = message.content.split(' ');
    if (args.length !== 4) {
      return message.reply("❌ Usage: `!addspending @user USD_amount Robux_amount`\nExample: `!addspending @user 15.00 3600`");
    }

    const userMention = message.mentions.users.first();
    if (!userMention) {
      return message.reply("❌ Please mention a valid user!");
    }

    const usdAmount = parseFloat(args[2]);
    const robuxAmount = parseInt(args[3]);

    if (isNaN(usdAmount) || isNaN(robuxAmount) || usdAmount < 0 || robuxAmount < 0) {
      return message.reply("❌ Please provide valid positive numbers for USD and Robux amounts!");
    }

    let userSpend = userSpending.get(userMention.id) || { totalUSD: 0, totalRobux: 0 };
    userSpend.totalUSD += usdAmount;
    userSpend.totalRobux += robuxAmount;
    userSpending.set(userMention.id, userSpend);

    await updateSpendingLog(userMention.id, userSpend.totalUSD, userSpend.totalRobux);
    saveDatabase();

    const confirmEmbed = new EmbedBuilder()
      .setTitle('✅ Spending Added Successfully!')
      .setDescription(`**${userMention.username}** spending updated:`)
      .addFields(
        { name: '💰 Added This Time', value: `\$${usdAmount.toFixed(2)} USD | ${robuxAmount.toLocaleString()} Robux`, inline: false },
        { name: '📊 Total Spending', value: `\$${userSpend.totalUSD.toFixed(2)} USD | ${userSpend.totalRobux.toLocaleString()} Robux`, inline: false }
      )
      .setColor(BLUE_COLOR)
      .setFooter({ text: `Added by ${message.author.username}` })
      .setTimestamp();

    await message.reply({ embeds: [confirmEmbed] });
  }

  if (message.content.toLowerCase().startsWith('!spending')) {
    const args = message.content.split(' ');
    let targetUser = null;
    let userId = message.author.id;

    if (args.length > 1) {
      const userMention = message.mentions.users.first();
      if (userMention) {
        targetUser = userMention;
        userId = userMention.id;
      } else {
        let username = args.slice(1).join(' ');
        if (username.startsWith('@')) {
          username = username.slice(1);
        }

        const guildMember = message.guild.members.cache.get(member => 
          member.user.username.toLowerCase() === username.toLowerCase() ||
          member.displayName.toLowerCase() === username.toLowerCase()
        );

        if (guildMember) {
          targetUser = guildMember.user;
          userId = guildMember.user.id;
        } else {
          return message.reply("❌ User not found! Please mention them or use their exact username.");
        }
      }
    }

    const userSpend = userSpending.get(userId) || { totalUSD: 0, totalRobux: 0 };
    const displayName = targetUser ? targetUser.username : 'You';
    const possessive = targetUser ? `${targetUser.username}'s` : 'Your';

    const spendingEmbed = new EmbedBuilder()
      .setTitle(`💰 ${possessive} Spending Statistics`)
      .setDescription(`${displayName} ${targetUser ? 'has' : 'have'} spent a total of:`)
      .addFields(
        { name: '💵 USD Total', value: `\$${userSpend.totalUSD.toFixed(2)}`, inline: true },
        { name: '🟡 Robux Total', value: `${userSpend.totalRobux.toLocaleString()}`, inline: true }
      )
      .setColor(BLUE_COLOR)
      .setTimestamp();

    if (targetUser) {
      spendingEmbed.setThumbnail(targetUser.displayAvatarURL());
    }

    await message.reply({ embeds: [spendingEmbed] });
  }

  if (message.content.toLowerCase() === '!spendingleaderboard') {
    const sortedUsers = Array.from(userSpending.entries())
      .map(([userId, data]) => ({ userId, totalUSD: data.totalUSD, totalRobux: data.totalRobux }))
      .filter(user => user.totalUSD > 0 || user.totalRobux > 0)
      .sort((a, b) => b.totalUSD - a.totalUSD)
      .slice(0, 10);

    if (sortedUsers.length === 0) {
      return message.reply("📭 No spending data found!");
    }

    let leaderboardText = '';
    let rank = 1;

    for (const user of sortedUsers) {
      try {
        let displayName = `User ${user.userId}`;

        let guildMember = message.guild.members.cache.get(user.userId);

        if (!guildMember) {
          try {
            guildMember = await message.guild.members.fetch(user.userId);
          } catch (fetchError) {
            console.log(`Could not fetch member ${user.userId}, using ID`);
          }
        }

        if (guildMember) {
          displayName = guildMember.user.username;
        }

        let medal = '';
        if (rank === 1) medal = '🥇';
        else if (rank === 2) medal = '🥈';
        else if (rank === 3) medal = '🥉';
        else medal = `${rank}.`;

        leaderboardText += `${medal} **${displayName}** - \$${user.totalUSD.toFixed(2)} USD | ${user.totalRobux.toLocaleString()} Robux\n`;
        rank++;
      } catch (error) {
        console.error('Error getting user for spending leaderboard:', error);
      }
    }

    const leaderboardEmbed = new EmbedBuilder()
      .setTitle('💰 Spending Leaderboard')
      .setDescription(leaderboardText || 'No users found')
      .setColor(BLUE_COLOR)
      .setFooter({ text: `Total users with spending: ${sortedUsers.length}` })
      .setTimestamp();

    await message.reply({ embeds: [leaderboardEmbed] });
  }

  if (message.content.toLowerCase() === '!replicate') {
    const member = message.guild.members.cache.get(message.author.id);

    if (!hasAdminPermissions(message.author.id, member)) {
      return message.reply('❌ Only authorized staff can use this command!');
    }

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    for (const [categoryKey, threadId] of Object.entries(THREAD_CHANNELS)) {
      try {
        const threadChannel = client.channels.cache.get(threadId);
        if (!threadChannel) {
          results.push(`❌ Thread not found: ${categoryKey}`);
          errorCount++;
          continue;
        }

        const messageContent = THREAD_MESSAGES[categoryKey];
        if (!messageContent) {
          results.push(`❌ No message content for: ${categoryKey}`);
          errorCount++;
          continue;
        }

        // Delete existing messages in thread
        const messages = await threadChannel.messages.fetch({ limit: 100 });
        for (const [messageId, msg] of messages) {
          if (msg.author.id === client.user.id) {
            try {
              await msg.delete();
            } catch (deleteError) {
              console.log(`Could not delete message ${messageId}`);
            }
          }
        }

        // Send new message
        await threadChannel.send(messageContent);

        // Add buy button
        const buyButton = new ButtonBuilder()
          .setCustomId(`buy_${categoryKey}`)
          .setLabel('Buy')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🛒');

        const buyRow = new ActionRowBuilder().addComponents(buyButton);
        await threadChannel.send({ content: 'Click the button below to create a ticket!', components: [buyRow] });

        results.push(`✅ Updated: ${categoryKey}`);
        successCount++;
      } catch (error) {
        console.error(`Error updating thread ${categoryKey}:`, error);
        results.push(`❌ Error updating: ${categoryKey}`);
        errorCount++;
      }
    }

    const resultEmbed = new EmbedBuilder()
      .setTitle('🔄 Thread Replication Results')
      .setDescription(results.slice(0, 10).join('\n'))
      .addFields(
        { name: '✅ Successful Updates', value: `${successCount} threads`, inline: true },
        { name: '❌ Failed Updates', value: `${errorCount} threads`, inline: true }
      )
      .setColor(successCount > 0 ? BLUE_COLOR : 0xFF0000)
      .setTimestamp();

    await message.reply({ embeds: [resultEmbed] });
  }

  // Command to add a product - step-by-step form
  if (message.content.toLowerCase() === '!addproduct') {
      const member = message.guild.members.cache.get(message.author.id);

      if (!hasAdminPermissions(message.author.id, member)) {
          return message.reply('❌ Only authorized staff can use this command!');
      }

      // Check if user already has an active session
      if (productCreationSessions.has(message.author.id)) {
          return message.reply('❌ You already have an active product creation session! Please complete it first or type `cancel` to cancel it.');
      }

      // Start new product creation session
      productCreationSessions.set(message.author.id, {
          step: 'gamepass_link',
          data: {},
          channelId: message.channel.id
      });

      const startEmbed = new EmbedBuilder()
          .setTitle('🛠️ Product Creation Started')
          .setDescription('Please provide the **Gamepass Link** for the new product.')
          .addFields({
              name: 'Example',
              value: 'https://www.roblox.com/game-pass/123456/cool-pet',
              inline: false
          })
          .setColor(BLUE_COLOR)
          .setFooter({ text: 'Type "cancel" at any time to cancel this process' });

      return message.reply({ embeds: [startEmbed] });
  }

  // Command to remove a product - improved with log deletion
  if (message.content.toLowerCase().startsWith('!removeproduct')) {
      const member = message.guild.members.cache.get(message.author.id);

      if (!hasAdminPermissions(message.author.id, member)) {
          return message.reply('❌ Only authorized staff can use this command!');
      }

      const args = message.content.split(' ');
      if (args.length < 2) {
          // Show available products to remove
          const allCustomProducts = [];
          for (const [category, products] of Object.entries(customProducts)) {
              for (const [key, product] of Object.entries(products)) {
                  allCustomProducts.push({
                      category: category,
                      key: key,
                      name: product.name,
                      emoji: product.emoji
                  });
              }
          }

          if (allCustomProducts.length === 0) {
              return message.reply('❌ No custom products found to remove!');
          }

          let productList = '**Available Products to Remove:**\n\n';
          allCustomProducts.forEach((product, index) => {
              productList += `${index + 1}. ${product.emoji} **${product.name}** (${product.category})\n`;
              productList += `   Use: \`!removeproduct ${product.key}\`\n\n`;
          });

          const listEmbed = new EmbedBuilder()
              .setTitle('🗑️ Remove Custom Product')
              .setDescription(productList)
              .setColor(BLUE_COLOR)
              .setFooter({ text: 'Use !removeproduct <product_id> to remove a specific product' });

          return message.reply({ embeds: [listEmbed] });
      }

      const productKey = args[1];
      let foundProduct = null;
      let foundCategory = null;

      // Find the product
      for (const [category, products] of Object.entries(customProducts)) {
          if (products[productKey]) {
              foundProduct = products[productKey];
              foundCategory = category;
              break;
          }
      }

      if (!foundProduct) {
          return message.reply('❌ Product not found! Use `!removeproduct` to see available products.');
      }

      // Remove from storage
      delete customProducts[foundCategory][productKey];

      // Find and delete the log message
      const logChannel = client.channels.cache.get(CUSTOM_PRODUCTS_LOG_CHANNEL_ID);
      let logDeleted = false;

      if (logChannel) {
          try {
              let lastMessageId = null;
              let searchCount = 0;
              const maxSearches = 10;

              while (searchCount < maxSearches && !logDeleted) {
                  const fetchOptions = { limit: 100 };
                  if (lastMessageId) {
                      fetchOptions.before = lastMessageId;
                  }

                  const messages = await logChannel.messages.fetch(fetchOptions);
                  if (messages.size === 0) break;

                  for (const [messageId, msg] of messages) {
                      if (msg.author.id === client.user.id && 
                          msg.embeds.length > 0 && 
                          msg.embeds[0].fields) {

                          const productIdField = msg.embeds[0].fields.find(field => 
                              field.name === 'Product ID' && field.value === productKey
                          );

                          if (productIdField) {
                              await msg.delete();
                              logDeleted = true;
                              console.log(`🗑️ Deleted log message for product ${productKey}`);
                              break;
                          }
                      }
                  }

                  if (!logDeleted) {
                      lastMessageId = messages.last().id;
                      searchCount++;
                  }

                  if (messages.size < 100) break;
              }
          } catch (error) {
              console.error('Error deleting log message:', error);
          }
      }

      // Update thread
      await updateThreadWithCustomProducts(foundCategory);

      const successEmbed = new EmbedBuilder()
          .setTitle('✅ Product Removed Successfully')
          .setDescription(`**${foundProduct.name}** has been removed from **${foundCategory}**.`)
          .addFields(
              { name: '📝 Log Status', value: logDeleted ? '✅ Log message deleted' : '⚠️ Log message not found', inline: true },
              { name: '🧵 Thread Status', value: '✅ Thread updated', inline: true }
          )
          .setColor(BLUE_COLOR)
          .setFooter({ text: `Removed by ${message.author.username}` })
          .setTimestamp();

      await message.reply({ embeds: [successEmbed] });
  }
});

client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'select_accounts_product') {
      const userId = interaction.user.id;
      const selectedProduct = interaction.values[0];
      const product = getAllProductsForCategory('accounts')[selectedProduct];

      if (!product) {
        return interaction.reply({ content: '❌ Product not found!', flags: 64 });
      }

      // Initialize user carts if needed
      if (!userCarts.has(userId)) {
        userCarts.set(userId, { grow_garden: [], steal_brainrot: [], accounts: [] });
      }

      // Add product to user's accounts cart
      const userCartData = userCarts.get(userId);
      userCartData.accounts.push({
        key: selectedProduct,
        name: product.name,
        emoji: product.emoji,
        price_usd: product.price_usd,
        price_robux: product.price_robux,
        gamepass: product.gamepass
      });
      userCarts.set(userId, userCartData);

      // Calculate cart totals for accounts category only
      const accountsCart = userCartData.accounts;
      const totalUSD = accountsCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = accountsCart.reduce((sum, item) => sum + item.price_robux, 0);

      // Create cart display
      let cartDisplay = '';
      accountsCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n   [Gamepass Link](${item.gamepass})\n`;
      });

      const cartEmbed = new EmbedBuilder()
        .setTitle('🛒 Your Accounts Shopping Cart')
        .setDescription(cartDisplay || 'Your cart is empty')
        .addFields(
          { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      // Create action buttons
      const continueShoppingButton = new ButtonBuilder()
        .setCustomId('continue_shopping_accounts')
        .setLabel('Continue Shopping')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛍️');

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_accounts_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫');

      const clearCartButton = new ButtonBuilder()
        .setCustomId('clear_cart_accounts')
        .setLabel('Clear Cart')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️');

      const actionRow = new ActionRowBuilder().addComponents(continueShoppingButton, createTicketButton, clearCartButton);

      await interaction.update({ 
        embeds: [cartEmbed], 
        components: [actionRow]
      });
    } else if (interaction.customId === 'select_steal_brainrot_product') {
      const userId = interaction.user.id;
      const selectedProduct = interaction.values[0];
      const product = getAllProductsForCategory('steal_brainrot')[selectedProduct];

      if (!product) {
        return interaction.reply({ content: '❌ Product not found!', flags: 64 });
      }

      // Initialize user carts if needed
      if (!userCarts.has(userId)) {
        userCarts.set(userId, { grow_garden: [], steal_brainrot: [], accounts: [] });
      }

      // Add product to user's steal_brainrot cart
      const userCartData = userCarts.get(userId);
      userCartData.steal_brainrot.push({
        key: selectedProduct,
        name: product.name,
        emoji: product.emoji,
        price_usd: product.price_usd,
        price_robux: product.price_robux,
        gamepass: product.gamepass
      });
      userCarts.set(userId, userCartData);

      // Calculate cart totals for steal_brainrot category only
      const stealBrainrotCart = userCartData.steal_brainrot;
      const totalUSD = stealBrainrotCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = stealBrainrotCart.reduce((sum, item) => sum + item.price_robux, 0);

      // Create cart display
      let cartDisplay = '';
      stealBrainrotCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n   [Gamepass Link](${item.gamepass})\n`;
      });

      const cartEmbed = new EmbedBuilder()
        .setTitle('🛒 Your Steal a Brainrot Shopping Cart')
        .setDescription(cartDisplay || 'Your cart is empty')
        .addFields(
          { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      // Create action buttons
      const continueShoppingButton = new ButtonBuilder()
        .setCustomId('continue_shopping_steal_brainrot')
        .setLabel('Continue Shopping')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛍️');

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_steal_brainrot_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫');

      const clearCartButton = new ButtonBuilder()
        .setCustomId('clear_cart_steal_brainrot')
        .setLabel('Clear Cart')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️');

      const actionRow = new ActionRowBuilder().addComponents(continueShoppingButton, createTicketButton, clearCartButton);

      await interaction.update({ 
        embeds: [cartEmbed], 
        components: [actionRow]
      });
    } else if (interaction.customId === 'select_grow_garden_product') {
      const userId = interaction.user.id;
      const selectedProduct = interaction.values[0];
      const product = getAllProductsForCategory('grow_garden')[selectedProduct];

      if (!product) {
        return interaction.reply({ content: '❌ Product not found!', flags: 64 });
      }

      // Initialize user carts if needed
      if (!userCarts.has(userId)) {
        userCarts.set(userId, { grow_garden: [], steal_brainrot: [], accounts: [] });
      }

      // Add product to user's grow_garden cart
      const userCartData = userCarts.get(userId);
      userCartData.grow_garden.push({
        key: selectedProduct,
        name: product.name,
        emoji: product.emoji,
        price_usd: product.price_usd,
        price_robux: product.price_robux,
        gamepass: product.gamepass
      });
      userCarts.set(userId, userCartData);

      // Calculate cart totals for grow_garden category only
      const growGardenCart = userCartData.grow_garden;
      const totalUSD = growGardenCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = growGardenCart.reduce((sum, item) => sum + item.price_robux, 0);

      // Create cart display
      let cartDisplay = '';
      growGardenCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n   [Gamepass Link](${item.gamepass})\n`;
      });

      const cartEmbed = new EmbedBuilder()
        .setTitle('🛒 Your Grow a Garden Shopping Cart')
        .setDescription(cartDisplay || 'Your cart is empty')
        .addFields(
          { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      // Create action buttons
      const continueShoppingButton = new ButtonBuilder()
        .setCustomId('continue_shopping_grow_garden')
        .setLabel('Continue Shopping')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛍️');

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_grow_garden_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫');

      const clearCartButton = new ButtonBuilder()
        .setCustomId('clear_cart_grow_garden')
        .setLabel('Clear Cart')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️');

      const actionRow = new ActionRowBuilder().addComponents(continueShoppingButton, createTicketButton, clearCartButton);

      await interaction.update({ 
        embeds: [cartEmbed], 
        components: [actionRow]
      });
    }

    return;
  }
  if (interaction.isButton()) {
    if (interaction.customId.startsWith('redirect_')) {
      const category = interaction.customId.replace('redirect_', '');
      const categoryInfo = BAZAAR_CATEGORIES[category];

      if (categoryInfo && categoryInfo.thread_id) {
        await interaction.reply({ 
          content: `🔗 Check out our ${categoryInfo.name} products here: <#${categoryInfo.thread_id}>`, 
          flags: 64 
        });
      } else {
        await interaction.reply({ content: '❌ Category not found!', flags: 64 });
      }
    } else if (interaction.customId.startsWith('buy_')) {const category = interaction.customId.replace('buy_', '');
      const categoryInfo = BAZAAR_CATEGORIES[category];

      if (!categoryInfo) {
        return interaction.reply({ content: '❌ Category not found!', flags: 64 });
      }

      // Special handling for Grow a Garden - show product selection
      if (category === 'grow_garden') {
        const userId = interaction.user.id;

        // Initialize category-specific cart for user
        if (!userCarts.has(userId)) {
          userCarts.set(userId, { grow_garden: [], steal_brainrot: [], accounts: [] });
        }

        const productEmbed = new EmbedBuilder()
          .setTitle('🌱 Grow a Garden - Product Selection')
          .setDescription('Choose the pets you want to purchase. You can select multiple items before creating your ticket!')
          .setColor(BLUE_COLOR);

        // Create select menu with all products
        const productSelect = new StringSelectMenuBuilder()
          .setCustomId('select_grow_garden_product')
          .setPlaceholder('Choose a pet...')
          .setMinValues(1)
          .setMaxValues(1);

        // Add products to select menu
        const allProducts = getAllProductsForCategory('grow_garden');
        Object.entries(allProducts).forEach(([key, product]) => {
          productSelect.addOptions({
            label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
            description: `Gamepass: ${product.gamepass}`,
            value: key,
            emoji: product.emoji
          });
        });

        const selectRow = new ActionRowBuilder().addComponents(productSelect);

        await interaction.reply({ 
          embeds: [productEmbed], 
          components: [selectRow], 
          flags: 64 
        });
        return;
      }

      // Special handling for Accounts - show product selection
      if (category === 'accounts') {
        const userId = interaction.user.id;

        // Initialize category-specific cart for user
        if (!userCarts.has(userId)) {
          userCarts.set(userId, { grow_garden: [], steal_brainrot: [], accounts: [] });
        }

        const productEmbed = new EmbedBuilder()
          .setTitle('👤 Accounts - Product Selection')
          .setDescription('Choose the accounts you want to purchase. You can select multiple items before creating your ticket!')
          .setColor(BLUE_COLOR);

        // Create select menu with all products
        const productSelect = new StringSelectMenuBuilder()
          .setCustomId('select_accounts_product')
          .setPlaceholder('Choose an account...')
          .setMinValues(1)
          .setMaxValues(1);

        // Add products to select menu
        const allProducts = getAllProductsForCategory('accounts');
        Object.entries(allProducts).forEach(([key, product]) => {
          productSelect.addOptions({
            label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
            description: `Gamepass: ${product.gamepass}`,
            value: key,
            emoji: product.emoji
          });
        });

        const selectRow = new ActionRowBuilder().addComponents(productSelect);

        await interaction.reply({ 
          embeds: [productEmbed], 
          components: [selectRow], 
          flags: 64 
        });
        return;
      }

      // Special handling for Steal a Brainrot - show product selection
      if (category === 'steal_brainrot') {
        const userId = interaction.user.id;

        // Initialize category-specific cart for user
        if (!userCarts.has(userId)) {
          userCarts.set(userId, { grow_garden: [], steal_brainrot: [], accounts: [] });
        }

        const productEmbed = new EmbedBuilder()
          .setTitle('🧠 Steal a Brainrot - Product Selection')
          .setDescription('Choose the secrets and brainrot gods you want to purchase. You can select multiple items before creating your ticket!')
          .setColor(BLUE_COLOR);

        // Create select menu with all products
        const productSelect = new StringSelectMenuBuilder()
          .setCustomId('select_steal_brainrot_product')
          .setPlaceholder('Choose a secret or brainrot god...')
          .setMinValues(1)
          .setMaxValues(1);

        // Add products to select menu
        const allProducts = getAllProductsForCategory('steal_brainrot');
        Object.entries(allProducts).forEach(([key, product]) => {
          productSelect.addOptions({
            label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
            description: `Gamepass: ${product.gamepass}`,
            value: key,
            emoji: product.emoji
          });
        });

        const selectRow = new ActionRowBuilder().addComponents(productSelect);

        await interaction.reply({ 
          embeds: [productEmbed], 
          components: [selectRow], 
          flags: 64 
        });
        return;
      }

      // Regular ticket creation for other categories
      // Check if user already has 3 tickets
      const userId = interaction.user.id;
      const activeTicketCount = countUserTickets(userId);

      if (activeTicketCount >= 3) {
        return interaction.reply({ 
          content: '❌ You already have the maximum number of tickets (3).', 
          flags: 64 
        });
      }

      const guild = interaction.guild;
      let mainChannel = guild.channels.cache.get(TICKET_CREATION_CHANNEL_ID);

      // Fallback to finding channel by name if ID doesn't work
      if (!mainChannel) {
        mainChannel = guild.channels.cache.find(channel => 
          channel.name === '〘🛒〙𝗦𝗛𝗢𝗣' || channel.name.includes('SHOP')
        );
      }

      if (!mainChannel) {
        return interaction.reply({ content: '❌ Ticket channel not found!', flags: 64 });
      }

      const thread = await mainChannel.threads.create({
        name: `${category}-${interaction.user.username}`,
        autoArchiveDuration: 60,
        type: ChannelType.GuildPrivateThread,
        reason: `New ${categoryInfo.name} ticket`
      });

      userTickets.set(userId, thread.id);

      let ticketDescription = `Welcome to your **${categoryInfo.name}** ticket!\n\n`;

      switch(category) {
        case 'robux':
          ticketDescription += 'Please discuss the amount of Robux you want to buy with our staff.';
          break;
        case 'accounts':
          ticketDescription += 'Please let us know which type of account you\'re interested in (Korblox, Headless, or both).';
          break;
        case 'mm2':
          ticketDescription += 'Please specify which MM2 items you want to purchase and we\'ll provide a 15% discount off Starpets prices.';
          break;
        case 'adopt_me':
          ticketDescription += 'Please specify which Adopt Me pets/items you want to purchase and we\'ll provide a 15% discount off Starpets prices.';
          break;
        default:
          ticketDescription += 'Please discuss your needs with our staff.';
      }

      const ticketEmbed = new EmbedBuilder()
        .setTitle(`🎫 ${categoryInfo.name} Ticket`)
        .setDescription(ticketDescription)
        .setColor(BLUE_COLOR);

      const paymentEmbed = new EmbedBuilder()
        .setTitle('💳 Payment Methods')
        .setDescription(
          `⚠️ Never make payment unless staff is present.\n\n` +
          `- **CashApp:** ${CASHAPP_TAG}\n` +
          `- **PayPal:** ${PAYPAL_EMAIL}\n` +
          `- **Litecoin:** \`${LTC_ADDRESS}\`\n` +
          `- **Robux:** Available for most items`
        )
        .setColor(GRAY_COLOR);

      const utilityRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('grant_buyer_role')
          .setLabel('Complete Purchase')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );

      const paymentRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('copy_ltc')
          .setLabel('Copy LTC')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📋'),
        new ButtonBuilder()
          .setCustomId('copy_cashapp')
          .setLabel('Copy CashApp')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💵'),
        new ButtonBuilder()
          .setCustomId('copy_paypal')
          .setLabel('Copy PayPal')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💸')
      );

      await thread.send({ 
        content: `<@${userId}> <@&${MODERATOR_ROLE_ID}>`, 
        embeds: [ticketEmbed, paymentEmbed], 
        components: [utilityRow, paymentRow] 
      });

      await interaction.reply({ content: `✅ ${categoryInfo.name} ticket created! <#${thread.id}>`, flags: 64 });
      saveDatabase();
    } else if (interaction.customId === 'my_tickets') {
      const userId = interaction.user.id;
      const member = interaction.guild.members.cache.get(userId);

      if (hasAdminPermissions(userId, member)) {
        // Staff member - ping in all tickets
        let activeTickets = [];
        let staleTickets = [];

        for (const [ticketUserId, ticketId] of userTickets.entries()) {
          try {
            const channel = interaction.guild.channels.cache.get(ticketId);

            if (channel && channel.isThread()) {
              if (channel.archived || channel.locked) {
                staleTickets.push(ticketUserId);
              } else {
                activeTickets.push({ userId: ticketUserId, ticketId, channel });
              }
            } else {
              staleTickets.push(ticketUserId);
            }
          } catch (error) {
            console.error(`Error checking ticket ${ticketId}:`, error);
            staleTickets.push(ticketUserId);
          }
        }

        for (const ticketUserId of staleTickets) {
          userTickets.delete(ticketUserId);
        }

        const ticketChannelId = TICKET_CREATION_CHANNEL_ID;
        const mainChannel = interaction.guild.channels.cache.get(ticketChannelId);

        if (mainChannel) {
          const allThreads = mainChannel.threads.cache;

          for (const [threadId, thread] of allThreads) {
            if (!thread.archived && !thread.locked) {
              const isAlreadyTracked = Array.from(userTickets.values()).includes(threadId);
              if (!isAlreadyTracked && (thread.name.includes('ticket-') || thread.name.includes('claim-') || thread.name.includes('reward-'))) {
                activeTickets.push({ userId: 'unknown', ticketId: threadId, channel: thread });
              }
            }
          }
        }

        if (activeTickets.length === 0) {
          return interaction.reply({ content: "📭 No active tickets found! All tickets appear to be archived or closed.", flags: 64 });
        }

        let successCount = 0;
        let errorCount = 0;

        for (const ticket of activeTickets) {
          try {
            const staffPingMessage = await ticket.channel.send(`🚨 <@${userId}> Staff member ${interaction.user.username} is checking this ticket!`);

            setTimeout(async () => {
              try {
                await staffPingMessage.delete();
              } catch (error) {
                console.log('Staff ping message may have already been deleted');
              }
            }, 5000);

            successCount++;
          } catch (error) {
            console.error(`❌ Error pinging staff in ticket ${ticket.ticketId}:`, error);
            errorCount++;
          }
        }

        const resultEmbed = new EmbedBuilder()
          .setTitle('📢 Staff Ticket Ping Results')
          .setDescription(`Pinged yourself in all active tickets.`)
          .addFields(
            { name: '✅ Successful Pings', value: `${successCount} tickets`, inline: true },
            { name: '❌ Failed Pings', value: `${errorCount} tickets`, inline: true },
            { name: '📊 Total Active Tickets', value: `${activeTickets.length} tickets`, inline: true }
          )
          .setColor(successCount > 0 ? BLUE_COLOR : 0xFF0000)
          .setFooter({ text: `Requested by ${interaction.user.username}` })
          .setTimestamp();

        const responseMessage = await interaction.reply({ embeds: [resultEmbed], flags: 64 });

        setTimeout(async () => {
          try {
            await responseMessage.delete();
          } catch (error) {
            console.log('Response message may have already been deleted');
          }
        }, 5000);

        if (staleTickets.length > 0) {
          saveDatabase();
        }
      } else {
        // Regular user - ping in their ticket
        const userTicketId = userTickets.get(userId);

        if (!userTicketId) {
          return interaction.reply({ content: "📭 You don't have any active tickets!", flags: 64 });
        }

        const ticketChannel = interaction.guild.channels.cache.get(userTicketId);

        if (!ticketChannel || !ticketChannel.isThread() || ticketChannel.archived) {
          userTickets.delete(userId);
          saveDatabase();
          return interaction.reply({ content: "📭 Your ticket appears to be closed or no longer exists!", flags: 64 });
        }

        try {
          const pingMessage = await ticketChannel.send(`📨 <@${userId}> You pinged yourself in this ticket!`);

          setTimeout(async () => {
            try {
              await pingMessage.delete();
            } catch (error) {
              console.log('Ping message may have already been deleted');
            }
          }, 5000);

          const successEmbed = new EmbedBuilder()
            .setTitle('✅ Ticket Ping Successful!')
            .setDescription(`You have been pinged in your active ticket: <#${userTicketId}>`)
            .setColor(BLUE_COLOR)
            .setFooter({ text: `Requested by ${interaction.user.username}` })
            .setTimestamp();

          const responseMessage = await interaction.reply({ embeds: [successEmbed], flags: 64 });

          setTimeout(async () => {
            try {
              await responseMessage.delete();
            } catch (error) {
              console.log('Response message may have already been deleted');
            }
          }, 5000);

        } catch (error) {
          console.error(`Error pinging user in their ticket ${userTicketId}:`, error);
          return interaction.reply({ content: "❌ Failed to ping you in your ticket. The ticket may be inaccessible.", flags: 64 });
        }
      }
    } else if (interaction.customId === 'close_ticket') {
      const member = interaction.guild.members.cache.get(interaction.user.id);

      if (!hasAdminPermissions(interaction.user.id, member)) {
        return interaction.reply({ 
          content: '❌ Only staff members can close tickets!', 
          flags: 64 
        });
      }

      const channel = interaction.channel;

      // Remove ticket from tracking
      for (const [userId, ticketId] of userTickets.entries()) {
        if (ticketId === channel.id) {
          userTickets.delete(userId);
          saveDatabase();
          break;
        }
      }

      await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...', flags: 64 });
      setTimeout(async () => {
        try {
          await channel.delete();
        } catch (error) {
          console.log('Ticket may have already been deleted');
        }
      }, 5000);
    } else if (interaction.customId === 'grant_buyer_role') {
      const staffMember = interaction.guild.members.cache.get(interaction.user.id);

      if (!hasAdminPermissions(interaction.user.id, staffMember)) {
        await interaction.reply({ 
          content: '❌ You do not have permission to grant buyer roles! Only staff can do this.', 
          flags: 64 
        });
        return;
      }

      // Find ticket creator
      let targetUserId = null;

      for (const [userId, ticketId] of userTickets.entries()) {
        if (ticketId === interaction.channel.id) {
          targetUserId = userId;
          break;
        }
      }

      if (!targetUserId && interaction.channel.isThread()) {
        try {
          const thread = interaction.channel;
          if (thread.ownerId && thread.ownerId !== client.user.id) {
            const owner = interaction.guild.members.cache.get(thread.ownerId);
            if (owner && !hasAdminPermissions(thread.ownerId, owner)) {
              targetUserId = thread.ownerId;
            }
          }
        } catch (error) {
          console.error('Error getting thread owner:', error);
        }
      }

      if (!targetUserId) {
        await interaction.reply({ content: '❌ Could not identify ticket creator!', flags: 64 });
        return;
      }

      let targetMember;
      try {
        targetMember = interaction.guild.members.cache.get(targetUserId);
        if (!targetMember) {
          targetMember = await interaction.guild.members.fetch(targetUserId);
        }
      } catch (error) {
        console.error('Error fetching member:', error);
        await interaction.reply({ content: '❌ Ticket creator not found! They may have left the server.', flags: 64 });
        return;
      }

      const buyerRole = interaction.guild.roles.cache.get(BUYER_ROLE_ID);

      try {
        const hasRole = targetMember.roles.cache.has(BUYER_ROLE_ID);

        if (!hasRole) {
          await targetMember.roles.add(buyerRole);
        }

        const successEmbed = new EmbedBuilder()
          .setTitle('✅ Purchase Successful!')
          .setDescription(`**${targetMember.user.username}** has been granted the buyer role and their purchase has been recorded.`)
          .addFields(
            { name: '👤 Customer', value: targetMember.user.username, inline: true },
            { name: '🛠️ Staff Member', value: interaction.user.username, inline: true },
            { name: '📅 Date', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
          )
          .setColor(BLUE_COLOR)
          .setTimestamp();

        await interaction.channel.send({ embeds: [successEmbed] });

        // Send vouch reminder
        const vouchEmbed = new EmbedBuilder()
          .setTitle('💬 Don\'t forget to vouch!')
          .setDescription(`Please leave a vouch in <#${VOUCH_CHANNEL_ID}> about your purchase experience!`)
          .setColor(GRAY_COLOR)
          .setTimestamp();

        await interaction.channel.send({ content: `<@${targetMember.user.id}>`, embeds: [vouchEmbed] });

        await interaction.reply({ content: `✅ Buyer role granted to ${targetMember.user.username} successfully! Closing ticket in 5 seconds...`, flags: 64 });

        saveDatabase();

        setTimeout(async () => {
          try {
            await interaction.channel.delete();
          } catch (error) {
            console.log('Ticket may have already been deleted');
          }
        }, 5000);

      } catch (error) {
        console.error('Error granting buyer role:', error);
        if (!interaction.replied) {
          await interaction.reply({ content: '❌ Failed to grant buyer role. Please contact staff.', flags: 64 });
        }
      }
    } else if (interaction.customId === 'copy_ltc') {
      await interaction.reply({ 
        content: `📋 **LTC Address:** \`${LTC_ADDRESS}\`\n\nClick to select and copy the address above.`, 
        flags: 64 
      });
    } else if (interaction.customId === 'copy_cashapp') {
      await interaction.reply({ 
        content: `📋 **CashApp:** \`${CASHAPP_TAG}\`\n\nClick to select and copy.`, 
        flags: 64 
      });
    } else if (interaction.customId === 'copy_paypal') {
      await interaction.reply({ 
        content: `📋 **PayPal:** \`${PAYPAL_EMAIL}\`\n\nClick to select and copy the email above.`, 
        flags: 64 
      });
    } else if (interaction.customId.startsWith('copy_product_id_')) {
      const productId = interaction.customId.replace('copy_product_id_', '');
      await interaction.reply({ 
        content: `📋 **Product ID:** \`${productId}\`\n\nUse this with: \`!removeproduct ${productId}\``, 
        flags: 64 
      });
    } else if (interaction.customId === 'continue_shopping_grow_garden') {
      const productEmbed = new EmbedBuilder()
        .setTitle('🌱 Grow a Garden - Product Selection')
        .setDescription('Choose more pets to add to your cart!')
        .setColor(BLUE_COLOR);

      const productSelect = new StringSelectMenuBuilder()
        .setCustomId('select_grow_garden_product')
        .setPlaceholder('Choose a pet...')
        .setMinValues(1)
        .setMaxValues(1);

      const allProducts = getAllProductsForCategory('grow_garden');
      Object.entries(allProducts).forEach(([key, product]) => {
        productSelect.addOptions({
          label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
          description: `Gamepass: ${product.gamepass}`,
          value: key,
          emoji: product.emoji
        });
      });

      const selectRow = new ActionRowBuilder().addComponents(productSelect);

      await interaction.update({ 
        embeds: [productEmbed], 
        components: [selectRow] 
      });
    } else if (interaction.customId === 'create_grow_garden_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.grow_garden : [];

      if (userCart.length === 0) {
        return interaction.reply({ content: '❌ Your cart is empty! Please select some products first.', flags: 64 });
      }

      // Check if user already has 3 tickets
      const activeTicketCount = countUserTickets(userId);

      if (activeTicketCount >= 3) {
        return interaction.reply({ 
          content: '❌ You already have the maximum number of tickets (3).', 
          flags: 64 
        });
      }

      // Show confirmation dialog
      const confirmEmbed = new EmbedBuilder()
        .setTitle('🎫 Create Ticket?')
        .setDescription('Are you sure you want to create a ticket with these items?')
        .setColor(BLUE_COLOR);

      let cartDisplay = '';
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n`;
      });

      confirmEmbed.addFields(
        { name: '🛒 Items in Cart', value: cartDisplay, inline: false },
        { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
      );

      const confirmButton = new ButtonBuilder()
        .setCustomId('confirm_create_grow_garden_ticket')
        .setLabel('Yes, Create Ticket')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✅');

      const cancelButton = new ButtonBuilder()
        .setCustomId('cancel_create_ticket')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌');

      const confirmRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

      await interaction.update({ 
        embeds: [confirmEmbed], 
        components: [confirmRow] 
      });
    } else if (interaction.customId === 'confirm_create_grow_garden_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.grow_garden : [];

      if (userCart.length === 0) {
        return interaction.reply({ content: '❌ Your cart is empty!', flags: 64 });
      }

      const guild = interaction.guild;
      let mainChannel = guild.channels.cache.get(TICKET_CREATION_CHANNEL_ID);

      // Fallback to finding channel by name if ID doesn't work
      if (!mainChannel) {
        mainChannel = guild.channels.cache.find(channel => 
          channel.name === '〘🛒〙𝗦𝗛𝗢𝗣' || channel.name.includes('SHOP')
        );
      }

      if (!mainChannel) {
        return interaction.reply({ content: '❌ Ticket channel not found!', flags: 64 });
      }

      const thread = await mainChannel.threads.create({
        name: `grow_garden-${interaction.user.username}`,
        autoArchiveDuration: 60,
        type: ChannelType.GuildPrivateThread,
        reason: 'New Grow a Garden ticket'
      });

      userTickets.set(userId, thread.id);

      // Create ticket content with cart items
      let cartDisplay = '';
      let gamepasses = '';
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n`;
        gamepasses += `${index + 1}. **${item.name}**: ${item.gamepass}\n`;
      });

      const ticketEmbed = new EmbedBuilder()
        .setTitle('🎫 Grow a Garden Ticket')
        .setDescription('Welcome to your **Grow a Garden** ticket!')
        .addFields(
          { name: '🛒 Selected Items', value: cartDisplay, inline: false },
          { name: '💰 Total Price', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      const paymentEmbed = new EmbedBuilder()
        .setTitle('💳 Payment Methods')
        .setDescription(
          `⚠️ Never make payment unless staff is present.\n\n` +
          `- **CashApp:** ${CASHAPP_TAG}\n` +
          `- **PayPal:** ${PAYPAL_EMAIL}\n` +
          `- **Litecoin:** \`${LTC_ADDRESS}\`\n` +
          `- **Robux:** ${gamepasses}`
        )
        .setColor(GRAY_COLOR);

      const utilityRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('grant_buyer_role')
          .setLabel('Complete Purchase')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );

      const paymentRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('copy_ltc')
          .setLabel('Copy LTC')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📋'),
        new ButtonBuilder()
          .setCustomId('copy_cashapp')
          .setLabel('Copy CashApp')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💵'),
        new ButtonBuilder()
          .setCustomId('copy_paypal')
          .setLabel('Copy PayPal')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💸')
      );

      await thread.send({ 
        content: `<@${userId}> <@&${MODERATOR_ROLE_ID}>`, 
        embeds: [ticketEmbed, paymentEmbed], 
        components: [utilityRow, paymentRow] 
      });

      // Clear only the grow_garden cart after ticket creation
      if (userCartData) {
        userCartData.grow_garden = [];
        userCarts.set(userId, userCartData);
      }

      await interaction.update({ 
        content: `✅ Grow a Garden ticket created! <#${thread.id}>`, 
        embeds: [], 
        components: [] 
      });

      saveDatabase();
    } else if (interaction.customId === 'cancel_create_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.grow_garden : [];

      // Show cart again
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      let cartDisplay = '';
      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n   [Gamepass Link](${item.gamepass})\n`;
      });

      const cartEmbed = new EmbedBuilder()
        .setTitle('🛒 Your Shopping Cart')
        .setDescription(cartDisplay || 'Your cart is empty')
        .addFields(
          { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      const continueShoppingButton = new ButtonBuilder()
        .setCustomId('continue_shopping_grow_garden')
        .setLabel('Continue Shopping')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛍️');

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_grow_garden_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫');

      const clearCartButton = new ButtonBuilder()
        .setCustomId('clear_cart_grow_garden')
        .setLabel('Clear Cart')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️');

      const actionRow = new ActionRowBuilder().addComponents(continueShoppingButton, createTicketButton, clearCartButton);

      await interaction.update({ 
        embeds: [cartEmbed], 
        components: [actionRow] 
      });
    } else if (interaction.customId === 'clear_cart_grow_garden') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      if (userCartData) {
        userCartData.grow_garden = [];
        userCarts.set(userId, userCartData);
      }

      const productEmbed = new EmbedBuilder()
        .setTitle('🌱 Grow a Garden - Product Selection')
        .setDescription('Your cart has been cleared. Choose the pets you want to purchase!')
        .setColor(BLUE_COLOR);

      const productSelect = new StringSelectMenuBuilder()
        .setCustomId('select_grow_garden_product')
        .setPlaceholder('Choose a pet...')
        .setMinValues(1)
        .setMaxValues(1);

      const allProducts = getAllProductsForCategory('grow_garden');
      Object.entries(allProducts).forEach(([key, product]) => {
        productSelect.addOptions({
          label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
          description: `Gamepass: ${product.gamepass}`,
          value: key,
          emoji: product.emoji
        });
      });

      const selectRow = new ActionRowBuilder().addComponents(productSelect);

      await interaction.update({ 
        embeds: [productEmbed], 
        components: [selectRow] 
      });
    } else if (interaction.customId === 'continue_shopping_steal_brainrot') {
      const productEmbed = new EmbedBuilder()
        .setTitle('🧠 Steal a Brainrot - Product Selection')
        .setDescription('Choose more secrets and brainrot gods to add to your cart!')
        .setColor(BLUE_COLOR);

      const productSelect = new StringSelectMenuBuilder()
        .setCustomId('select_steal_brainrot_product')
        .setPlaceholder('Choose a secret or brainrot god...')
        .setMinValues(1)
        .setMaxValues(1);

      const allProducts = getAllProductsForCategory('steal_brainrot');
      Object.entries(allProducts).forEach(([key, product]) => {
        productSelect.addOptions({
          label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
          description: `Gamepass: ${product.gamepass}`,
          value: key,
          emoji: product.emoji
        });
      });

      const selectRow = new ActionRowBuilder().addComponents(productSelect);

      await interaction.update({ 
        embeds: [productEmbed], 
        components: [selectRow] 
      });
    } else if (interaction.customId === 'create_steal_brainrot_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.steal_brainrot : [];

      if (userCart.length === 0) {
        return interaction.reply({ content: '❌ Your cart is empty! Please select some products first.', flags: 64 });
      }

      // Check if user already has 3 tickets
      const activeTicketCount = countUserTickets(userId);

      if (activeTicketCount >= 3) {
        return interaction.reply({ 
          content: '❌ You already have the maximum number of tickets (3).', 
          flags: 64 
        });
      }

      // Show confirmation dialog
      const confirmEmbed = new EmbedBuilder()
        .setTitle('🎫 Create Ticket?')
        .setDescription('Are you sure you want to create a ticket with these items?')
        .setColor(BLUE_COLOR);

      let cartDisplay = '';
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n`;
      });

      confirmEmbed.addFields(
        { name: '🛒 Items in Cart', value: cartDisplay, inline: false },
        { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
      );

      const confirmButton = new ButtonBuilder()
        .setCustomId('confirm_create_steal_brainrot_ticket')
        .setLabel('Yes, Create Ticket')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✅');

      const cancelButton = new ButtonBuilder()
        .setCustomId('cancel_create_steal_brainrot_ticket')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌');

      const confirmRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

      await interaction.update({ 
        embeds: [confirmEmbed], 
        components: [confirmRow] 
      });
    } else if (interaction.customId === 'confirm_create_steal_brainrot_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.steal_brainrot : [];

      if (userCart.length === 0) {
        return interaction.reply({ content: '❌ Your cart is empty!', flags: 64 });
      }

      const guild = interaction.guild;
      let mainChannel = guild.channels.cache.get(TICKET_CREATION_CHANNEL_ID);

      // Fallback to finding channel by name if ID doesn't work
      if (!mainChannel) {
        mainChannel = guild.channels.cache.find(channel => 
          channel.name === '〘🛒〙𝗦𝗛𝗢𝗣' || channel.name.includes('SHOP')
        );
      }

      if (!mainChannel) {
        return interaction.reply({ content: '❌ Ticket channel not found!', flags: 64 });
      }

      const thread = await mainChannel.threads.create({
        name: `steal_brainrot-${interaction.user.username}`,
        autoArchiveDuration: 60,
        type: ChannelType.GuildPrivateThread,
        reason: 'New Steal a Brainrot ticket'
      });

      userTickets.set(userId, thread.id);

      // Create ticket content with cart items
      let cartDisplay = '';
      let gamepasses = '';
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n`;
        gamepasses += `${index + 1}. **${item.name}**: ${item.gamepass}\n`;
      });

      const ticketEmbed = new EmbedBuilder()
        .setTitle('🎫 Steal a Brainrot Ticket')
        .setDescription('Welcome to your **Steal a Brainrot** ticket!')
        .addFields(
          { name: '🛒 Selected Items', value: cartDisplay, inline: false },
          { name: '💰 Total Price', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      const paymentEmbed = new EmbedBuilder()
        .setTitle('💳 Payment Methods')
        .setDescription(
          `⚠️ Never make payment unless staff is present.\n\n` +
          `- **CashApp:** ${CASHAPP_TAG}\n` +
          `- **PayPal:** ${PAYPAL_EMAIL}\n` +
          `- **Litecoin:** \`${LTC_ADDRESS}\`\n` +
          `- **Robux:** ${gamepasses}`
        )
        .setColor(GRAY_COLOR);

      const utilityRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('grant_buyer_role')
          .setLabel('Complete Purchase')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );

      const paymentRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('copy_ltc')
          .setLabel('Copy LTC')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📋'),
        new ButtonBuilder()
          .setCustomId('copy_cashapp')
          .setLabel('Copy CashApp')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💵'),
        new ButtonBuilder()
          .setCustomId('copy_paypal')
          .setLabel('Copy PayPal')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💸')
      );

      await thread.send({ 
        content: `<@${userId}> <@&${MODERATOR_ROLE_ID}>`, 
        embeds: [ticketEmbed, paymentEmbed], 
        components: [utilityRow, paymentRow] 
      });

      // Clear only the steal_brainrot cart after ticket creation
      if (userCartData) {
        userCartData.steal_brainrot = [];
        userCarts.set(userId, userCartData);
      }

      await interaction.update({ 
        content: `✅ Steal a Brainrot ticket created! <#${thread.id}>`, 
        embeds: [], 
        components: [] 
      });

      saveDatabase();
    } else if (interaction.customId === 'cancel_create_steal_brainrot_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.steal_brainrot : [];

      // Show cart again
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      let cartDisplay = '';
      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n   [Gamepass Link](${item.gamepass})\n`;
      });

      const cartEmbed = new EmbedBuilder()
        .setTitle('🛒 Your Shopping Cart')
        .setDescription(cartDisplay || 'Your cart is empty')
        .addFields(
          { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      const continueShoppingButton = new ButtonBuilder()
        .setCustomId('continue_shopping_steal_brainrot')
        .setLabel('Continue Shopping')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛍️');

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_steal_brainrot_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫');

      const clearCartButton = new ButtonBuilder()
        .setCustomId('clear_cart_steal_brainrot')
        .setLabel('Clear Cart')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️');

      const actionRow = new ActionRowBuilder().addComponents(continueShoppingButton, createTicketButton, clearCartButton);

      await interaction.update({ 
        embeds: [cartEmbed], 
        components: [actionRow] 
      });
    } else if (interaction.customId === 'continue_shopping_accounts') {
      const productEmbed = new EmbedBuilder()
        .setTitle('👤 Accounts - Product Selection')
        .setDescription('Choose more accounts to add to your cart!')
        .setColor(BLUE_COLOR);

      const productSelect = new StringSelectMenuBuilder()
        .setCustomId('select_accounts_product')
        .setPlaceholder('Choose an account...')
        .setMinValues(1)
        .setMaxValues(1);

      const allProducts = getAllProductsForCategory('accounts');
      Object.entries(allProducts).forEach(([key, product]) => {
        productSelect.addOptions({
          label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
          description: `Gamepass: ${product.gamepass}`,
          value: key,
          emoji: product.emoji
        });
      });

      const selectRow = new ActionRowBuilder().addComponents(productSelect);

      await interaction.update({ 
        embeds: [productEmbed], 
        components: [selectRow] 
      });
    } else if (interaction.customId === 'create_accounts_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.accounts : [];

      if (userCart.length === 0) {
        return interaction.reply({ content: '❌ Your cart is empty! Please select some products first.', flags: 64 });
      }

      // Check if user already has 3 tickets
      const activeTicketCount = countUserTickets(userId);

      if (activeTicketCount >= 3) {
        return interaction.reply({ 
          content: '❌ You already have the maximum number of tickets (3).', 
          flags: 64 
        });
      }

      // Show confirmation dialog
      const confirmEmbed = new EmbedBuilder()
        .setTitle('🎫 Create Ticket?')
        .setDescription('Are you sure you want to create a ticket with these items?')
        .setColor(BLUE_COLOR);

      let cartDisplay = '';
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n`;
      });

      confirmEmbed.addFields(
        { name: '🛒 Items in Cart', value: cartDisplay, inline: false },
        { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
      );

      const confirmButton = new ButtonBuilder()
        .setCustomId('confirm_create_accounts_ticket')
        .setLabel('Yes, Create Ticket')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✅');

      const cancelButton = new ButtonBuilder()
        .setCustomId('cancel_create_accounts_ticket')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌');

      const confirmRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

      await interaction.update({ 
        embeds: [confirmEmbed], 
        components: [confirmRow] 
      });
    } else if (interaction.customId === 'confirm_create_accounts_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.accounts : [];

      if (userCart.length === 0) {
        return interaction.reply({ content: '❌ Your cart is empty!', flags: 64 });
      }

      const guild = interaction.guild;
      let mainChannel = guild.channels.cache.get(TICKET_CREATION_CHANNEL_ID);

      // Fallback to finding channel by name if ID doesn't work
      if (!mainChannel) {
        mainChannel = guild.channels.cache.find(channel => 
          channel.name === '〘🛒〙𝗦𝗛𝗢𝗣' || channel.name.includes('SHOP')
        );
      }

      if (!mainChannel) {
        return interaction.reply({ content: '❌ Ticket channel not found!', flags: 64 });
      }

      const thread = await mainChannel.threads.create({
        name: `accounts-${interaction.user.username}`,
        autoArchiveDuration: 60,
        type: ChannelType.GuildPrivateThread,
        reason: 'New Accounts ticket'
      });

      userTickets.set(userId, thread.id);

      // Create ticket content with cart items
      let cartDisplay = '';
      let gamepasses = '';
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n`;
        gamepasses += `${index + 1}. **${item.name}**: ${item.gamepass}\n`;
      });

      const ticketEmbed = new EmbedBuilder()
        .setTitle('🎫 Accounts Ticket')
        .setDescription('Welcome to your **Accounts** ticket!')
        .addFields(
          { name: '🛒 Selected Items', value: cartDisplay, inline: false },
          { name: '💰 Total Price', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      const paymentEmbed = new EmbedBuilder()
        .setTitle('💳 Payment Methods')
        .setDescription(
          `⚠️ Never make payment unless staff is present.\n\n` +
          `- **CashApp:** ${CASHAPP_TAG}\n` +
          `- **PayPal:** ${PAYPAL_EMAIL}\n` +
          `- **Litecoin:** \`${LTC_ADDRESS}\`\n` +
          `- **Robux:** ${gamepasses}`
        )
        .setColor(GRAY_COLOR);

      const utilityRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('grant_buyer_role')
          .setLabel('Complete Purchase')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );

      const paymentRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('copy_ltc')
          .setLabel('Copy LTC')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📋'),
        new ButtonBuilder()
          .setCustomId('copy_cashapp')
          .setLabel('Copy CashApp')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💵'),
        new ButtonBuilder()
          .setCustomId('copy_paypal')
          .setLabel('Copy PayPal')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💸')
      );

      await thread.send({ 
        content: `<@${userId}> <@&${MODERATOR_ROLE_ID}>`, 
        embeds: [ticketEmbed, paymentEmbed], 
        components: [utilityRow, paymentRow] 
      });

      // Clear only the accounts cart after ticket creation
      if (userCartData) {
        userCartData.accounts = [];
        userCarts.set(userId, userCartData);
      }

      await interaction.update({ 
        content: `✅ Accounts ticket created! <#${thread.id}>`, 
        embeds: [], 
        components: [] 
      });

      saveDatabase();
    } else if (interaction.customId === 'cancel_create_accounts_ticket') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      const userCart = userCartData ? userCartData.accounts : [];

      // Show cart again
      const totalUSD = userCart.reduce((sum, item) => sum + item.price_usd, 0);
      const totalRobux = userCart.reduce((sum, item) => sum + item.price_robux, 0);

      let cartDisplay = '';
      userCart.forEach((item, index) => {
        cartDisplay += `${index + 1}. ${item.emoji} **${item.name}** - \$${item.price_usd} | ${item.price_robux} Robux\n   [Gamepass Link](${item.gamepass})\n`;
      });

      const cartEmbed = new EmbedBuilder()
        .setTitle('🛒 Your Shopping Cart')
        .setDescription(cartDisplay || 'Your cart is empty')
        .addFields(
          { name: '💰 Total', value: `\$${totalUSD.toFixed(2)} USD | ${totalRobux.toLocaleString()} Robux`, inline: false }
        )
        .setColor(BLUE_COLOR);

      const continueShoppingButton = new ButtonBuilder()
        .setCustomId('continue_shopping_accounts')
        .setLabel('Continue Shopping')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛍️');

      const createTicketButton = new ButtonBuilder()
        .setCustomId('create_accounts_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫');

      const clearCartButton = new ButtonBuilder()
        .setCustomId('clear_cart_accounts')
        .setLabel('Clear Cart')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️');

      const actionRow = new ActionRowBuilder().addComponents(continueShoppingButton, createTicketButton, clearCartButton);

      await interaction.update({ 
        embeds: [cartEmbed], 
        components: [actionRow] 
      });
    } else if (interaction.customId === 'clear_cart_accounts') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      if (userCartData) {
        userCartData.accounts = [];
        userCarts.set(userId, userCartData);
      }

      const productEmbed = new EmbedBuilder()
        .setTitle('👤 Accounts - Product Selection')
        .setDescription('Your cart has been cleared. Choose the accounts you want to purchase!')
        .setColor(BLUE_COLOR);

      const productSelect = new StringSelectMenuBuilder()
        .setCustomId('select_accounts_product')
        .setPlaceholder('Choose an account...')
        .setMinValues(1)
        .setMaxValues(1);

      const allProducts = getAllProductsForCategory('accounts');
      Object.entries(allProducts).forEach(([key, product]) => {
        productSelect.addOptions({
          label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
          description: `Gamepass: ${product.gamepass}`,
          value: key,
          emoji: product.emoji
        });
      });

      const selectRow = new ActionRowBuilder().addComponents(productSelect);

      await interaction.update({ 
        embeds: [productEmbed], 
        components: [selectRow] 
      });
    } else if (interaction.customId === 'clear_cart_steal_brainrot') {
      const userId = interaction.user.id;
      const userCartData = userCarts.get(userId);
      if (userCartData) {
        userCartData.steal_brainrot = [];
        userCarts.set(userId, userCartData);
      }

      const productEmbed = new EmbedBuilder()
        .setTitle('🧠 Steal a Brainrot - Product Selection')
        .setDescription('Your cart has been cleared. Choose the secrets and brainrot gods you want to purchase!')
        .setColor(BLUE_COLOR);

      const productSelect = new StringSelectMenuBuilder()
        .setCustomId('select_steal_brainrot_product')
        .setPlaceholder('Choose a secret or brainrot god...')
        .setMinValues(1)
        .setMaxValues(1);

      const allProducts = getAllProductsForCategory('steal_brainrot');
      Object.entries(allProducts).forEach(([key, product]) => {
        productSelect.addOptions({
          label: `${product.name} - \$${product.price_usd} | ${product.price_robux} Robux`,
          description: `Gamepass: ${product.gamepass}`,
          value: key,
          emoji: product.emoji
        });
      });

      const selectRow = new ActionRowBuilder().addComponents(productSelect);

      await interaction.update({ 
        embeds: [productEmbed], 
        components: [selectRow] 
      });
    }
  }
});

client.login(process.env.TOKEN);

client.once('ready', async () => {
  console.log(`🎮 Roblox Bazaar Bot is ready! Logged in as ${client.user.tag}!`);
  loadDatabase();
  await loadCustomProductsFromLogs();

  // Clean up archived tickets
  const ticketChannelId = TICKET_CREATION_CHANNEL_ID;
  const mainChannel = client.channels.cache.get(ticketChannelId);

  if (mainChannel) {
    console.log('🔍 Checking existing tickets on startup...');
    let cleanedCount = 0;
    let activeCount = 0;

    for (const [userId, ticketId] of userTickets.entries()) {
      try {
        const channel = client.channels.cache.get(ticketId);

        if (channel && channel.isThread()) {
          if (channel.archived || channel.locked) {
            userTickets.delete(userId);
            cleanedCount++;
            console.log(`🗑️ Cleaned archived ticket ${ticketId} for user ${userId}`);
          } else {
            activeCount++;
            console.log(`✅ Found active ticket ${ticketId}`);
          }
        } else {
          userTickets.delete(userId);
          cleanedCount++;
          console.log(`🗑️ Cleaned non-existent ticket ${ticketId} for user ${userId}`);
        }
      } catch (error) {
        console.error(`Error checking ticket ${ticketId}:`, error);
        userTickets.delete(userId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      saveDatabase();
    }

    console.log(`✅ Ticket cleanup complete: ${activeCount} active, ${cleanedCount} cleaned`);
  }
});

function getAllProductsForCategory(category) {
    let baseProducts = {};
    switch (category) {
        case 'grow_garden':
            baseProducts = { ...GROW_GARDEN_PRODUCTS };
            break;
        case 'steal_brainrot':
            baseProducts = { ...STEAL_BRAINROT_PRODUCTS };
            break;
        case 'accounts':
            baseProducts = { ...ACCOUNTS_PRODUCTS };
            break;
        default:
            return {};
    }

    // Add custom products
    if (customProducts[category]) {
        baseProducts = { ...baseProducts, ...customProducts[category] };
    }

    return baseProducts;
}

// Function to update thread with custom products
async function updateThreadWithCustomProducts(category) {
    const threadId = THREAD_CHANNELS[category];
    if (!threadId) return;

    const thread = client.channels.cache.get(threadId);
    if (!thread) return;

    // Get custom products for this category
    const customProds = customProducts[category] || {};

    // Start with the base thread message
    let threadMessage = THREAD_MESSAGES[category] || '';

    // Create custom products section
    if (Object.keys(customProds).length > 0) {
        let customSection = '\n\n## __CUSTOM PRODUCTS__\n';
        Object.values(customProds).forEach(product => {
            customSection += `> ### - <a:arrow:1396727506970611762> ${product.emoji} ${product.name} = \$${product.price_usd} | ${product.price_robux} robux\n`;
        });
        threadMessage += customSection;
    }

    // Edit the main thread message (the one with the products list)
    try {
        const messages = await thread.messages.fetch({ limit: 10 });
        let mainBotMessage = null;

        // Find the main bot message (the one that contains the product list, not the buy button message)
        for (const [messageId, message] of messages) {
            if (message.author.id === client.user.id && 
                message.content.includes('VALUED PETS') || 
                message.content.includes('SECRETS') || 
                message.content.includes('ACCOUNTS')) {
                mainBotMessage = message;
                break;
            }
        }

        if (mainBotMessage) {
            await mainBotMessage.edit(threadMessage);
            console.log(`✅ Updated thread ${category} with custom products`);
        } else {
            // If no main message found, send a new one
            await thread.send(threadMessage);
            console.log(`✅ Created new message in thread ${category} with custom products`);
        }
    } catch (error) {
        console.error('Error updating thread with custom products:', error);
    }
}

// Function to load custom products from log channel on startup
async function loadCustomProductsFromLogs() {
    const logChannel = client.channels.cache.get(CUSTOM_PRODUCTS_LOG_CHANNEL_ID);
    if (!logChannel) return;

    try {
        const messages = await logChannel.messages.fetch({ limit: 100 });

        for (const [messageId, message] of messages) {
            if (message.author.id === client.user.id && 
                message.embeds.length > 0 && 
                message.embeds[0].title === '✅ New Custom Product Added') {

                const embed = message.embeds[0];
                const fields = embed.fields;

                const productName = fields.find(f => f.name === 'Product Name')?.value;
                const category = fields.find(f => f.name === 'Category')?.value;
                const emoji = fields.find(f => f.name === 'Emoji')?.value;
                const priceUsd = parseFloat(fields.find(f => f.name === 'Price USD')?.value.replace('$', ''));
                const priceRobux = parseInt(fields.find(f => f.name === 'Price Robux')?.value.replace(/,/g, ''));
                const gamepassLink = fields.find(f => f.name === 'Gamepass Link')?.value;
                const productKey = fields.find(f => f.name === 'Product ID')?.value;

                if (productName && category && productKey) {
                    if (!customProducts[category]) {
                        customProducts[category] = {};
                    }

                    customProducts[category][productKey] = {
                        name: productName,
                        emoji: emoji,
                        price_usd: priceUsd,
                        price_robux: priceRobux,
                        gamepass: gamepassLink,
                        custom: true
                    };
                }
            }
        }

        console.log('✅ Loaded custom products from logs');
    } catch (error) {
        console.error('Error loading custom products:', error);
    }
}