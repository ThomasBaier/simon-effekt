import { main, addPonts, uu } from "/index.js";

export const exp7a = {
  timeStart: new Date().getTime(),
  timeResults: [],
  planedArrows: [],
  arrow10: document.getElementById("arrow10"),
  arrow11: document.getElementById("arrow11"),
  arrow12: document.getElementById("arrow12"),

  arrow20: document.getElementById("arrow20"),
  arrow21: document.getElementById("arrow21"),
  arrow22: document.getElementById("arrow22"),

  arrow30: document.getElementById("arrow30"),
  arrow31: document.getElementById("arrow31"),
  arrow32: document.getElementById("arrow32"),

  arrowNumber: document.getElementById("arrowNumber"),
  waitASec: false,
  isArrowLeft: true,
  controller: new AbortController(),
  sleep: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  audioBeep: function (db, hz, s) {
    // lautstärke in %, hz, s
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = db; // setting it to 10%
    gainNode.connect(audioCtx.destination);

    const oscillator = audioCtx.createOscillator();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(hz, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + s);
  },
  arrowUsed: async function (evt) {
    if (window.expNumber === 7) {
      if (!this.waitASec && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;
        if (evt.isTrusted && this.planedArrows[this.timeResults.length - 1]?.id) {
          clearTimeout(this.planedArrows[this.timeResults.length - 1]?.id);
        }
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length];

        this.timeResults.push({
          length: uu(this.timeResults.length),
          ms: uu(planedArrow?.s),
          hz: uu(planedArrow?.hz),
          db: uu(planedArrow?.db),
          test: uu(planedArrow?.test || false),
          success: uu(planedArrow?.target),
          time: uu(timeDiff),
          isHuman: uu(evt.isTrusted),
        });
        addPonts("7a", planedArrow?.target && evt.isTrusted, timeDiff);

        if (this.planedArrows[this.timeResults.length - 1].test === true && this.planedArrows[this.timeResults.length] && this.planedArrows[this.timeResults.length]?.test === undefined) {
          arrow21.innerHTML = "Starte Experiment!";
          await this.sleep(2000);
          arrow21.innerHTML = "2s";
          await this.sleep(1000);
          arrow21.innerHTML = "1s";
          await this.sleep(1000);
        }

        this.arrow21.style.backgroundColor = "white";
        //  END OF CYCLE ----------------------------------
        await this.sleep(500 + 500); // 500-1000ms warten
        this.waitASec = false;

        //  START NEW CYCLE ----------------------------------
        this.timeStart = new Date().getTime();
        planedArrow.id = setTimeout(() => this.next(), 2000);

        if (this.planedArrows.length > this.timeResults.length) {
          arrowNumber.textContent = this.timeResults.length < 10 ? "Test: " + this.timeResults.length + "/9" : "Durchlauf: " + this.timeResults.length + "/" + this.sizeExp; // arrowNumber.textContent = this.timeResults.length < 10 ? this.timeResults.length + 1 + "/10  Testrunden" : this.timeResults.length - 9 + "/" + this.sizeExp;
          this.prepShowForNext(this.planedArrows[this.timeResults.length]);
        } else if (this.planedArrows.length === this.timeResults.length) {
          for (let y = 1; y <= 3; y++) {
            for (let x = 0; x <= 2; x++) {
              window["arrow" + y + x].innerHTML = "";
              window["arrow" + y + x].style.color = "black";
            }
          }
          document.removeEventListener("keydown", this.arrowUsed);
          this.timeResults._id = "7a";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp71 = this.timeResults;
          window.expNumber = 0;
          main();
        }
      }
    }
  },

  init: async function () {
    this.sizeExp = window.expShort ? 14 : 60;

    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    window.dist1();
    document.getElementById("c1").style.display = "block";
    document.getElementById("c2").style.display = "block";
    document.getElementById("c3").style.display = "block";

    this.timeResults = [];

    this.waitASec = false;
    window.expNumber = 7;
    //  arrowAnalysis.style.display = "none";

    const realExp = this.prepExp();
    this.planedArrows = realExp;

    this.arrow21.style.color = "black";
    this.arrow21.innerHTML = "X";

    this.timeStart = new Date().getTime();
    setTimeout(() => this.next(), 2000);
    this.prepShowForNext(this.planedArrows[this.timeResults.length]);
    document.querySelector("body").addEventListener("keydown", (evt) => this.arrowUsed(evt));
  },
  next: function () {
    document.querySelector("body").dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
  },
  randomPick(colorArr) {
    return colorArr[Math.floor(Math.random() * colorArr.length)];
  },
  /*  Akustisch soll die selektive Aufmerksamkeit in drei verschiedenen Dimensionen
(Frequenz, Länge und Lautstärke) getestet werden. Als kritische Dimension ist die Länge der
Töne, in einer 1-back-Aufgabe, wieder zu erkennen. Die Frequenzen sind 500, 750, 1000 und
1250 Hz, die Lautstärke variiert zwischen 40dB, 50dB, 60dB und 70dB und die
Darbietungsdauer (Länge) zwischen 200 ms, 300 ms, 400 ms und 500 ms. Es werden
insgesamt 50 Reize im Abstand von 2 Sekunden dargeboten, von denen 20 Targets bilden
und 30 neutral sind. */
  prepExp: function () {
    let target = 20,
      isTarget = false,
      notbefore = false,
      arrowTaskArray = [],
      testNum = 10;

    const hzArr = [500, 750, 1000, 1250],
      dbArr = [0.4, 0.5, 0.6, 0.7],
      sArr = [0.2, 0.5, 0.8, 1.1];
    // sArr = [0.2, 0.4, 0.6, 0.8]; hart!

    for (let i = 0; i < 100; i++) {
      target = 20;
      testNum = 10;
      isTarget = false;
      notbefore = false;
      arrowTaskArray = [];
      do {
        const sizeExpNow = this.sizeExp - arrowTaskArray.length,
          hz = this.randomPick(hzArr),
          db = this.randomPick(dbArr),
          s = this.randomPick(sArr);
        isTarget = false;

        if (arrowTaskArray.length >= 2) {
          const z3 = (!arrowTaskArray?.[arrowTaskArray.length - 3]?.target && 0.1) || 0;
          const z2 = (!arrowTaskArray?.[arrowTaskArray.length - 2]?.target && 0.1) || 0;
          const z1 = (!arrowTaskArray?.[arrowTaskArray.length - 1]?.target && 0.1) || (!arrowTaskArray?.[arrowTaskArray.length - 1]?.target && -0.5);
          const need = ((target * 2 > sizeExpNow || arrowTaskArray.length === 2) && 1) || 0;
          const percent = target / sizeExpNow + z1 + z2 + z3 + need;
          isTarget = Math.random() < percent;
        }
        if (arrowTaskArray.length === 10) {
          target = 20;
          testNum = 0;
        }
        if (isTarget && target > 0 && !arrowTaskArray?.[arrowTaskArray.length - 1]?.target) {
          const last = arrowTaskArray[arrowTaskArray.length - 1];
          arrowTaskArray.push({ target: true, t: target, s: last.s, db: db, hz: hz, test: testNum > 0 ? true : false });
          target--;
        } else {
          arrowTaskArray.push({ target: false, hz: hz, db: db, s: s, test: testNum > 0 ? true : false });
        }
        testNum--;
      } while (arrowTaskArray.length < this.sizeExp);
      if (target === 0) {
        break;
      }
    }
    console.log(arrowTaskArray);

    return arrowTaskArray;
  },
  prepShowForNext: async function (planedArrow) {
    this.audioBeep(planedArrow.db, planedArrow.hz, planedArrow.s);
  },
};
document.getElementById("exp7a").addEventListener("click", () => {
  main(71);
  // Object.create(exp7a).init();
});
