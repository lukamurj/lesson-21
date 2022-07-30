const socket = new WebSocket("ws://ucha.ge:8080"),
  arrayOfColors = [
    "green",
    "yellow",
    "blue",
    "violet",
    "red",
    "azure",
    "burlywood",
    "greenyellow",
    "gray",
    "antiquewhite",
  ],
  myColor = getRandomColor(),
  tableCells = document.getElementsByTagName("td");
let isSocketConnected = false;

function getRandomColor() {
  return arrayOfColors[Math.floor(Math.random() * arrayOfColors.length)];
}

for (let i = 0; i < tableCells.length; i++) {
  tableCells[i].addEventListener("click", function () {
    console.log(Event);
    changeCellColor(myColor, i);
  });
}

function changeCellColor(color, id) {
  sendMessage({
    cellId: id,
    color: color,
  });
}

socket.addEventListener("open", function () {
  isSocketConnected = true;
  sendMessage({
    type: "userEnter",
  });
});

socket.addEventListener("message", function (event) {
  renderMessage(JSON.parse(event.data));
});

function renderMessage(message) {
  console.log("Received message: ", message);

  if (message.type === "userEnter") {
    for (let Cell of tableCells) {
      Cell.style.backgroundColor = "white";
    }
  } else {
    tableCells[message.cellId].style.backgroundColor = message.color;
  }
}

function sendMessage(message) {
  if (isSocketConnected) {
    socket.send(JSON.stringify(message));
  } else {
    console.log("WARNING: We are not connected to the WebSocket yet");
  }
}
