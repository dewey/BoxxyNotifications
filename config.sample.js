var config = {}

config.bot = {};
config.misc = {};
config.tracker = {};

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

config.tracker.username="dewey";
config.tracker.password="password";
config.tracker.passkey="passkey";
config.tracker.poststring="http://example.com:1234/dl.pywa?pass=thewebuipassword&site=trackername&id="

module.exports = config;