import { main, addPonts, uu } from "/index.js";

export const exp2 = {
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
  audio: function (left, komp) {
    window.webkitAudioContext = window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();

    const leftOscillator = audioContext.createOscillator();
    const leftGain = audioContext.createGain();
    const rightOscillator = audioContext.createOscillator();
    const rightGain = audioContext.createGain();
    const merger = audioContext.createChannelMerger(2);

    leftOscillator.connect(leftGain).connect(merger, 0, 0);
    rightOscillator.connect(rightGain).connect(merger, 0, 1);

    merger.connect(audioContext.destination);

    if (left && komp) {
      leftOscillator.frequency.value = 500;
      leftGain.gain.value = 0.5;
      leftOscillator.start(audioContext.currentTime);
      leftOscillator.stop(audioContext.currentTime + 0.5);
    } else if (!left && komp) {
      rightOscillator.frequency.value = 1000;
      rightGain.gain.value = 0.8;
      rightOscillator.start(audioContext.currentTime);
      rightOscillator.stop(audioContext.currentTime + 0.5);
    } else if (left && !komp) {
      leftOscillator.frequency.value = 1000;
      leftGain.gain.value = 0.5;
      leftOscillator.start(audioContext.currentTime);
      leftOscillator.stop(audioContext.currentTime + 0.5);
    } else if (!left && !komp) {
      rightOscillator.frequency.value = 500;
      rightGain.gain.value = 0.8;
      rightOscillator.start(audioContext.currentTime);
      rightOscillator.stop(audioContext.currentTime + 0.5);
    }
  },
  arrowUsed: async function (event) {
    if (window.expNumber === 2) {
      const zeichen = event.key;
      if (((zeichen === "a" && !this.waitASec) || (zeichen === "l" && !this.waitASec)) && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;

        arrow20.style.color = "white";
        arrow22.style.color = "white";
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length],
          a = (event.key === "a" && planedArrow.left && planedArrow.komp) || (event.key === "a" && !planedArrow.left && !planedArrow.komp),
          b = (event.key === "l" && !planedArrow.left && planedArrow.komp) || (event.key === "l" && planedArrow.left && !planedArrow.komp);

        this.timeResults.push({
          length: uu(this.timeResults.length),
          left: uu(planedArrow.left),
          komp: uu(planedArrow.komp),
          test: uu(planedArrow.test || false),
          success: uu(a || b || false),
          time: uu(timeDiff),
          omit: uu(timeDiff > 2000),
        });
        addPonts("2", a || b || false, timeDiff);
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
          this.timeResults._id = "2";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp2 = this.timeResults;
          window.points[""];
          arrow21.style.color = "black";
          arrow20.style.color = "white";
          arrow22.style.color = "white";
          window.expNumber = 0;
          main(3);
        }
      }
    }
  },

  init: async function () {
    window.expNumber = 2;
    this.sizeExp = window.expShort ? 12 : 210;
    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    window.dist1();

    arrow20.style.color = "white";
    arrow22.style.color = "white";
    this.timeResults = [];
    this.waitASec = false;

    this.planedArrows = this.prepExp();

    this.timeStart = new Date().getTime();

    // Prepare
    this.prepShowForNext(this.planedArrows[this.timeResults.length]);

    document.querySelector("body").addEventListener("keydown", (evt) => this.arrowUsed(evt));
  },
  prepExp: function () {
    const arrowTaskArray = [];
    let dist2 = [
      { name: "LIsize", value: this.sizeExp / 4, left: true, komp: false },
      { name: "LKsize", value: this.sizeExp / 4, left: true, komp: true },
      { name: "RIsize", value: this.sizeExp / 4, left: false, komp: false },
      { name: "RKsize", value: this.sizeExp / 4, left: false, komp: true },
    ];

    let sizeExpNow = this.sizeExp,
      testNum = 10,
      left,
      komp,
      which;

    do {
      if (arrowTaskArray.length === 10 && this.sizeExp !== 12) {
        dist2 = [
          { name: "LIsize", value: (this.sizeExp - 10) / 4, left: true, komp: false },
          { name: "LKsize", value: (this.sizeExp - 10) / 4, left: true, komp: true },
          { name: "RIsize", value: (this.sizeExp - 10) / 4, left: false, komp: false },
          { name: "RKsize", value: (this.sizeExp - 10) / 4, left: false, komp: true },
        ];
      }
      left = Math.random() < dist2.filter((item) => item.left === true).reduce((a, b) => a.value + b.value) / (1 + sizeExpNow);
      komp = Math.random() < dist2.filter((item) => item.komp === true).reduce((a, b) => a.value + b.value) / (1 + sizeExpNow);
      which = dist2.find((item) => item.komp === komp && item.left === left);
      if (which.value > 0) {
        sizeExpNow--;
        which.value--;
        arrowTaskArray.push({ komp: komp, left: left, test: testNum > 0 ? true : false });
      }
      testNum--;
    } while (dist2.filter((part) => part.value > 0).length > 0);
    return arrowTaskArray;
  },
  prepShowForNext: async function (planedArrow) {
    arrow21.innerHTML = "X";
    this.audio(planedArrow.left, planedArrow.komp);
    arrow20.style.display = "inline-block";
    arrow22.style.display = "inline-block";
  },
};
document.getElementById("exp2").addEventListener("click", () => {
  main(2);
  // Object.create(exp2).init();
});
