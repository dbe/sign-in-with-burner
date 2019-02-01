if(window.opener) {
  console.log('window.opener: ', window.opener);
  window.opener.postMessage('loaded', '*')
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  //Don't bother for SYN and ACK stuff
  if(event.origin != 'http://localhost:3000') {
    console.log('event: ', event);
    let match = event.data.match(/^pleaseSign:(.*)$/)
    if(match) {
      postDetails(event.origin, match[1])
    }
  }
}

function postDetails(origin, sign) {
  let details = document.getElementById('details');
  details.innerHTML = `${origin} wants you to sign ${sign}`
}
