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
// USER → YOU (FORWARD)
// ==========================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 1) return;

  if (message.author.id !== OWNER_ID) {
    try {
      const owner = await client.users.fetch(OWNER_ID);

      const embed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setTitle("New Message")
        .setDescription(message.content || "*No text*")
        .addFields({
          name: "From",
          value: `${message.author.tag} (${message.author.id})`
        })
        .setTimestamp();

      await owner.send({
        embeds: [embed],
        files: message.attachments.map(a => a.url)
      });

      await message.reply("📨 Message sent.");
    } catch (err) {
      console.error(err);
    }
  }
});

// ==========================
// /send ONLY
// ==========================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "send") {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.options.getString("userid");
      const msg = interaction.options.getString("message");
      const file = interaction.options.getAttachment("file");

      const user = await client.users.fetch(userId);

      const embed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setTitle("New Message")
        .setDescription(msg)
        .addFields({
          name: "From",
          value: interaction.user.tag
        })
        .setTimestamp();

      await user.send({
        embeds: [embed],
        files: file ? [file.url] : []
      });

      await interaction.editReply("✅ Sent!");
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Failed");
    }
  }
});

client.login(process.env.TOKEN);
