import { main, addPonts, uu } from "/index.js";

export const exp3 = {
  // TODO THBX ADD TEST USAGE!
  timeStart: new Date().getTime(),
  timeResults: [],
  planedArrows: [],
  arrow20: document.getElementById("arrow20"),
  arrow21: document.getElementById("arrow21"),
  arrow22: document.getElementById("arrow22"),
  arrowNumber: document.getElementById("arrowNumber"),
  waitASec: false,
  isArrowLeft: true,
  sleep: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  audioBeep: function () {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(500, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  },
  arrowUsed: async function (evt) {
    if (window.expNumber === 3) {
      const zeichen = evt.key;

      // TODO: ANY KEY!
      if (/^[A-Za-z0-9,.ß]/.test(zeichen) && !this.waitASec && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;

        arrow20.style.color = "white";
        arrow22.style.color = "white";
        this.arrow21.innerHTML = "";
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length];

        this.timeResults.push({
          length: uu(this.timeResults.length),
          withAlert: uu(planedArrow?.komp),
          test: uu(planedArrow?.test),
          success: uu(true),
          time: uu(timeDiff),
          omit: uu(timeDiff > 2000),
        });
        addPonts("3", true, timeDiff);

        if (this.planedArrows[this.timeResults.length - 1].test === true && this.planedArrows[this.timeResults.length] && this.planedArrows[this.timeResults.length]?.test === undefined) {
          arrow21.innerHTML = "Starte Experiment!";
          await this.sleep(2000);
          arrow21.innerHTML = "2s";
          await this.sleep(1000);
          arrow21.innerHTML = "1s";
          await this.sleep(1000);
        }
        //  END OF CYCLE ----------------------------------
        await this.sleep(Math.random() * 500 + 500); // 500-1000ms warten
        this.waitASec = false;

        //  START NEW CYCLE ----------------------------------
        this.timeStart = new Date().getTime();

        if (this.planedArrows.length > this.timeResults.length) {
          arrowNumber.textContent = this.timeResults.length < 10 ? "Test: " + this.timeResults.length + "/9" : "Durchlauf: " + this.timeResults.length + "/" + this.sizeExp;
          this.prepShowForNext(this.planedArrows[this.timeResults.length]);
        } else if (this.planedArrows.length === this.timeResults.length) {
          arrow21.style.color = "black";
          arrow20.style.color = "white";
          arrow22.style.color = "white";
          this.timeResults._id = "3";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp3 = this.timeResults;
          window.expNumber = 0;
          main();
        }
      }
    }
  },
  init: async function () {
    this.sizeExp = window.expShort ? 12 : 90;
    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    arrow20.style.color = "white";
    arrow22.style.color = "white";
    this.timeResults = [];
    window.dist1();

    this.planedArrows = this.prepExp();

    this.timeStart = new Date().getTime();
    window.expNumber = 3;

    // Prepare
    this.prepShowForNext(this.planedArrows[this.timeResults.length]);

    document.querySelector("body").addEventListener("keydown", (event) => this.arrowUsed(event));
  },
  prepExp: function () {
    const arrowTaskArray = [];
    let komp;
    let sizeExpNow = this.sizeExp;
    do {
      if (this.sizeExp === 90) {
        komp = sizeExpNow <= 70 && sizeExpNow > 30 ? true : false; // add sounds
      } else {
        komp = sizeExpNow <= 9 && sizeExpNow > 3 ? true : false; // add sounds
      }
      sizeExpNow--;
      which.value--;
      arrowTaskArray.push({ komp: komp });
    } while (sizeExpNow > 0);
    return arrowTaskArray;
  },
  prepShowForNext: async function (planedArrow) {
    if (planedArrow.komp) {
      this.audioBeep();
      await this.sleep(1500 + Math.random() * 500);
    }
    this.arrow21.style.color = "black";
    this.arrow21.innerHTML = "X";
  },
};
document.getElementById("exp3").addEventListener("click", () => {
  main(3);
  // Object.create(exp3).init();
});
