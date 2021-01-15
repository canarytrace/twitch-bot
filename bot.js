const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  
  // Ignore messages from the bot
  if(self || !msg.startsWith('!')) return;

  // Exist some badge?
  let subscriber = false
  if (context['badge-info'] !== null) {
    subscriber = true;
  }
  
  console.log(JSON.stringify(self, null, 2))
  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!canarybot') {
    client.say(target, `rdpaneCANARY Hello ${context['display-name']} ${subscriber? 'a ma Sub!': 'Nemas subscribe'}`);
    console.log(`* Executed ${commandName} command`);
  } 
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
