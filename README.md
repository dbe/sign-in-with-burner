# Burner Wallet Single Sign On 
This library provides the ability for your users to single sign on with their burner wallet (xdai.io) identity. Upon clicking the sign in button they will be shown a confirmation page from xdai.io asking if they want to share their burner wallet address with your site. If so, they will share the address as well as a cryptographic signature proving they indeed own the private key for that address.

You can use this functionality instead of requiring spammy email/password combos.

## Installing
npm install --save sign-in-with-burner

## API
The library provides a single function "signIn".

function signIn(options) -> returns Promise

options {
  burnerUrl: "https://xdai.io/login" // You can change this to point to other burner wallet sites like buffiDai.io
  siteName: 'Your site name' // Will show up in the dialogue asking the user whether or not they want to share their ethereum address with your site.
}

The promise will resolve with the user's address if all goes well, or reject if not.

## Example Usage


```
import signIn from "sign-in-with-burner";

signIn({
  burnerUrl: 'https://xdai.io/login',
  siteName: 'Seven Twenty One'

}).then(address => {
  updateAddress(address);

}).catch(e => {
  console.log("Error logging in with burner: ", e)

});
```

## In the wild
[Demo Site](dbe.github.io/seventwentyone)
[Demo Site Code](https://github.com/dbe/seven-twenty-one)
