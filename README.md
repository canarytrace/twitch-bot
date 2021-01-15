# twitch-bot


## Twitch dev example

- https://dev.twitch.tv/docs/irc

## Command & Message Limits

There are limits of the number of IRC commands or messages you are allowed to send to the server. If you exceed these limits, you are locked out of chat for 30 minutes.

**Authentication and join rate limits are:**

- 20 authenticate attempts per 10 seconds per user (200 for verified bots)
- 20 join attempts per 10 seconds per user (2000 for verified bots)

## Command and message limits are:

**Limit	Applies to**
- 20 per 30 seconds	Users sending commands or messages to channels in which they do not have Moderator or Operator status
- 100 per 30 seconds	Users sending commands or messages to channels in which they have Moderator or Operator status
For Whispers, which are private chat message between two users:

**Limit	Applies to**
- 3 per second, up to 100 per minute
- 40 accounts per day	Users (not bots)
- 10 per second, up to 200 per minute
- 500 accounts per day	Known bots
- 20 per second, up to 1200 per minute
- 100,000 accounts per day	Verified bots

## How to run

```
docker-compose up
```