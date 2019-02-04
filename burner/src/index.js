const ethers = require('ethers')

if(window.opener) {
  window.opener.postMessage('loaded', '*')
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if(event.data && event.data.command === 'sign') {
    postDetails(event)
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
    let wallet = new ethers.Wallet(pk)

    wallet.signMessage(`login-with-burner:${event.data.challenge}`).then(signature => {
      event.source.postMessage({command: 'signed', signature: signature, address: wallet.address}, '*')
      window.close()
    })
  })
}
