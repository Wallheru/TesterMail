require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send DM to a user')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('User ID')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('Image/file')
        .setRequired(false)),

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
        .setDescription('Image/file')
        .setRequired(false))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering commands...");

    await rest.put(
      Routes.applicationCommands("1494367658794029206"),
      { body: commands }
    );

    console.log("✅ Commands registered");
  } catch (err) {
    console.error(err);
  }
})();
