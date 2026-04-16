require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const CLIENT_ID = "1494367658794029206"; // your app id

const commands = [

  // ===== /send =====
  new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send a DM to a user')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('User ID')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to send')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('Optional image/file')
        .setRequired(false)),

  // ===== /reply =====
  new SlashCommandBuilder()
    .setName('reply')
    .setDescription('Reply to a user')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('User ID')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Reply message')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('Optional image/file')
        .setRequired(false))

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("⏳ Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Slash commands registered!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();
