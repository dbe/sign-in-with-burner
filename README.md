# Demo of "Sign in with BurnerWallet" functionality

## How to run it
- Clone down the repo
- npm i
- npm run start-burner
- ##Open another console
- npm run start-client
- go to localhost:3001

Signature verification works, but you need to have run a burner wallet on the same domain you will be running the start-burner from. I use /etc/hosts to set this up locally and get the burner wallet to set the private key in local storage.

This is a proof of concept for ironing out the handshaking protocol and formualting a nice library for dapp devs to download.
