import {Dapparatus} from 'dapparatus';
console.log('Dapparatus: ', Dapparatus);

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
    let pub = '0x7b96f6b21df98ac41f1b74e72a5f535dd4f52a74'
    let sig = 'Should actually sign the challenge'
    event.source.postMessage({command: 'signed', signature: sig, publicKey: pub}, '*')
    window.close()
  })
}
