// Requirements
var irc = require('irc');
var watchr = require('watchr');
var path = require('path');

// Config
var watchedDirectory = "/home/dewey/torrent/data/complete";
var activeChannel = "#lobby";
var botNick = "Boxxy";

// IRC Config
console.log('Connect to the IRC Server');
var bot = new irc.Client('irc.example.com', botNick, {
    userName: 'Boxxy',
    realName: 'BoxxyNotifications',
    debug: false,
    showErrors: false,
    port: 7776,
    certExpired: false,
    secure: false,
    autoConnect: true,
    channels: [activeChannel]
});


// File changes
console.log('Watch our complete directory');
watchr.watch({
    path: watchedDirectory,
    listeners: {
        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
            if(changeType == "create" && (path.dirname(filePath) == watchedDirectory)) {
                bot.say(activeChannel,'Download finished: ' + path.basename(filePath));
            }

            else if (path.dirname(filePath) == watchedDirectory + "/music_what") {
                if(changeType == "create") {
                    bot.say(activeChannel,'[What] Download finished: ' + path.basename(filePath));
                } else if (changeType == "delete") {
                    bot.say(activeChannel,'Deleted: ' + path.basename(filePath));
                }
            }
            
            else if (path.dirname(filePath) == watchedDirectory + "/movie_ptp") {
                if(changeType == "create") {
                    bot.say(activeChannel,'[PTP] Download finished: ' + path.basename(filePath));
                } else if (changeType == "delete") {
                    bot.say(activeChannel,'Deleted: ' + path.basename(filePath));
                }
            }

            else if (path.dirname(filePath) == watchedDirectory + "/tv_auto") {
                if(changeType == "create") {
                    bot.say(activeChannel,'[BTN] Download finished: ' + path.basename(filePath));
                } else if (changeType == "delete") {
                    bot.say(activeChannel,'Deleted: ' + path.basename(filePath));
                }
            }
        }
    }
});




// IRC Handlers
bot.addListener('message', function (from, to, message) {
    if(message == "!quit" && from == "dewey") {
        bot.disconnect();
       
    } else if (message == "!quit" && from != "dewey") {
        bot.say(activeChannel,'Uhm no.');
    }
});

bot.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

bot.addListener('pm', function(nick, message) {
    console.log('Got private message from %s: %s', nick, message);
});

bot.addListener('join', function(channel, who) {
    console.log('%s has joined %s', who, channel);
});

bot.addListener('part', function(channel, who, reason) {
    console.log('%s has left %s: %s', who, channel, reason);
});

bot.addListener('kick', function(channel, who, by, reason) {
    console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});