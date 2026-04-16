require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const CLIENT_ID = "1494367658794029206";

const commands = [
  new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send a DM')
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
        .setRequired(false))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Commands updated!");
  } catch (err) {
    console.error(err);
  }
})();
