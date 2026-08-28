const mineflayer = require('mineflayer');

// We are completely bypassing settings.json to fix your cloud host loop!
const serverConfig = {
    host: 'puppy.aternos.host',  // Your exact server domain
    port: 26877,                 // Your active dynamic port
    username: 'AternosKeeper',   // The bot name
    version: '1.21.1'            // Forced version to stop protocol errors
};

function startBot() {
    console.log(`[Bot] Connecting directly to ${serverConfig.host}:${serverConfig.port}`);
    
    const bot = mineflayer.createBot({
        host: serverConfig.host,
        port: serverConfig.port,
        username: serverConfig.username,
        version: serverConfig.version
    });

    bot.on('spawn', () => {
        console.log('[Bot] Successfully spawned in the server!');
    });

    // Subtle anti-AFK movement to prevent basic server kicks
    bot.on('time', () => {
        if (bot.time.age % 120 === 0) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 400);
        }
    });

    bot.on('error', (err) => {
        console.log('[Bot Error]:', err.message);
    });

    bot.on('end', (reason) => {
        console.log(`[Bot Disconnected]: ${reason}. Reconnecting in 10 seconds...`);
        setTimeout(startBot, 10000);
    });
}

// Start a basic web placeholder so Render/Railway free tier doesn't crash
const http = require('http');
http.createServer((req, res) => {
    res.write('Bot Status: Running Active');
    res.end();
}).listen(8080, () => {
    console.log('[System] Web service binding active on port 8080');
    startBot();
});
