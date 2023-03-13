# Discontinued

This project is officially no longer being maintained by its creator, Crecket, and has been archived. 
I (@LiroyvH) forked the project to submit fixes to the card creation endpoint so that this project can be used again for ordering (virtual) cards, but will also not necessarily maintain it. Using these sripts or any portion thereof is at your own risk, especially so as it's no longer being maintained. Before using it, it would be good to double-check the current API conventions, costs, etc. and try sandboxing first. (If that works... Sandbox usually doesn't.)

Crecket has stopped maintaining this project, there will likely be bugs at this point so use it at your own risk.

# bunqJSClient 
[![NPM  Version](https://img.shields.io/npm/v/@bunq-community/bunq-js-client.svg) ](https://www.npmjs.com/package/@bunq-community/bunq-js-client)
[![NPM Downloads](https://img.shields.io/npm/dt/@bunq-community/bunq-js-client.svg) ](https://www.npmjs.com/package/@bunq-community/bunq-js-client)
[![build status for master branch](https://api.travis-ci.org/bunqCommunity/bunqJSClient.svg?branch=master) ](https://travis-ci.org/bunqCommunity/bunqJSClient)
[![MIT License](https://img.shields.io/npm/l/@bunq-community/bunq-js-client.svg)](https://github.com/bunqCommunity/bunqJSClient/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/bunqCommunity/bunqJSClient/branch/master/graph/badge.svg) ](https://codecov.io/gh/bunqCommunity/bunqJSClient)

A unofficial javascript SDK for the bunq API. It is aimed at allowing single page applications to do all interactions with bunq without proxying through other services. 

The API session details are encrypted and stored using [forge](https://github.com/digitalbazaar/forge).

This project was originally built for the browser but has since then been tested and used with NodeJS servers. If you do want to use NodeJS you can still easily create a custom storage handler (with the default being Localstorage) like described in the [installation](#installation) section.


## Usage
-edit by @LiroyvH- WARNING: The instructions below starting from "Installation" are from the original version by Crecket. If you follow those instructions, it will likely download the old version of this API-client without any of the changes in this repository and it will likely NOT work. Instead of following those, download the contents of my repository instead (clone this repository or download as ZIP and unpack). Then create a .env file by modifying the API_KEY field (create a key in the bunq app) in the .env.example and save it as .env (swap SANDBOX to PRODUCTION if you actually want to do something like ordering a card)). Then run "npm install" followed by "npm run build". Once that's done: you can do stuff like running "node examples/order_cards.js".  
NOTE: if at any point you change your .env file, you must run "npm run build" again.   
NOTE2: if it wasn't obvious yet, to use this API-client you must have node installed; which is available for all OS'es.

Keep in mind that the valid fields for Card Type in order_cards.js are:  
"MASTERCARD", "MASTERCARD_MOBILE_NFC", "MASTERCARD_VIRTUAL", "MAESTRO", "MAESTRO_MOBILE_NFC", "MAESTRO_VIRTUAL".  
And the valid corresponding fields for Product Type are:  
"MAESTRO_DEBIT", "MASTERCARD_DEBIT", "MASTERCARD_TRAVEL", "MASTERCARD_BUSINESS", "MASTERCARD_GREEN".

Examples for virtual card creation (note: subject to change, always double check API docs! These were valid early 2023):  
So to create a Debit DigiCard you'd set MASTERCARD_VIRTUAL and MASTERCARD_DEBIT for Card Type and Product Type respectively.  
Or if you wish to create a virtual Maestro-card you'd do MAESTRO_VIRTUAL and MAESTRO_DEBIT for Card- and Product Type respectively.  
Or if you wish to create an NFC-only card: MAESTRO_MOBILE_NFC or MASTERCARD_MOBILE_NFC as Card Type and MAESTRO_DEBIT or MASTERCARD_DEBIT as Product type.  
All of the above examples show up as DigiCards and may count towards your total allowed (Digi)Cards.

WARNING: Bunq's API does not warn you about any costs involved, it will simply do what you tell it to do. So ordering a physical card through this API and/or for example ordering any amount of virtual/DigiCards that make you cross the limit (25 at this time) may result in (significant) charges. The Card Type and Product Type names may also change at any time, so you may wish to check Bunq's API Documentation before using any of the above examples. So use at your own risk, with caution and check your limits!

OR: download the API-client below through yarn and then manually diff the modified files (for example: examples/order_cards.js, src/Api/CardDebit.ts, src/Types/CardTypes.ts, src/Types/ProductType.ts (yeah I forgot an s in that name, sue me.)) Note that when you're ready to switch to PRODUCTION api, change the .env to reflect that and run "npm run build" again before proceeding to try any action against the API again.

## Installation
Install the library

```bash
yarn add @bunq-community/bunq-js-client
```

Next create a new instance with an optional storage interface as the first parameter. This defaults to [store.js](https://github.com/marcuswestin/store.js/) but any class 
with the following methods: `get(key)`, `set(key, data)`, `remove(key)`.

## Usage
Create a new client using LocalStorage.
```js
const bunqJSClient = new BunqJSClient();
```

The default installation attempts to use LocalStorage which is only compatible with the browser. You can check the `src/Stores/*` folder for other compatible storage handlers. This example uses the JSON store which writes the data to a local JSON file.
```js
import JSONFileStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore"; 

// run the file store with a location to store the data
const storageInstance = JSONFileStore("./bunq-js-client-data.json");

// create a new bunqJSClient with the new storage instance
const bunqJSClientCustom = new bunqJSClient(storageInstance);

// disables the automatic requests to keep the current session alive
// instead it'll create a new session when it is required
bunqJSClient.setKeepAlive(false);
```

Next run the setup functions to get started
```js
/**
 * A 16-byte encryption key, check the examples (create_encryption_key.js) 
 * on how to create one
 * @see https://github.com/digitalbazaar/forge#pkcs5
 */
const ENCRYPTION_KEY = "3c7a4d431a846ed33a3bb1b1fa9b5c26";
const API_KEY = "abcd-1234-abcd-1234"; // Your bunq API key
/**
 * The device name which will show in the installation notification that bunq sends
 * this also lets users manage their keys more easily
 */ 
const DEVICE_NAME = "My Device"; 
const ENVIRONMENT = "SANDBOX"; // OR you can use PRODUCTION

/**
 * Permitted IPs, allowed values are:
 *  - Empty if you're not sure (bunq will use the current IP)
 *  - An array of allowed IP addresses 
 *  - The "*" character to enable wildcard mode
 */
const PERMITTED_IPS = []; 

const setup = async () => {
    // run the bunq application with our API key
    await bunqJSClient.run(API_KEY, PERMITTED_IPS, ENVIRONMENT, ENCRYPTION_KEY);
    
    // install a new keypair 
    await bunqJSClient.install();
    
    // register this device
    await bunqJSClient.registerDevice(DEVICE_NAME);
    
    // register a new session
    await bunqJSClient.registerSession();
}
```

Now you can use the API in the bunq client to do requests and get the current users.
```js
// force that the user info is retrieved from the API instead of the data currently in the object
const forceUpdate = true;

// all users connected to the api key
const users = await bunqJSClient.getUsers(forceUpdate);

// get only the userCompany account if one is set
const userCompany = await bunqJSClient.getUser("UserCompany", forceUpdate);

// get all payments for a user and monetary account
const payments = await bunqJSClient.api.payment.list(userId, accountId);
```

## OAuth authentication
You can use the helper function to format a correct url to start the login flow:
```js
const url = bunqJSClient.formatOAuthAuthorizationRequestUrl(
    clientId, 
    redirectUri, 
    optionalState: string | false = false,
    sandbox: boolean = false
);
```

Next when the user grants access use the returned code parameter with:
```js
const authorizationCode = await bunqJSClient.exchangeOAuthToken(
    clientId, 
    clientSecret, 
    redirectUri, 
    code, 
    state: string | false = false,
    sandbox: boolean = false
    grantType: string = "authorization_code",
)
```

This will return the if successful `access_token` which is a valid API key. Using this key will give you access to the limited `UserApiKey` user object. For more details on the limitations of a OAuth connection check out the official together topic [here](https://together.bunq.com/d/3016-oauth).

## Examples
There are a few examples which can be found in the `examples/` folder. `create_sandbox_apikey` will create and output a new sandbox key which you can use with the other examples.

The examples use [dotenv](https://github.com/motdotla/dotenv) so make sure to copy the `.env.example` file to `.env` and enter the correct values.

A basic overview of the different examples can be [found here](examples/).

## Supported APIs
For more details look into the endpoints found at `src/Api/*`. Adding endpoints is relatively easy but they tend to get added when required or requested. The most common endpoints are now all implemented but feel free to request (Or preferably create a pull request) for any endpoints that are missing. 

## Contact
[![Telegram chat badge](https://img.shields.io/badge/Telegram-Discuss-blue.svg) ](https://t.me/bunqcommunity)

We have a public [Telegram chat group ](https://t.me/bunqcommunity). Feel free to create a new issue for any suggestions, bugs or general ideas you have on Github or contact us through one of the above.

## Contributors ![Contributer count](https://img.shields.io/github/contributors/bunqcommunity/bunqjsclient.svg)

[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/0)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/0)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/1)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/1)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/2)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/2)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/3)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/3)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/4)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/4)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/5)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/5)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/6)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/6)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/images/7)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqJSClient/links/7)

## License
Unless otherwise noted, the bunqJSClient source files are distributed under the MIT License found in the [LICENSE](https://github.com/bunqCommunity/bunqJSClient/blob/master/LICENSE) file.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FbunqCommunity%2FbunqJSClient.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FbunqCommunity%2FbunqJSClient?ref=badge_large)
