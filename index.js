const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
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

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listener para interações de comandos de chat
client.on(Events.InteractionCreate, async interaction => {
    // Verifica se a interação é um comando de chat
    if (!interaction.isChatInputCommand()) return;
    //recupera o comando correspondente ao nome do comando executado da coleção de comandos 
    const command = interaction.client.commands.get(interaction.commandName)
    //Verifica se o comando foi encontrado na coleção.
    if (!command){
        console.error(`No command matching ${interaction.commandName} was found.`)
        return;
    }
    // Executa o comando e trata erros com try-catch
    try{
        await command.execute(interaction)
    } catch (error){
        console.log(error)
        //verifica se a interação foi respondido ou se uma resposta está pendente 
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral})
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
	console.log(interaction);
});


client.login(token);