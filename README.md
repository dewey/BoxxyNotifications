# IRC Download Notifications
===
This IRC bot is announcing file changes from a watched directory. Written in JavaScript for Node.

## Install:

Clone this repository, navigate to the directory and run

    npm install

to install all the dependencies listed in the `package.json`.

## Run:

    node BoxxyNotifications.js
    
or use [forever](https://github.com/nodejitsu/forever) to keep it running.

## Usage:

    !imdb The Bling Ring
    
The Bot will spit out some Information and a list of releases found on the specified tracker.

Use the ID to download the movie to your watch directory via a POST request to your pyWA bot. Click the link to start the download.

    20:43:21 dewey !dl 1234
    20:43:21 Boxxy Start Download: http://example.com:1234/dl.pywa?pass=PASSWORD&site=SITENAME&id=1234

To shutdown the bot use

    !quit