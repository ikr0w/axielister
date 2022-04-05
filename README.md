# AxieLister

**Axie Infinity Marketplace Discord Bot**

![Preview Image](https://imgur.com/JkPRyh7.gif)

**Origin Version**

![Preview Image](https://imgur.com/trRiNMW.png)

**Classic Version**

![Preview Image](https://imgur.com/mMx0aCf.png)

# Requirements
- [Node.js](https://nodejs.org/en/) version 16.6 or higher

# Installation
**Download the Source Code first**
![Download Image](https://imgur.com/wb7jpZ5.png)

Then extract the ZIP file to your Desktop or somewhere you can easily access it
#

### Installing Node.js
You need to install [Node.js](https://nodejs.org/) v16.6 or higher

Next you'll need to open your terminal.

On Windows, either:
   - `Shift + Right-click` inside your bot folder and choose the "Open command window here" option
   - Press `Win + R` and run `cmd.exe`, and then `cd` into your folder directory

On macOS, either:
   - Open Launchpad or Spotlight and search for "Terminal"
   - In your "Applications" folder, under "Utilities", open the Terminal app

With the terminal open, run the `node -v` command to make sure you've successfully installed Node.js. If it outputs v16.6.0 or higher, great! Don't close the terminal yet, you still have steps to follow!

![image](https://i.imgur.com/SOk4qvv.png)

#
### Installing Dependencies
With Node.js installed, you can now install the required dependencies in order to run your discord bot

Using the terminal simply run this command in your discord bot folder to install the required dependencies:
```
npm install
```
Wait for it to finish and you should now have `node_modules` folder in the directory
#

### Creating a Discord Bot
Create your bot in [Discord Developer Portal](https://discord.com/developers/applications)

You can follow this [video](https://www.youtube.com/watch?v=b9KQxREfn4c) on creating a discord bot:

[![image](https://i.imgur.com/S0WO9vD.png1)](https://www.youtube.com/watch?v=b9KQxREfn4c)
#

### Inviting Your Bot
So far you’ve made a Discord Bot account but it’s not actually in any server

If you want to invite your bot you must create an Invite URL for it

There are 2 methods provided on how to do it
1. [Modifying the URL Provided](#1-modifying-the-url-provided)
2. [Generating the Invite URL](#2-generating-the-invite-url)

#### 1. Modifying the URL Provided
First you need to copy your `Client ID` at `OAuth2` then `General` and copy the `Client ID`

You just need to replace the `YOUR_BOT_ID` from this URL with the `Client ID` that you copied
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=363520&scope=bot%20applications.commands
```

#### 2. Generating the Invite URL
Simply go to `OAuth2` tab and and select `URL Generator`

![image](https://i.imgur.com/bQt9HMa.png)

On Scopes tick the `bots` and `application.commands`

![image](https://i.imgur.com/XyYjvHH.png)

Tick the permissions required for your bot to function under “Bot Permissions”

![image](https://i.imgur.com/w310qgf.gif)

Now the resulting URL can be used to add your bot to a server.

Copy and paste the URL into your browser, choose a server to invite the bot to, and click “Authorize”.
#

### Launching your Discord Bot 
Now your bot should be in your server but it is still offline and doesn't do anything

We need to setup the configuration first to launch your bot

Copy your Bot's Token in [Discord Developer Portal](https://discord.com/developers/applications)

![image](https://i.imgur.com/3TvBpQp.png?1)

In your discord bot folder, open the `config.json` and it should look like this:
```json
{
    "bot_token": "",
    "bot_activity": {
        "type": "WATCHING",
        "text": "Marketplace"
    },
    "version": "classic"
}
```
Add the token you copied to `bot_token`

It should now look like this: `"bot_token": "DISCORD_BOT_TOKEN_HERE"`

Save your changes to `config.json`

Next, you need to configure the custom emojis and channels for the bot to use 

In your discord bot folder, go to `/assets/json/` open the `axie-class-props.json` and it should look like this:
```json
{
    "aquatic": {
        "color":                "#00b8ce",
        "emoji":                "<:aquatic:959283850201157652>",
        "listingChannelId":     "899257844027764736",
        "salesChannelId":       "899258179387523112",
        "baseStats":            { "hp": 39, "speed": 39, "skill": 35, "morale": 27 },
        "addionalStats":        { "hp": 1,  "speed": 3,  "skill": 0,  "morale": 0  }
    }
}
```

You need to replace the values of `emoji`, `listingChannelId`, and `salesChannelId`

For `emoji`, go into a channel of the server that has that specific custom emoji, type `\` followed by the name of the emoji you want the ID of, 

Example:  `\:emoji:`

When you hit enter it'll automatically switch to: `<:emoji:emoji_id>`

![image](https://i.imgur.com/Ce82xzv.gif)

For `listingChannelId` and `salesChannelId` you can follow this [guide](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) to find the Channel ID

Save your changes and the bot is now ready to start

**Run `node app` in your terminal to launch your Discord Bot!**

![image](https://i.imgur.com/b0N4bgU.png)

You need to keep the process running in order for the commands to work.
You can also look for hosting providers that will run the your bot 24/7.
I will not cover it and you must do your own research as there are a lot of options out there on hosting your bot.

# Customization
### Game Version
Select between `classic` or `origin` and change the `version` in `config.json`

Example: `"version": "classic"`

### Status
Customize your bot's status in `config.json` and change the `type` and `text` to your liking 
| Type | Format | Example 
| --- | --- | --- |
| PLAYING | Playing {text} | Playing Axie Infinity
| LISTENING | Listening to {text} | Listening to Spotify
| WATCHING | Watching {text} | Watching YouTube Together
| COMPETING | 	Competing in {text} | 	Competing in Infinity Cup Tournament

# Support
[![Discord Banner 2](https://discordapp.com/api/guilds/864194584732106782/widget.png?style=banner2)](https://discord.gg/xyWaa4rRBy)

If you don't understand something or you are experiencing problems, please don't hesitate to join our [Discord Server](https://discord.gg/xyWaa4rRBy) for help
