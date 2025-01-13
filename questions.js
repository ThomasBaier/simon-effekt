// Import the functions you need from the SDKs you need
/* import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; */
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { main } from "/index.js";

/* import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
import { collection, getDocs, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
import { query, orderBy, limit, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
 */
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyARMZzblzzsXzmI6w75cTqI6GED0sv9NuA",
    authDomain: "simon-effekt.firebaseapp.com",
    projectId: "simon-effekt",
    storageBucket: "simon-effekt.appspot.com",
    messagingSenderId: "262919573511",
    appId: "1:262919573511:web:be4ab9c5aeeec9de825aa2",
    measurementId: "G-24EKS3DDVS",
  },
  app = initializeApp(firebaseConfig);
const forwardBtn = document.getElementById("forwardBtn"),
  backwardBtn = document.getElementById("backwardBtn");

forwardBtn.addEventListener("click", () => forwardBackward(true));
backwardBtn.addEventListener("click", () => forwardBackward(false));

var questions,
  questionNumber = 0,
  questionDiv = document.getElementById("questionDiv"),
  qNumber = document.getElementById("qNumber");
questionDiv.style.height = 300;
qNumber.innerText = "0 / 20";

document.getElementById("ques").addEventListener("click", () => {
  document.getElementById("questionForm").style.display = "block";
  document.getElementById("exp").style.display = "none";
});

loadQuestions();

window.addEventListener("keyup", function (event) {
  if (event.key === "ArrowRight") {
    forwardBackward(true);
  } else if (event.key === "ArrowLeft") {
    forwardBackward(false);
  }
});

async function loadJson() {
  return await fetch("./questions.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      questions = data;
      return data;
    })
    .catch((error) => console.log(error));
}

