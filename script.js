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
let isSocketConnected = false,
  myName = "";

function getRandomColor() {
  return arrayOfColors[Math.floor(Math.random() * arrayOfColors.length)];
}

for (let i = 0; i < tableCells.length; i++) {
  tableCells[i].addEventListener("click", function (Event) {
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

let myBlocksColored = 0;

function renderMessage(message) {
  console.log("Received message: ", message);

  myBlocksColored = 0;

  if (message.type === "userEnter") {
    for (let Cell of tableCells) {
      Cell.style.backgroundColor = "white";
    }
    myName = prompt("Your name");
    console.log(myName);
  } else if (message.type === "win") {
    const div = document.createElement("div");
    div.innerHTML = `The user of color <span id ="span">${message.color}</span>, ${message.user} is winner`;
    document.getElementById("div").append(div);
    document.getElementById("span").style.color = message.color;
    socket.close();
    console.log("win");
  } else {
    tableCells[message.cellId].style.backgroundColor = message.color;
    for (let Cell of tableCells) {
      if (Cell.style.backgroundColor === myColor) {
        myBlocksColored++;
      }
    }
    if (myBlocksColored == 20) {
      sendMessage({
        type: "win",
        color: myColor,
        user: myName,
      });
    }
  }
}

function sendMessage(message) {
  if (isSocketConnected) {
    socket.send(JSON.stringify(message));
  } else {
    console.log("WARNING: We are not connected to the WebSocket yet");
  }
}
