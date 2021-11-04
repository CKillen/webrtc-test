const webrtc = require("wrtc"); // The wrtc module ( npm i wrtc )
const express = require("express");
const path = require("path");
const { EventEmitter } = require("stream");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")))

// const client = new RTCPeerConnection();
// const mainChannel = client.createDataChannel("mainChannel");

const test = new EventEmitter();
let state = "a";

app.post('/connect', async ({ body }, res) =>
{
  const peer = new webrtc.RTCPeerConnection();
  console.log('Connecting to client...');
  peer.ondatachannel = handleChannel;

  await peer.setRemoteDescription(new webrtc.RTCSessionDescription(body.sdp));
  await peer.setLocalDescription(await peer.createAnswer());
  return res.json({ sdp: peer.localDescription });
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.listen(3000);

function handleChannel({ channel })
{
  channel.addEventListener("message", ({ data }) => {
    state = state + data;
    test.emit("stateChange")
    // Parse and Pass data to all clients
  });
  
  test.on("stateChange", () => {
    channel.send(state)
  });
  // Can use the channel to send data to client.
  channel.send("Hi from server");
}