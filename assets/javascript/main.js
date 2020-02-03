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

  // Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log(authResult)
        return false;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    // signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    // tosUrl: '<your-tos-url>',
    // Privacy policy url.
    // privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  // The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);