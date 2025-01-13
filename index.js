import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, addDoc, getDocs, doc, collection, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
// import { cloneDeep } from "/lodash.js";
// import * as _ from "lodash";

import { exp1 } from "/exp1.js";
import { exp2 } from "/exp2.js";
import { exp3 } from "/exp3.js";
import { exp4 } from "/exp4.js";
import { exp5 } from "/exp5.js";
import { exp7 } from "/exp7.js";
import { exp7a } from "/exp7a.js";
import { exp9 } from "/exp9.js";
import { exp10 } from "/exp10.js";

const firebaseConfig = {
    apiKey: "AIzaSyARMZzblzzsXzmI6w75cTqI6GED0sv9NuA",
    authDomain: "simon-effekt.firebaseapp.com",
    projectId: "simon-effekt",
    storageBucket: "simon-effekt.appspot.com",
    messagingSenderId: "262919573511",
    appId: "1:262919573511:web:be4ab9c5aeeec9de825aa2",
    measurementId: "G-24EKS3DDVS",
  },
  app = initializeApp(firebaseConfig),
  db1 = getFirestore(app),
  users = collection(db1, "users"),
  userId = document.getElementById("userId"),
  startBtn = document.getElementById("startExp"),
  downloadJson = document.getElementById("download"),
  csvDownload = document.getElementById("csvDownload"),
  hello = document.getElementById("hello"),
  score = document.getElementById("score");

window.data = {};
window.dataBackup;
window.id = "";
window.expShort = false;
window.expNumber = 0;

window.points = {
  sum: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  71: 0,
  8: 0,
  9: 0,
  10: 0,
};

startBtn.addEventListener("click", () => {
  console.log("test1");
  startBtn.style.display = "none";
  window.expNumber = 0;
  main();
});
downloadJson.addEventListener("click", () => {
  downloadJson1();
});
csvDownload.addEventListener("click", () => {
  csvDownload1();
});

async function createId() {
  try {
    let id = moment().format("DDMMYY HHmmss"),
      docRef = doc(db1, "users", id),
      docSnap = await getDoc(docRef),
      x = 0;
    while (docSnap.exists()) {
      x++;
      docRef = doc(db1, "users", id + x);
      docSnap = await getDoc(docRef);
    }
    if (x > 0) {
      id = id + x;
    }
    // Set id
    userId.innerHTML = "Experiment-Id: " + id;
    window.id = id;

    // await setDoc(doc(users, window.id), { start: 1 });
  } catch (e) {
    console.error("Error creating id: ", e);
  }
}

window.load = async function () {
  createId();

  const tparams = {};

  location.search
    .slice(1)
    .split("&")
    .forEach(function (pair) {
      pair = pair.split("=");
      tparams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    });

  window.expShort = Boolean(tparams.short) || false;
  console.log("Experiments are loaded in short: ", Boolean(tparams.short));
};
window.load();

async function downloadJson1() {
  const p = prompt("Enter your password");
  // console.log(CryptoJS.enc.Base64.parse("aGFuZA==").toString(CryptoJS.enc.Utf8));
  if (p === CryptoJS.enc.Base64.parse("aGFuZA==").toString(CryptoJS.enc.Utf8)) {
    let res = {};
    const querySnapshot = await getDocs(collection(db1, "users"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, JSON.stringify(doc.data(), null, " "));
      let d = doc.data();
      if (
        Object.keys(d).some(function (k) {
          return ~k.indexOf("exp");
        })
      ) {
        // d = Object.assign({ _id: doc._document.key.path.segments[6] }, d);
        res[doc._document.key.path.segments[6]] = d;
      }
    });
    /*     const arr = [1, 2, 3, 4, 5, 7, 71, 9, 10]; // TODO: 0 == fragen!
    let file = "{\n";
    res.forEach((id, y) => {
      file += file += '"' + id + '":\n {\n';
      arr.forEach((e, z) => {
        if (typeof res[id]["exp" + e] !== "undefined") {
          file += '"exp' + e + '":';
          file += JSON.stringify(res[id]["exp" + e], null, " ") + ",\n";
        }
      });
      // remove the last comma
      file += "},";
      i++;
    });
    // remove the last comma
    file += "}"; */
    let file = JSON.stringify(res, null, " ");
    console.log("file:", file);
    download("seResults.json", file);
  }
}