async function loadQuestions() {
  questions = await loadJson();
  questionDiv.innerHTML = questions.questions[0].question;

  document.getElementById("popup-headline").innerHTML = questions.popup.headline;
  document.getElementById("popup-text").innerHTML = questions.popup.text;
  document.getElementById("base").style.filter = "blur(10px)";

  document.getElementById("popup-checkbox").addEventListener("change", function () {
    if (this.checked) {
      document.getElementById("popup").style.display = "none";
      document.getElementById("base").style.filter = "";
    }
  });

  //  TODO: delete before push
  document.getElementById("popup").style.display = "none";
  document.getElementById("base").style.filter = "";
}
function forwardBackward(forward = true) {
  /**
   * nur wenn 19 fragen
   * gibt es offene fragen?
   *  wenn nein dann window data setzen
   *  else antwort setzen
   */
  /*   if (forward && questionNumber >= questions.questions.length - 1) {
    // show left overs
    const openQustion = questions.questions.find((el) => el.res === undefined && el.type !== "none");
    if (openQustion === undefined) {
      document.getElementById("questionForm").style.display = "none";
      document.getElementById("exp").style.display = "block";

    } else {
      questionDiv.innerHTML = openQustion.question;
      addAnswer(openQustion);
      // qNumber.innerText = (questionNumber + 1).toString() + " / " + questions.questions.length.toString();
    }
  } */
  if (forward && questionNumber < questions.questions.length - 1) {
    questionNumber++;
  } else if (questionNumber > 0 && forward == false) {
    questionNumber--;
  } else if (forward && questionNumber == questions.questions.length - 1) {
    window.data.exp0 = questions.questions;
    window.expNumber = 0;
    main();
  }
  questionDiv.innerHTML = questions.questions[questionNumber].question;
  addAnswer(questions.questions[questionNumber]);
  qNumber.innerText = (questionNumber + 1).toString() + " / " + questions.questions.length.toString();
}
function addAnswer(questionObj) {
  let output;
  switch (questionObj.type) {
    case "none":
      output = "";
      break;
    case "distance":
      output = '<div class="v-counter">' + '<input type="button" id="minusBtn"  value=" - " />' + '<input type="text" value="93" size="7" id="dpi" name="dpi" min="0" required onchange="change()"/><span style="margin-left:-50px;">dpi</span>' + '<input type="button" id="plsBtn"  value=" + " />' + "</div> <br>" + '<div class="container" style="padding-left: 20px;">' + '<div class="start bigFont" >| Anfang</div>' + '<div class="cm10 bigFont" id="cm10" style="left: 366px;" >| 10 cm</div>' + '<div class="cm21 bigFont" id="cm21" style="left: 768px;" >| 21 cm = A4 Seitenbreite</div>';

      +"</div><br>";

      break;
    case "radio":
      output = createRadionBtns(questionObj, "setResult", "nextQuestion");
      break;
    case "number":
      output = '<p>Ihre Antwort:</p><input type="tel" id="number" name="w" min="0" required></input>';
      break;
    case "slider":
      output = '<input type="range" id="slider" name="hobbyaccuracy" min="1" max="5" value="1" oninput="this.nextElementSibling.value = this.value"><output>1</output>';
      break;
    case "text":
      output = '<p>Ihre Antwort</p><textarea id="text" name="w" rows="4" cols="50"></textarea>';
      break;
  }
  document.getElementById("answer").innerHTML = output;

  switch (questionObj.type) {
    case "radio":
      for (let i = 0; i < questionObj.options.de.length; i++) {
        document.getElementById(i).addEventListener("click", () => setResult(true, i, "radio"));
        if (questionObj.res && questionObj.res[0] === i) {
          document.getElementById(i).checked = true;
        }
      }
      break;
    case "distance":
      document.getElementById("plsBtn").addEventListener("click", () => {
        const dpiValue = +document.getElementById("dpi").value;
        document.getElementById("dpi").value = dpiValue + 1;
        questions.questions[questionNumber].res = dpiValue + 1;
        change();
      });
      document.getElementById("minusBtn").addEventListener("click", () => {
        const dpiValue = +document.getElementById("dpi").value;
        document.getElementById("dpi").value = dpiValue - 1;
        questions.questions[questionNumber].res = dpiValue - 1;
        change();
      });
      if (questionObj.res) {
        document.getElementById(i).checked = true;
      }
      if (window.devicePixelRatio !== 1) {
        alert("Ihr Browserzoom liegt bei: " + window.devicePixelRatio * 100 + "% bitte ändern Sie diesen auf 100% für den Rest des Experiments.");
      }
      break;
    case "slider":
      document.getElementById("slider").addEventListener("click", () => {
        questions.questions[questionNumber].res = document.getElementById("slider").value;
      });
      if (questionObj.res) {
        document.getElementById("slider").value = questionObj.res;
      }
      break;
    case "number":
      const num = document.getElementById("number");
      num.addEventListener("keyup", () => {
        questions.questions[questionNumber].res = num.value;
      });
      if (questionObj.res) {
        num.value = questionObj.res;
      }
      num.focus();
      num.select();

      break;
    case "text":
      const txt = document.getElementById("text");
      txt.addEventListener("keyup", () => {
        questions.questions[questionNumber].res = txt.value.replaceAll("\n", "");
      });
      if (questionObj.res) {
        txt.value = questionObj.res;
      }
      txt.select();
      txt.focus();
      break;
  }
}
function change() {
  let distance = document.getElementById("dpi").value;
  const cm10 = document.getElementById("cm10");
  const cm21 = document.getElementById("cm21");
  distance = (distance * 10) / 2.54; // dpi to pixel pro 10 cm
  console.log("distance", distance);
  cm10.style.left = distance + "px"; // *3.77+"px";
  cm21.style.left = distance * 2.1 + "px";
}
function setResult(next, id, type) {
  const result = id;
  switch (type) {
    case "radio":
      const choise = questions.questions[questionNumber].options.de[result];
      console.log(choise);
      questions.questions[questionNumber].res = [result, choise];
      break;
    case "slider":
  }

  if (next) {
    forwardBackward(true);
  }
}

function createRadionBtns(questionObj, functionName, name) {
  let output = "";

  for (let i = 0; i < questionObj.options.de.length; i++) {
    output += '<input id="' + i + '" type="radio" name="' + name + '">\n<label>' + questionObj.options.de[i] + "</label><br><br>";
  }

  return output;
}

function createNumberInput(id) {
  return '<input type="number" id="' + id + '" name="age" min="0" required  oninvalid="this.setCustomValidity(<div data="fill"></div>)"><br><br>';
}
