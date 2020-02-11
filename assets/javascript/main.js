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
let chatData = database.ref("/chat");

let currentTurn = null;
let currentPlayers;
let username;
let playerOne;
let playerTwo;
let playerNum;
let playerOneExists;
let playerTwoExists;
let playerOneData;
let playerTwoData;
let firstTurn = true;

playersRef.on("value", function(snapshot) {
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
    : ($(`#playerOne`).text("Waiting for Player 1"),
      $(`#playerOneScores`).text(`Wins : 0 Losses: 0`),
      $(`#lowerBelowJumbo`).text(`Waiting for Player 1`)
      );
  playerTwoExists
    ? ($(`#playerTwo`).text(playerTwoData.name),
      $(`#playerTwoScores`).text(
        `Wins : ` + playerTwoData.wins + ` Losses: ` + playerTwoData.losses
      ))
    : ($(`#playerTwo`).text("Waiting for Player 2"),
    $(`#playerTwoScores`).text(`Wins : 0 Losses: 0`),
    $(`#lowerBelowJumbo`).text(`Waiting for Player 2`)
    );

    if (!playerOneExists && !playerTwoExists) {
      $(`#lowerBelowJumbo`).text(`Waiting for Players 1 & 2`)
    }

  if (playerOneData.choice && playerTwoData.choice) {
    compareChoices();
  }

  if (playerOneExists && playerTwoExists) {
    if (firstTurn) {
      // console.log("not waiting")
      initiateTurn();
    } else {
      // console.log("supposedly waiting")
      setTimeout(function() {
        initiateTurn();
      }, 3000);
    }
  }
});

$(`#nameSubmit`).click(function(form) {
  // console.log($(`#username`).val());
  // $(`#jumboP`).remove();
  // $(`#jumboHR`).remove();
  // username = $(`#username`).val();
  // joinGame();

  if ($(`#username`).val() != "") {
    processNameSubmission($(`#username`).val())
  }
});

$(`#username`).keypress(function(e) {
  if (e.which === 13 && $(`#username`).val() != "") {
    processNameSubmission($(`#username`).val())
  }
})

function processNameSubmission(nameEntered) {
  $(`#jumboP`).remove();
  $(`#jumboHR`).remove();
  username = nameEntered;
  joinGame();
}

function joinGame() {
  if (!playerOneExists) {
    playerNum = 1;
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
    `<div class="row"><div class="col-12 text-center" id="belowJumbo">Hi ` +
      username +
      `!  You are Player ` +
      playerNum +
      `</div></div>`
  );

  playerRef.onDisconnect().remove();

  chatData.onDisconnect().push({
    username: username,
    message: username + ` has disconnected`
  })
}

function initiateTurn() {
  $(`#playerOneChoices`).empty();
  $(`#playerTwoChoices`).empty();
  $(`#stage`).empty();
  if (!playerOneData.choice) {
    firstTurn = true;
    $(`#playerOneCard`).addClass("border border-warning");
    if (username === playerOneData.name) {
      $(`#playerOneChoices`).html(
        `<button class="btn btn-warning m-1" onclick="processChoice('rock')">Rock</button><button class="btn btn-warning m-1" onclick="processChoice('paper')">Paper</button><button class="btn btn-warning m-1" onclick="processChoice('scissors')">Scissors</button>`
      );
      $(`#lowerBelowJumbo`).text(`It's your turn.`);
    } else {
      $(`#lowerBelowJumbo`).text(
        `Waiting for ` + playerOneData.name + ` to choose.`
      );
    }
  } else if (!playerTwoData.choice) {
    $(`#playerOneCard`).removeClass("border border-warning");
    $(`#playerTwoCard`).addClass("border border-warning");
    if (username === playerTwoData.name) {
      $(`#playerTwoChoices`).html(
        `<button class="btn btn-warning m-1" onclick="processChoice('rock')">Rock</button><button class="btn btn-warning m-1" onclick="processChoice('paper')">Paper</button><button class="btn btn-warning m-1" onclick="processChoice('scissors')">Scissors</button>`
      );
      $(`#lowerBelowJumbo`).text(`It's your turn.`);
    } else {
      $(`#lowerBelowJumbo`).text(
        `Waiting for ` + playerTwoData.name + ` to choose.`
      );
    }
  }
}

function processChoice(choice) {
  playerRef = database.ref("/players/" + playerNum);

  playerRef.update({
    choice: choice
  });

  if (playerNum === 1) {
    $(`#playerOneChoices`).empty();
  } else if (playerNum === 2) {
  }
}

function playerOneWins() {
  playerOneData.wins++;
  playerTwoData.losses++;
}

function playerTwoWins() {
  playerOneData.losses++;
  playerTwoData.wins++;
}

function compareChoices() {
  $(`#lowerBelowJumbo`).empty();
  firstTurn = false;
  $(`#playerOneCard`).removeClass(`border border-warning`);
  $(`#playerTwoCard`).removeClass(`border border-warning`);
  playerOneRef = database.ref("/players/" + 1);
  playerTwoRef = database.ref("/players/" + 2);
  $(`#playerOneChoices`).text(playerOneData.choice.toUpperCase());
  $(`#playerTwoChoices`).text(playerTwoData.choice.toUpperCase());
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
      playerOneWins();
    }
  } else if (playerOneData.choice === "paper") {
    if (playerTwoData.choice === "rock") {
      $(`#stage`).text(playerOneData.name.toUpperCase() + " WINS");
      playerOneWins();
    }
    if (playerTwoData.choice === "paper") {
      $(`#stage`).text("TIE!");
    }
    if (playerTwoData.choice === "scissors") {
      $(`#stage`).text(playerTwoData.name.toUpperCase() + " WINS");
      playerTwoWins();
    }
  } else if (playerOneData.choice === "scissors") {
    if (playerTwoData.choice === "rock") {
      $(`#stage`).text(playerTwoData.name.toUpperCase() + " WINS");
      playerTwoWins();
    }
    if (playerTwoData.choice === "paper") {
      $(`#stage`).text(playerOneData.name.toUpperCase() + " WINS");
      playerOneWins();
    }
    if (playerTwoData.choice === "scissors") {
      $(`#stage`).text("TIE!");
    }
  }

  database.ref().update({
    "players/1/wins": playerOneData.wins,
    "players/1/losses": playerOneData.losses,
    "players/1/choice": null,
    "players/2/wins": playerTwoData.wins,
    "players/2/losses": playerTwoData.losses,
    "players/2/choice": null
  });
}

$(`#chat-send`).click(function() {
  submitMessage(username, $(`#chat-input`).val())
})

// enter submits message
$(`#chat-input`).keypress(function(e) {
  if (e.which === 13 && $(`#chat-input`).val() != "") {
    submitMessage(username, $(`#chat-input`).val())
  }
})

function submitMessage(username, message) {
  chatData.push({
    username: username ? username : 'Guest',
    message: $(`#chat-input`).val()
  })
  $(`#chat-input`).val(null);
}

// function checkSubmit(e) {
//   if(e && e.keyCode == 13) {
//     document.forms[0].submit();
//   }
// }

chatData.on('child_added', function (data) {
  $(`#chat-messages`).append(`<p class="chat-message mb-0">` + data.val().username + `: ` + data.val().message + `</p>`)

  // keeps Div scrolled to bottom on each update
  $(`#chat-messages`).scrollTop($(`#chat-messages`)[0].scrollHeight);
})