async function csvDownload1() {
  const p = prompt("Enter in the password");
  console.log(CryptoJS.enc.Base64.parse("aGFuZA==").toString(CryptoJS.enc.Utf8));
  if (p === CryptoJS.enc.Base64.parse("aGFuZA==").toString(CryptoJS.enc.Utf8)) {
    let csv = [[]],
      res = {},
      i = 0;
    const querySnapshot = await getDocs(collection(db1, "users"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, JSON.stringify(doc.data(), null, " "));
      let d = doc.data();
      if (
        Object.keys(d).some(function (k) {
          return ~k.indexOf("exp");
        })
      ) {
        // d = Object.assign({ _id: doc._document.key.path.segments[6] }, d);
        res[doc._document.key.path.segments[6]] = d;
      }
    });
    const arr = [1, 2, 3, 4, 5, 7, 71, 9, 10]; // TODO: 0 == fragen!

    for (let id in res) {
      // FOR EACH USER
      csv[i].push(id);
      arr.forEach((e) => {
        if (typeof res[id]["exp" + e] !== "undefined") {
          csv[i].push(e);
          res[id]["exp" + e].forEach((item) => {
            // Reaktionszeiten, Fehlreaktionen und möglichen Auslasser
            //if ((!window.expShort && !item?.test) || window.expShort) {
            let test = item?.test ? "T" : "",
              length = item?.length,
              time = item?.time,
              left = item?.left === undefined ? "" : item?.left ? "L" : "R", // Nicht bei 4, 7, 9, 10
              komp = item?.komp === undefined ? "" : item?.komp ? "k" : "ik", // Nicht bei 4, 7, 9, 10
              isHuman = item?.komp === undefined ? "" : item?.isHuman ? "M" : "R", // MASCHIENE ODER ROBOTER?,
              state = "";

            if (item?.time < 2000 && item?.success && isHuman === "M") {
              state = "S";
            } else if (isHuman === "R" || item?.time > 2000) {
              state = "A";
            } else if (!item?.success) {
              state = "F";
            }

            csv[i].push(length + test + state + time + left + komp);
          });
        }
      });
      i++;
      csv.push([]);
    }

    let csvContent = "";

    csvContent += csv.map((e) => e.join(",")).join("\n");

    download("seResults.csv", csvContent);
  }
}

function download(filename, text) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

