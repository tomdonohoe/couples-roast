# Couples Roast

Couples Roast is an online multiplayer game where you roast your friends with the help of stock couple pictures. 

TIP: Couples roast is best played while drinking with close friends. I'd say this game is NSFW :P!

This game is inspired by Jack Box Party Box 4 "Survive the Internet".

## Rules

Couples Roast is for 3-8 players. The game consists of 4 rounds. Each round every player is sent the same photo related to the category of that round (below). The player must come up with a great burn on another couple (best if that couple is playing the game or everyone in the group knows!). Following the round everyone votes for the best burn! You get 100 points for each vote you recieved. The player with most votes gets a bonus 200 points. The player with the most points at the end of four rounds wins.

Topics:

- Happiness (couple photos of joy.. e.g. weddings, pregnacies, engagements)
- Sadness (couple photos of sadness.. e.g. breakups, )
- Fear (couples photos of fear... )
- Anger (couple photos of conflict.. e.g. fights, mood swings, )

## Getting Started

```bash
# install
$ cd server && yarn install 
$ cd client && yarn install

# start app
$ make start

# rebuild client assets
$ make restart
```

## Useful commands

```bash
# code formatting
$ make format-fix-server

$ make format-fix-client

# linting
$ make lint-fix-server

$ make lint-fix-client
```

## Deploying

The app is deploying to Heroku. The `package.json` file in the root is used by Heroku. Heroku uses `yarn run build` to build client and server apps. Then starts server with `yarn run start`.

```bash
# deploy to heroku
$ make deploy
```