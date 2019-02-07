const ethers = require('ethers');

class SignInWithBurner {
  constructor(options, resolve, reject) {
    this.options = options;
    this.resolve = resolve;
    this.reject = reject;

    window.addEventListener("message", this.receiveMessage.bind(this), false);
    this.w = popup(options.burnerUrl, 'Sign in with Burner Wallet', 600, 600)
  }

  receiveMessage(event) {
    let origin = new URL(this.options.burnerUrl).origin;

    if(event.origin === origin) {
      if(event.data === 'loaded') {
        this.challenge = `xyz${new Date().getTime()}`
        this.w.postMessage({command: 'sign', challenge: this.challenge, name: this.options.siteName}, this.options.burnerUrl)
      } else if(event.data.command === 'signed'){
        this.validateSignature(event)
      }
    }
  }

  validateSignature(event) {
    let address = ethers.utils.verifyMessage(`login-with-burner:${this.challenge}`, event.data.signature)

    if(address === event.data.address) {
      this.resolve(address);
    } else {
      this.reject("Failed to authenticate.")
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

const DEFAULT_OPTIONS = {
  burnerUrl: "https://xdai.io/login",
  siteName: "A site"
}

function signIn(options) {
  options = Object.assign(DEFAULT_OPTIONS, options)
  
  let promise = new Promise( (resolve, reject) => {
    let manager = new SignInWithBurner(options, resolve, reject)
  })

  return promise;
}

module.exports = signIn;
