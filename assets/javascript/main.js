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
  console.log("LOOK HERE: ", snapshot.numChildren());

  currentPlayers = snapshot.numChildren();

  playerOneExists = snapshot.child("1").exists();
  playerTwoExists = snapshot.child("2").exists();

  playerOneData = snapshot.child("1").val();
  playerTwoData = snapshot.child("2").val();

  playerOneExists ? $(`#playerOne`).text(playerOneData.name) : $(`#playerOne`).text("Waiting for Player 1");
  playerTwoExists ? $(`#playerTwo`).text(playerTwoData.name) : $(`#playerTwo`).text("Waiting for Player 2");;
});

// playersRef.on("child_added", function(snapshot) {

//   $(`#playerOne`).text(snapshot.val().name)
// })

$(`#nameSubmit`).click(function(form) {
  console.log($(`#username`).val());
  username = $(`#username`).val();
  joinGame();
});

function joinGame() {
  // $(`#playerOne`).text($(`#username`).val())
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
    choice: null
  });

  playerRef.onDisconnect().remove();
}
