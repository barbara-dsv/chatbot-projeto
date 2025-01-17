const fs = require('node:fs');
const path = require('node:path');
const { Client,  GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection()
// Constrói o caminho para o diretório 'commands'
const foldersPath = path.join(__dirname, 'commands')
// Lê o diretório 'commands' e retorna uma lista de pastas, como ['utility']
const commandFolders = fs.readdirSync(foldersPath)

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder)
    // Lê o diretório e retorna os arquivos de comando, como ['ping.js', 'server.js', 'user.js']
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for(const file of commandFiles){
        //para cada arquivo carregado, verifique se ele tem menos as propriedades datae execute.
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}

//fs.readdirSync().filter()retorna uma matriz de todos os nomes de arquivos no diretório fornecido e filtra apenas por .js
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);