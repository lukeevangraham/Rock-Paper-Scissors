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

let connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);

    con.onDisconnect().remove();
  }
})

// When first loaded or when the connections list changes
connectionsRef.on("value", function(snapshot) {
  $("#watchers").text(snapshot.numChildren());
})

// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// let playerOne = {}
// let playerTwo = {}

// const determinePlayerStatus = auth => {
//   console.log(auth);
//   console.log("ONE: ", playerOne)
//   console.log("TWO: ", playerTwo)
//   if (!playerOne.name) {
//       playerOne.name = auth.user.displayName;
//       console.log("LOOK HERE", playerOne)
//       connectionsRef.push(playerOne)
//   } else if (!playerTwo.name) {
//       playerTwo.name = auth.user.displayName;
//       connectionsRef.ref().push(playerTwo)
//   } else {
//       console.log("Too many players.  Only two players at a time")
//   }

// };

// const handleChild = childSnapshot => {
//     console.log("LOOK HERE: ", childSnapshot.val())
//     determinePlayerStatus(childSnapshot.val().name)
//     playerOne.name ? ($(`#playerOne`).append(`<div>` + playerOne.name + `</div>`)) : ''
//     playerTwo.name ? ($(`#playerTwo`).append(`<div>` + playerOne.name + `</div>`)) : ''
// }

// var uiConfig = {
//   callbacks: {
//     signInSuccessWithAuthResult: function(authResult, redirectUrl) {
//       // User successfully signed in.
//       // Return type determines whether we continue the redirect automatically
//       // or whether we leave that to developer to handle.
//       console.log(authResult);
//       determinePlayerStatus(authResult);
//       return false;
//     },
//     uiShown: function() {
//       // The widget is rendered.
//       // Hide the loader.
//       document.getElementById("loader").style.display = "none";
//     }
//   },
//   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: "popup",
//   // signInSuccessUrl: '<url-to-redirect-to-on-success>',
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.GithubAuthProvider.PROVIDER_ID
//   ]
//   // Terms of service url.
//   // tosUrl: '<your-tos-url>',
//   // Privacy policy url.
//   // privacyPolicyUrl: '<your-privacy-policy-url>'
// };

// // The start method will wait until the DOM is loaded.
// ui.start("#firebaseui-auth-container", uiConfig);

// function userUnloading() {
//     alert("are you sure?")
// }

// database.ref().on("child_added", function(childSnapshot) {
//     handleChild(childSnapshot)
// })