const ethers = require('ethers');

//Data Structure of communication:

// {
//   topic: Required: 'loaded', 'login', 'login:success', 'sign', 'sign:success'
//   ...topicSpecificKeys:
// }

class SignInWithBurner {
  constructor() {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
    this.requests = []
  }

  receiveMessage(event) {
    let request = this.eventToRequest(event);

    if(request.action === 'login') {
      this.handleLogin(request, event);
    } else if(request.action === 'sign') {
      this.handleSign(request, event);
    }
  }

  handleLogin(request, event) {
    //LOADED
    if(event.data.topic === 'loaded') {
      let challenge = `xyz${new Date().getTime()}`
      let message = {
        topic: 'login',
        challenge: challenge,
        name: request.options.siteName
      }

      request.challenge = challenge;

      request.source.postMessage(message, request.options.burnerUrl);

    // Logged in
    }  else if(event.data.topic === 'login:success') {
      this.validateSignature(request, event);
    }
  }

  handleSign(request, event) {
    if(event.data.topic === 'loaded') {
      let message = {
        topic: 'sign',
        tx: request.tx,
        name: request.options.siteName
      }

      request.source.postMessage(message, request.options.burnerUrl);

    // Logged in
    }  else if(event.data.topic === 'sign:success') {
      request.resolve(event.data.signed);
    }
  }

  //Returns correct request given the incoming event.
  //Validates that the event corresponds with a valid request
  eventToRequest(event) {
    let request = this.requests.find(req => req.source === event.source);

    if(!request) {
      throw("Could not find request for given popup");
    }

    let origin = new URL(request.options.burnerUrl).origin;

    if(event.origin !== origin) {
      throw("Wrong origin")
    }

    if(!event.data) {
      throw("Malformed message from burner wallet.")
    }

    return request;
  }

  validateSignature(request, event) {
    let address = ethers.utils.verifyMessage(`login-with-burner:${request.challenge}`, event.data.signature)

    if(address === event.data.address) {
      request.resolve(address);
    } else {
      request.reject("Failed to authenticate.")
    }
  }
}

//From Facebook
//https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
function popup(url, title, w, h) {
  var userAgent = navigator.userAgent,
      mobile = function() {
        return /\b(iPhone|iP[ao]d)/.test(userAgent) ||
          /\b(iP[ao]d)/.test(userAgent) ||
          /Android/i.test(userAgent) ||
          /Mobile/i.test(userAgent);
      },
      screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
      screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
      outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.documentElement.clientWidth,
      outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : document.documentElement.clientHeight - 22,
      targetWidth = mobile() ? null : w,
      targetHeight = mobile() ? null : h,
      V = screenX < 0 ? window.screen.width + screenX : screenX,
      left = parseInt(V + (outerWidth - targetWidth) / 2, 10),
      right = parseInt(screenY + (outerHeight - targetHeight) / 2.5, 10),
      features = [];
  if (targetWidth !== null) {
    features.push('width=' + targetWidth);
  }
  if (targetHeight !== null) {
    features.push('height=' + targetHeight);
  }
  features.push('left=' + left);
  features.push('top=' + right);
  features.push('scrollbars=1');

  var newWindow = window.open(url, title, features.join(','));

  if (window.focus) {
    newWindow.focus();
  }

  return newWindow;
}

//Singleton manager
const manager = new SignInWithBurner();

const DEFAULT_OPTIONS = {
  burnerUrl: "https://xdai.io/login",
  siteName: "A site"
}

function login(options) {
  options = Object.assign(DEFAULT_OPTIONS, options)

  let promise = new Promise( (resolve, reject) => {
    let w = popup(options.burnerUrl, 'Sign in with Burner Wallet', 600, 600)

    manager.requests.push({
      action: 'login',
      source: w,
      resolve,
      reject,
      options
    })
  })

  return promise;
}

function sign(tx, options) {
  options = Object.assign(DEFAULT_OPTIONS, options)

  let promise = new Promise( (resolve, reject) => {
    let w = popup(options.burnerUrl, 'Sign in with Burner Wallet', 600, 600)

    manager.requests.push({
      action: 'sign',
      source: w,
      tx,
      resolve,
      reject,
      options
    })
  })

  return promise;
}

module.exports = {
  login,
  sign
};
