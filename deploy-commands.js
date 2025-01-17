const {Routes, REST} = require('discord.js')
const {clientId, guildId, token} = require('./config.json')
const fs = require('node:fs')
const path = require('node:path')

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    //pega todos os arquivos de comandos do diretorio de comandos que foi criado 
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    //pega a saída de dados do SlashCommandBuilder#toJSON() de cada comando para implantação
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construa e prepare uma instância de módulo rest 
const rest = new REST().setToken(token);

// deploy dos comandos
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		//método PUT é usado para atualizar completamente todos os comandos no servidor com o conjunto atual
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
