class SignInWithBurner {

  constructor() {
    this.burnerUrl = 'http://localhost:3000'
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  openBurner() {
    this.w = popup(this.burnerUrl, 'Sign in with Burner Wallet', 600, 600)
    console.log('this.w: ', this.w);
  }

  receiveMessage(event) {
    if(event.origin === this.burnerUrl) {
      if(event.data === 'loaded') {
        console.log("Burner wallet loaded")
        this.w.postMessage('pleaseSign:xyz', this.burnerUrl)
      }
    }
  }
}

var signin = new SignInWithBurner()
const openBurner = signin.openBurner.bind(signin)


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
