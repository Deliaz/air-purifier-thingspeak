# Air Purifier ThingSpeak
### Send statistic from Xiaomi Air Purifier to ThingSpeak.com

### Configuration
1. Discover Xiaomi Air Purifier by `miio`
    * `npm i -g miio`
    * `miio discover`
    * save IP and token
2. Create config.json based on config-example.json and paste IP & Token.
3. Create job in cron:
    * `*/5 * * * * node /path/to/air-purifier-thingspeak/`