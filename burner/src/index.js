const ethers = require('ethers')

if(window.opener) {
  window.opener.postMessage('loaded', '*')
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  //Don't bother for same domain SYN and ACK stuff
  if(event.origin != 'http://localhost:3000') {
    console.log('event: ', event);
    if(event.data.command === 'sign') {
      postDetails(event)
    }
  }
}

function postDetails(event) {
  let details = document.getElementById('details');

  details.innerHTML = `
    <div>
      <p>${event.data.name} - ${event.origin}</p>
      <p>Is requesting access to your public key.</p>
      <button id="confirm" style="background-color: green; color:white;width:100px;height:50px;">Allow</button>
    </div>
  `
  //TODO: Actuall hook this up
  document.getElementById('confirm').addEventListener('click', function() {
    let pk = localStorage.getItem('metaPrivateKey')
    console.log('pk: ', pk);

    let wallet = new ethers.Wallet(pk)
    console.log('wallet: ', wallet);

    wallet.signMessage(`login-with-burner: ${event.data.challenge}`).then(signature => {
      console.log('signature: ', signature);

      console.log('event.source: ', event.source);

      event.source.postMessage({command: 'signed', signature: signature, address: wallet.address}, '*')
      // window.close()
    })
  })
}
