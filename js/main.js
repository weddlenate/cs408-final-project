//Sign up and login functionality
const showSignUp = document.getElementById("showSignUp");
const showLogIn = document.getElementById("showLogIn");
const signUpButton = document.getElementById("signUpButton");
const logInButton = document.getElementById("logInButton");

const signUpScreen = document.getElementById("signUpScreen");
const logInScreen = document.getElementById("logInScreen");

const signUpUserName = document.querySelector("#signUpUserName");
const logInUserName = document.querySelector("#logInUserName");

showSignUp.onclick = function () {
  signUpScreen.style.display = "block";
  logInScreen.style.display = "none";
}

let signUpUserNameValue;

signUpButton.onclick = function () {
  let xhr = new XMLHttpRequest();

  signUpUserNameValue = signUpUserName.value;
  signUpUserName.value = '';
  //Sends request with user inputs
  xhr.open("PUT", "https://7p6ec3iwhf.execute-api.us-east-2.amazonaws.com/items");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({
      "id": signUpUserNameValue,
      "time": "00:00",
      "lines": 0,
      "score": 0,
      "singles": 0,
      "doubles": 0,
      "triples": 0,
      "tetrises": 0
  }));

  signUpScreen.style.display = "none";
  alert("Sign Up Success! Now you can login");
}

showLogIn.onclick = function () {
  logInScreen.style.display = "block";
  signUpScreen.style.display = "none";
}

let logInUserNameValue;
var username = null;

logInButton.onclick = function () {
  

  logInUserNameValue = logInUserName.value;
  logInUserName.value = '';

  //Updates the table using the populateTable() function
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function () {
      const dataText = xhr.response;
      const data = JSON.parse(dataText);

      for (const item of data) {
        if (item.id === logInUserNameValue) {
          username = logInUserNameValue;
        }
      }

      if (username !== logInUserNameValue) {
        alert("Log in failed! Provided username does not appear in the database. Please enter a valid username or sign up with your desired username.");
      } else {
        localStorage.setItem('username', JSON.stringify(username))
        document.getElementById("userinfo").textContent = "Logged in as: " + username;
        alert("Log in success!");
      }
  });
  xhr.open("GET", "https://7p6ec3iwhf.execute-api.us-east-2.amazonaws.com/items");
  xhr.send();

  logInScreen.style.display = "none";
}

