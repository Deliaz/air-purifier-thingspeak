const config = require('./config.json');
const miio = require('miio');
const axios = require('axios');

const UPDATE_URL = 'https://api.thingspeak.com/update.json';
const HTTP_STATUS_OK = 200;

if (!config.device_ip || !config.device_token) {
    throw new Error('Missing IP or Token: check your config file');
}

if (!config.thingspeak_write_key) {
    throw new Error('Missing ThingSpeak API write key');
}

let deviceInstance = null;

miio.device({
    address: config.device_ip,
    token: config.device_token
})
    .then(device => {
        deviceInstance = device;

        if (deviceInstance.matches('type:air-purifier')) {
            const pmPromise = device.pm2_5();
            const tempPromise = device.temperature();
            const humidPromise = device.relativeHumidity();

            return Promise.all([pmPromise, tempPromise, humidPromise]);
        } else {
            throw new Error('The device is not an Air Purifier');
        }
    })
    .then(([pm, tempObj, humid]) => {
        const temp = tempObj.value; // tempObj = @Temperature { value: 22.4, unit: 'C' }
        return {pm, temp, humid};
    })
    .then(({pm, temp, humid}) => {
        return axios.get(UPDATE_URL, {
            params: {
                api_key: config.thingspeak_write_key,
                field1: pm,
                field2: temp,
                field3: humid
            }
        });
    })
    .then(response => {
        if (response.status === HTTP_STATUS_OK) {
            deviceInstance.destroy();
            process.exit(0);
        } else {
            throw new Error('ThingSpeak: data write failure. Status Text: ' + response.statusText);
        }
    })
    .catch(err => {
        console.error(`ERROR: ${err.message ? err.message : err}`);
        if (deviceInstance && typeof deviceInstance.destroy === 'function') {
            deviceInstance.destroy();
        }
        process.exit(-1);
    });