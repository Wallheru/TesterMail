require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder
} = require('discord.js');

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

// ==========================
// USER → YOU (DM FORWARD)
// ==========================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 1) return;

  if (message.author.id !== OWNER_ID) {
    try {
      const owner = await client.users.fetch(OWNER_ID);

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL()
        })
        .setDescription(message.content || "*No text*")
        .setFooter({ text: `User ID: ${message.author.id}` })
        .setTimestamp();

      await owner.send({
        embeds: [embed],
        files: message.attachments.map(a => a.url)
      });

      await message.reply("📨 Message sent. Please wait for a reply.");
    } catch (err) {
      console.error(err);
    }
  }
});

// ==========================
// SLASH COMMANDS
// ==========================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // ===== SEND =====
  if (interaction.commandName === "send") {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.options.getString("userid");
      const msg = interaction.options.getString("message");
      const file = interaction.options.getAttachment("file");

      const user = await client.users.fetch(userId);

      const embed = new EmbedBuilder()
        .setColor(0x00ff99)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(msg)
        .setTimestamp();

      await user.send({
        embeds: [embed],
        files: file ? [file.url] : []
      });

      await interaction.editReply("✅ Sent!");
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Failed (user must DM bot first)");
    }
  }

  // ===== REPLY =====
  if (interaction.commandName === "reply") {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.options.getString("userid");
      const msg = interaction.options.getString("message");
      const file = interaction.options.getAttachment("file");

      const user = await client.users.fetch(userId);

      const embed = new EmbedBuilder()
        .setColor(0x00b0f4)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(msg)
        .setTimestamp();

      await user.send({
        embeds: [embed],
        files: file ? [file.url] : []
      });

      await interaction.editReply("✅ Reply sent!");
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Failed to reply");
    }
  }
});

client.login(process.env.TOKEN);
