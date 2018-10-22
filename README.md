# Spec Training

## Setup

### Install dependencies

If you will running the app only in production mode:

```sh
npm install --production
```

Otherwise, run without the `--production` flag:

```sh
npm install
```

### Provide configuration

The app expects the following to be available on `process.env`:

```
OPEN_EXCHANGE_API_KEY="YOUR_KEY_HERE"
OPEN_EXCHANGE_API_HOST="https://openexchangerates.org"
```

[`dotenv`](https://www.npmjs.com/package/dotenv) is set up, so if you prefer, add a file named `.env` in this directory with the above (substituting your actual api key).

### Appeasing the self-signed certificate warning

In order to avoid a security warning (which is not applicable in non-production environments¹), the cert needs to be marked "trusted".

On Mac:

1. Open Keychain Access
1. Select `Certificates` under **Category** in the side panel
1. Import the root cert:
   * _File_ → _Import Items…_
   * Select `generic-localhost_rootCA.pem`
   * Change the dropdown for _When using this certificate:_ `Always Trust`. If you forget to change the dropdown, simply:
     * Double-click on the already-imported certificate
     * Expand **Trust**
     * Change the top dropdown to `Always Trust` (OSX / KeyChain Access prompt you to enter your Mac password)

#### HTTP/2 setup background

HTTP/2 requires SSL, and thus an SSL certificate. Included with this app are the necessary files:

File Name | Description
`./generic-localhost_rootCA.pem` | A self-signed root certificate¹
`./src/server/server.crt` | A domain certificate for `localhost`
`./src/server/server.key` | The private key for the domain certificate

¹ **Do NOT use a self-signed certificate in actual production**

## Prod mode

Prod mode will compile the app to run most efficiently. This compilation takes longer, but need be done only once (until the source is changed).

To compile the app for production:

```sh
npm run prod
```

If you choose to use the optional [`http-server`](https://www.npmjs.com/package/http-server) dependency (devs, you may already have installed globally), you can use the provided command to start a server to host the app:

```sh
npm run start
```

### API request proxying in prod mode

⚠️ The `npm run start` command is configured to automatically proxy API requests to the real API. Use sparingly as the free subscription is limited to a relatively small maximum number of requests per month.

## Dev Mode

Dev mode quickly compiles the app without optimisations and enables code updates to be quickly available.


```sh
npm run dev
```

### API stubbing in dev mode

The dev server stubs API requests to avoid spamming the real API. It returns static (but realistic) data.

## Run Specs


```sh
npm run test
```

Or to automatically re-run on change:


```sh
npm run test:watch
```