window.saveData = async function (data) {
  let docRef = doc(db1, "users", window.id),
    docSnap = await getDoc(docRef);
  try {
    await setDoc(doc(users, window.id), data);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

function nextWithW(expNumber) {
  let discription;
  switch (expNumber) {
    case 1:
      discription = '<b>Erklärung Exp1:</b> Betätigen Sie so schnell und richtig Sie können die Tasten <br>  "A"- für Pfeil nach Links, <br> "L" für Pfeil nach Rechts';
      break;
    case 2:
      discription = '<b>Erklärung Exp2:</b> Drücken Sie die Taste <br> "A" für tiefe Töne und die Taste  "L" für hohe Töne <br> unabhängig, ob die Töne links oder rechts abgespielt werden.';
      break;
    case 3:
      discription = "";
      break;
    case 4:
      discription = "";
      break;
    case 5:
      discription = "";
      break;
    case 6:
    /* Zahlen Nachsprechen vorwärts und rückwärts
      Das ‚Zahlen nachsprechen‘ aus dem „Wechsler Adult Intelligence Scales - Revision IV
      (Deutsche Adaption)-(WAIS-IV)“ (Petermann, 2012) ist dem Arbeitsgedächtnis zuzuordnen. In
      der Durchführung werden zunächst Zahlenfolgen in unterschiedlicher Länge von 2 bis 8 in der
      mündlich vorgetragen und sollen von den Testpersonen nachgesprochen werden. Bei Zahlen
      rückwärts geschieht dies ebenfalls mit Zahlenfolgen von 2 bis 8, nur das die vorgesprochenen
      Zahlen anschließend rückwärts wiedergegeben werden sollen. Sowohl vorwärts als auch
      rückwärts werden zwei Durchgänge angeboten. Aus den insgesamt vier Vorgängen (2 x
      vorwärts und 2x rückwärts) wird für jede vollständig richtig wiedergegeben Zahlenfolge einPunkt gegeben. Insgesamt können maximal 20 Punkte erreicht werden. Der Gesamtscore wird
      für die Berechnungen herangezogen. */
    case 7: // 1-back!
      discription = "";
      break;
    case 71:
      discription = "";
      break;
    case 8:
      break;
    case 9:
      discription = "";
      break;
    case 10:
      discription = "";
      break;

    default:
      break;
  }
  document.getElementById("description").innerHTML = discription;

  return new Promise((resolve) => {
    const arrow21 = document.getElementById("arrow21");
    const arrow20 = document.getElementById("arrow20");
    const arrow22 = document.getElementById("arrow22");
    arrow21.style.fontSize = "4vh";
    arrow21.style.color = "black";
    arrow20.innerHTML = "";
    arrow22.innerHTML = "";
    document.addEventListener("keydown", onKeyHandler);
    if (expNumber === 11) {
      arrow21.innerHTML = "Glückwunsch!\nAlle Experimente erfolgreich abgeschlossen.";
      score.innerHTML = window.points["sum"];
    } else {
      arrow21.innerHTML = "Weiter geht es mit Experiment " + expNumber + '/10.\n Erklärung steht unten \n Drücken Sie "w" für Weiter';
      score.innerHTML = window.points["sum"];
    }
    async function onKeyHandler(e) {
      if ((e.key === "w" && window.expNumber === 0) || (e.key === "W" && window.expNumber === 0)) {
        // weiter mit w
        arrow20.innerHTML = "";
        arrow21.innerHTML = "";
        arrow22.innerHTML = "";

        arrow21.style.fontSize = "7vh";
        arrow21.style.color = "black";
        arrow21.innerHTML = "2s";
        await sleep(1000);
        arrow21.innerHTML = "1s";
        await sleep(1000);
        arrow21.innerHTML = "";
        score.innerHTML = 0;
        resolve();
      }
    }
  });
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function uu(t) {
  return typeof t === "undefined" ? null : t;
}
export function addPonts(exp, isCorrect, ms) {
  if (ms > 2000) {
    ms = 2000;
  }

  let addOrSub = isCorrect && ms > 130 ? 1 : -0.5;
  let points = Math.round(((2000 - ms) / 2000) * 10 * addOrSub) + 1;

  window.points[exp] += points;
  window.points["sum"] += points;
  score.style.color = points < 0 ? "red" : points == 0 ? "yellow" : "lightgreen";
  score.innerHTML = window.points[exp];
  return points;
}

export async function main(exp) {
  hello.style.display = "none";
  let x,
    arr = [1, 2, 3, 4, 5, 7, 71, 9, 10, 11]; // TODO: 0 == fragen!

  if (exp === undefined) {
    for (x = 0; x < arr.length; x++) {
      if (window.data["exp" + arr[x]] === undefined) {
        exp = arr[x];
        break;
      }
    }
  }

  // Save data
  //if (typeof window.dataBackup !== "undefined" && JSON.stringify(window.data) !== JSON.stringify(window.dataBackup)) {
  // TRANSITION TO SET DATA
  if (x > 0) {
    await window.saveData(window.data); // TODO: Load data by id..
    console.log("saved..", window.data);
  }

  await nextWithW(exp);

  switch (exp) {
    case 0:
      document.getElementById("questionForm").style.display = "block";
      document.getElementById("exp").style.display = "none";
      break;
    case 1:
      Object.create(exp1).init();
      break;
    case 2:
      Object.create(exp2).init();
      break;
    case 3:
      Object.create(exp3).init();
      break;
    case 4:
      Object.create(exp4).init();
      break;
    case 5:
      Object.create(exp5).init();
      break;
    // case 6:  Object.create(exp6).init(); break;
    case 7:
      Object.create(exp7).init();
      break;
    case 71:
      Object.create(exp7a).init();
      break;
    // case 8:  Object.create(exp8).init(); break;
    case 9:
      Object.create(exp9).init();
      break;
    case 10:
      Object.create(exp10).init();
      break;
  }
}
window.dist1 = function (exp) {
  let distance = 93;
  //  document.getElementById("c1")?.style.display = "block";
  // document.getElementById("c2").style.display = "block";
  //  document.getElementById("c3")?.style.display = "block";

  const arrow10 = document.getElementById("arrow10");
  const arrow11 = document.getElementById("arrow11");
  const arrow12 = document.getElementById("arrow12");
  const arrow20 = document.getElementById("arrow20");
  const arrow21 = document.getElementById("arrow21");
  const arrow22 = document.getElementById("arrow22");
  const arrow30 = document.getElementById("arrow30");
  const arrow31 = document.getElementById("arrow31");
  const arrow32 = document.getElementById("arrow32");

  for (let y = 1; y <= 3; y++) {
    for (let x = 0; x <= 2; x++) {
      if (window["arrow" + y + x]) {
        // TODO TH!
        // window["arrow" + y + x].innerHTML = "";
        // window["arrow" + y + x].style.color = "white";
      }
    }
  }

  // BERECHNUNG FÜR PFEIL ABSTAND!
  distance = (distance * 10) / 2.54; // dpi to pixel pro 10 cm
  console.log("distance", distance);

  /*   arrow10.style.marginLeft = 0 + "px";
  arrow11.style.marginLeft = distance + "px";
  arrow12.style.marginLeft = distance + "px";
  arrow20.style.marginLeft = 0 + "px";
  arrow21.style.marginLeft = distance + "px";
  arrow22.style.marginLeft = distance + "px";
  arrow30.style.marginLeft = 0 + "px";
  arrow31.style.marginLeft = distance + "px";
  arrow32.style.marginLeft = distance + "px"; */
};

window.dist1();

var els = document.querySelectorAll("a");

for (var i = els.length; i--; ) {
  els[i].addEventListener("click", function () {
    // close your menu here
    document.getElementById("menuCheckbox").click();
  });
}
