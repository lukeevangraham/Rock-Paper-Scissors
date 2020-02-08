var firebaseConfig = {
  apiKey: "AIzaSyApARaG4dQ6kg0CnWINSV__6igSAM_-2zo",
  authDomain: "rps-multiplayer-c382d.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-c382d.firebaseio.com",
  projectId: "rps-multiplayer-c382d",
  storageBucket: "rps-multiplayer-c382d.appspot.com",
  messagingSenderId: "594948703359",
  appId: "1:594948703359:web:ba2272396b72f81706eb4a",
  measurementId: "G-EYJVCCKSXX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
let playersRef = database.ref("players");

let currentPlayers;
let username;
let playerOne;
let playerTwo;
let playerNum;
let playerOneExists;
let playerTwoExists;
let playerOneData;
let playerTwoData;

playersRef.on("value", function(snapshot) {
  // console.log("LOOK HERE: ", snapshot.numChildren());

  currentPlayers = snapshot.numChildren();

  playerOneExists = snapshot.child("1").exists();
  playerTwoExists = snapshot.child("2").exists();

  playerOneData = snapshot.child("1").val();
  playerTwoData = snapshot.child("2").val();

  playerOneExists
    ? ($(`#playerOne`).text(playerOneData.name),
      $(`#playerOneScores`).text(
        `Wins : ` + playerOneData.wins + ` Losses: ` + playerOneData.losses
      ))
    : $(`#playerOne`).text("Waiting for Player 1");
  playerTwoExists
    ? ($(`#playerTwo`).text(playerTwoData.name),
      $(`#playerTwoScores`).text(
        `Wins : ` + playerTwoData.wins + ` Losses: ` + playerTwoData.losses
      ))
    : $(`#playerTwo`).text("Waiting for Player 2");

  if (playerOneData.choice && playerTwoData.choice) {
    compareChoices();
  }

  if (playerOneExists && playerTwoExists) {
    // console.log("LETS PLAY A GAME!");
    initiateTurn();
  }
});

// playersRef.on("child_added", function(snapshot) {

//   $(`#playerOne`).text(snapshot.val().name)
// })

$(`#nameSubmit`).click(function(form) {
  // console.log($(`#username`).val());
  username = $(`#username`).val();
  joinGame();
});

function joinGame() {
  if (!playerOneExists) {
    playerNum = 1;
    // playerOne = {name: $(`#username`).val(), wins: 0, losses: 0, choice: null}
  } else if (!playerTwoExists) {
    playerNum = 2;
  }

  playerRef = database.ref("/players/" + playerNum);

  playerRef.set({
    name: $(`#username`).val(),
    wins: 0,
    losses: 0,
    choice: ""
  });

  $(`#belowJumbo`).replaceWith(
    `<div class="row"><div class="col-12 text-center m-3">Hi ` +
      username +
      `!  You are Player ` +
      playerNum +
      `</div></div>`
  );

  playerRef.onDisconnect().remove();
}

function initiateTurn() {
  if (!playerOneData.choice) {
    if (username === playerOneData.name) {
      $(`#playerOneChoices`).html(
        `<button onclick="processChoice('rock')">Rock</button><button onclick="processChoice('paper')">Paper</button><button onclick="processChoice('scissors')">Scissors</button>`
      );
    }
  } else if (!playerTwoData.choice) {
    if (username === playerTwoData.name) {
      $(`#playerTwoChoices`).html(
        `<button onclick="processChoice('rock')">Rock</button><button onclick="processChoice('paper')">Paper</button><button onclick="processChoice('scissors')">Scissors</button>`
      );
    }
  }
}

function processChoice(choice) {
  console.log("CHOICE: ", choice);
  playerRef = database.ref("/players/" + playerNum);

  playerRef.update({
    choice: choice
  });

  if (playerNum === 1) {
    $(`#playerOneChoices`).empty();
  } else if (playerNum === 2) {
    // $(`#playerTwoChoices`).empty();
  }
}

function playerTwoWins() {
  playerOneRef = database.ref("/players/" + 1)
  playerTwoRef = database.ref("/players/" + 2)

  playerOneRef.child("losses").set(playerOneData.losses + 1)
  playerTwoRef.child("wins").set(playerTwoData.wins + 1)
}

function compareChoices() {
  playerOneRef = database.ref("/players/" + 1);
  playerTwoRef = database.ref("/players/" + 2);
  $(`#playerOneChoices`).text(playerOneData.choice);
  $(`#playerTwoChoices`).text(playerTwoData.choice);
  console.log("PLAYER 2: ", playerTwoData);
  if (playerOneData.choice === "rock") {
    if (playerTwoData.choice === "rock") {
      $(`#stage`).text("TIE!");
    }
    if (playerTwoData.choice === "paper") {
      $(`#stage`).text(playerTwoData.name.toUpperCase() + " WINS");
      playerTwoWins();
    }
    if (playerTwoData.choice === "scissors") {
      $(`#stage`).text(playerOneData.name.toUpperCase() + " WINS");
    }
  } else if (playerOneData.choice === "paper") {
    if (playerTwoData.choice === "rock") {
      $(`#stage`).text(playerOneData.name.toUpperCase() + " WINS");
    }
    if (playerTwoData.choice === "paper") {
      $(`#stage`).text("TIE!");
    }
    if (playerTwoData.choice === "scissors") {
      $(`#stage`).text(playerTwoData.name.toUpperCase() + " WINS");
    }
  } else if (playerOneData.choice === "scissors") {
    if (playerTwoData.choice === "rock") {
      $(`#stage`).text(playerTwoData.name.toUpperCase() + " WINS");
    }
    if (playerTwoData.choice === "paper") {
      $(`#stage`).text(playerOneData.name.toUpperCase() + " WINS");
    }
    if (playerTwoData.choice === "scissors") {
      $(`#stage`).text("TIE!");
    }
  }
}
