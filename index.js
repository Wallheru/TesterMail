require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ],
  partials: [Partials.Channel]
});

const OWNER_ID = "1094584063148433468";

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// USER → BOT (DM forward)
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 1) return;

  if (message.author.id !== OWNER_ID) {
    try {
      const owner = await client.users.fetch(OWNER_ID);

      await owner.send(
        `📩 New message\nUser: ${message.author.tag} (${message.author.id})\nMessage: ${message.content || "No text"}`
      );

      await message.reply("📨 Message sent. Please wait.");
    } catch (err) {
      console.error(err);
    }
  }
});

// SLASH COMMAND
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "send") {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.options.getString("userid");
      const msg = interaction.options.getString("message");

      const user = await client.users.fetch(userId);

      await user.send(`📨 ${msg}`);

      await interaction.editReply("✅ Sent!");
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Failed (user must DM bot first)");
    }
  }
});

client.login(process.env.TOKEN);