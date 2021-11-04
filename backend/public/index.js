const peer = new RTCPeerConnection();
const sendChannel = peer.createDataChannel("sendChannel");
const clickme = document.getElementById("clickme");
const text = document.getElementById("text");

sendChannel.onmessage = ({ data }) => 
{
  console.log("here", data);
  // Do something with received data.
};


peer.onnegotiationneeded = initChannel;

async function initChannel()
{
  console.log(peer);
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  console.log(peer.localDescription);

  // Send offer and fetch answer from the server
  const { sdp } = await fetch("http://localhost:3000/connect", { 
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({ sdp: peer.localDescription }),
  })
    .then(res => res.json())
    .catch(err => console.log(err))

  peer.setRemoteDescription(new RTCSessionDescription(sdp));
}

clickme.addEventListener("click", bc);

function bc() {
  console.log(text.value);
  sendChannel.send(text.value);
}