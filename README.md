# Air Purifier ThingSpeak
### Send statistic from Xiaomi Air Purifier to ThingSpeak.com

### Configuration
1. Discover Xiaomi Air Purifier by [`miio`](https://github.com/aholstenson/miio)
    * `npm i -g miio`
    * `miio discover`
    * save IP and token
2. Create config.json based on config-example.json and paste IP & Token.
3. Create job in cron:
    * `*/5 * * * * /usr/bin/node /path/to/air-purifier-thingspeak/index.js`