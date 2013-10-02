// Requirements
var config = require('./config');
var irc = require('irc');
var watchr = require('watchr');
var path = require('path');
var imdb = require('imdb-api');
var ptp = require('ptp.js');

// IRC Config
console.log('Connect to the IRC Server');
var bot = new irc.Client(config.bot.server, config.bot.username, {
    userName: config.bot.username,
    realName: config.bot.realname,
    debug: config.bot.debug,
    showErrors: config.bot.errors,
    port: config.bot.port,
    certExpired: config.bot.expired,
    secure: config.bot.ssl,
    autoConnect: config.bot.autoconnect,
    channels: [config.bot.channel]
});


// File changes
console.log('Watch our complete directory');
watchr.watch({
    path: config.misc.watchedDirectory,
    listeners: {
        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
            if(changeType == "create" && (path.dirname(filePath) == config.misc.watchedDirectory)) {
                bot.say(config.bot.channel, irc.colors.wrap('dark_green', 'Download finished: ') + path.basename(filePath));
            }

            else if (path.dirname(filePath) == config.misc.watchedDirectory + "/music_what") {
                if(changeType == "create") {
                    bot.say(config.bot.channel, irc.colors.wrap('dark_green', '[What] Download finished: ') + path.basename(filePath));
                } else if (changeType == "delete") {
                    bot.say(config.bot.channel, irc.colors.wrap('dark_red', 'Trashed: ') + path.basename(filePath));
                }
            }
            
            else if (path.dirname(filePath) == config.misc.watchedDirectory + "/movie_ptp") {
                if(changeType == "create") {
                    bot.say(config.bot.channel, irc.colors.wrap('dark_green', '[PTP] Download finished: ') + path.basename(filePath));
                } else if (changeType == "delete") {
                    bot.say(config.bot.channel, irc.colors.wrap('dark_red', 'Trashed: ') + path.basename(filePath));
                }
            }

            else if (path.dirname(filePath) == config.misc.watchedDirectory + "/tv_auto") {
                if(changeType == "create") {
                    bot.say(config.bot.channel, irc.colors.wrap('dark_green', '[BTN] Download finished: ') + path.basename(filePath));
                } else if (changeType == "delete") {
                    bot.say(config.bot.channel, irc.colors.wrap('dark_red', 'Trashed: ') + path.basename(filePath));
                }
            }
        }
    }
});

bot.addListener('message', function (from, to, message) {
    if(message.indexOf("!dl") != -1) {
        var ptpid = message.replace(/!dl\s/g, "");
        bot.say(config.bot.channel, irc.colors.wrap('dark_green', "Start Download: ") + config.tracker.poststring+ptpid);
    }
});

// IMDB
bot.addListener('message', function (from, to, message) {
    if(message.indexOf("!imdb") != -1) {
        var title = message.replace(/!imdb\s/g, "");
        
        imdb.getReq({ name: title }, function(err, things) {
            movie = things;

            if(!err) {
                bot.say(config.bot.channel, "> IMDB: " + movie.imdburl) + " [Rating: "+movie.rating+"] " + "[Year: "+movie.year+"] " + "[Runtime: "+movie.runtime+"]";
                bot.say(config.bot.channel, "> Genre: " + movie.genres);
                bot.say(config.bot.channel, "> Country: " + movie.country);
                bot.say(config.bot.channel, "> Download: " + config.bot.searchstring + movie.imdbid);
                bot.say(config.bot.channel, "Fetching Releases from PTP...");


                // PassThePopcorn
                ptp.login(config.tracker.username, config.tracker.password, config.tracker.passkey, function (error, data) {
                    if(error) {
                        throw error;
                    }
                    data = JSON.parse(data);
                    if(data.Result === 'Ok') {
                        ptp.search(movie.imdbid, function (error, data) {
                            if(error) {
                                throw error;
                            }
                            var response = JSON.parse(data)

                            var k, releases;
                            for (k = 0; k < response.Movies[0].Torrents.length; k++)
                            {
                              releases = response.Movies[0].Torrents[k].Id;
                              bot.say(config.bot.channel, "   ID: " + response.Movies[0].Torrents[k].Id +" - ["+response.Movies[0].Torrents[k].Resolution+"] " + " ["+response.Movies[0].Torrents[k].Codec+"/"+response.Movies[0].Torrents[k].Container+"] "+ " ["+response.Movies[0].Torrents[k].Source+"] " + "["+(parseInt(response.Movies[0].Torrents[k].Size)/1024/1024).toFixed(2)+"MB] " + "[Scene: "+response.Movies[0].Torrents[k].Scene+"] " + "[Seeder ("+ response.Movies[0].Torrents[k].Seeders+") / Leecher ("+response.Movies[0].Torrents[k].Leechers+")]");
                          }
                      });
                    }
                });
            } else {
                bot.say(config.bot.channel, "¯\(°_o)/¯");
            }
        });
}
});


// IRC Handlers
bot.addListener('message', function (from, to, message) {
    if(message == "!quit" && from == "dewey") {
        bot.disconnect("Abort mission!");

    } else if (message == "!quit" && from != "dewey") {
        bot.say(config.bot.channel,'Uhm no.');
    }
});

bot.addListener('error', function(message) {
    if(config.bot.debug) {
        console.error('ERROR: %s: %s', message.command, message.args.join(' '));
    }
});

bot.addListener('pm', function(nick, message) {
    if(config.bot.debug) {
        console.log('Got private message from %s: %s', nick, message);
    }
});

bot.addListener('join', function(channel, who) {
    if(config.bot.debug) {
        console.log('%s has joined %s', who, channel);
    }
});

bot.addListener('part', function(channel, who, reason) {
    if(config.bot.debug) {
        console.log('%s has left %s: %s', who, channel, reason);
    }
});

bot.addListener('kick', function(channel, who, by, reason) {
    if(config.bot.debug) {
        console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
    }
});