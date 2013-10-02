var config = {}

config.bot = {};
config.misc = {};

config.bot.username= 'Boxxy';
config.bot.realname= 'BoxxyNotifications';
config.bot.server= 'irc.example.com';
config.bot.port= 1234;
config.bot.channel= '#announce';
config.bot.ssl= false;
config.bot.debug= false;
config.bot.autoconnect= true;
config.bot.expired= false;
config.bot.errors= false;
config.bot.searchstring= "https://example.com/torrents.php?searchstr=";

config.misc.watchedDirectory= '/torrent/data/complete';

module.exports = config;