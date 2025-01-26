const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.'),
    async execute(interaction) {
        await interaction.reply(`Esse comando foi executado por ${interaction.user.username}, que se juntou ${interaction.member.joinedAt}.`)
    }
}