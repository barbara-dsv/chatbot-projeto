const {SlashCommandBuilder} = require ('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		await interaction.reply(`Este servido é  ${interaction.guild.name} e tem ${interaction.guild.memberCount} membros.`);
	},
};