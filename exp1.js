import { main, addPonts, uu } from "/index.js";

export const exp1 = {
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
  arrowUsed: async function (evt) {
    if (window.expNumber === 1) {
      const zeichen = evt.key;
      if (((zeichen === "a" && !this.waitASec) || (zeichen === "l" && !this.waitASec)) && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;

        arrow20.style.color = "white";
        arrow22.style.color = "white";
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length],
          a = (evt.key === "a" && planedArrow.left && planedArrow.komp) || (evt.key === "a" && !planedArrow.left && !planedArrow.komp),
          b = (evt.key === "l" && !planedArrow.left && planedArrow.komp) || (evt.key === "l" && planedArrow.left && !planedArrow.komp);

        this.timeResults.push({
          length: uu(this.timeResults.length),
          left: uu(planedArrow.left),
          komp: uu(planedArrow.komp),
          test: uu(planedArrow.test),
          success: uu(a || b || false),
          time: uu(timeDiff),
          omit: uu(timeDiff > 2000),
        });
        addPonts("1", a || b || false, timeDiff);
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
          this.timeResults._id = "1";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp1 = this.timeResults;

          arrow21.style.color = "black";
          arrow20.style.color = "white";
          arrow22.style.color = "white";
          document.removeEventListener("keydown", this.arrowUsed);
          window.expNumber = 0;
          main();
        }
      }
    }
  },

  init: async function () {
    this.sizeExp = window.expShort ? 12 : 210;
    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    window.dist1();
    this.timeResults = [];
    arrow20.style.color = "white";
    arrow22.style.color = "white";

    this.waitASec = false;
    window.expNumber = 1;

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
        testNum--;
      }
    } while (dist2.filter((part) => part.value > 0).length > 0);
    console.log(arrowTaskArray);

    return arrowTaskArray;
  },
  prepShowForNext: async function (planedArrow) {
    arrow21.innerHTML = "X";
    if (planedArrow.left && planedArrow.komp) {
      arrow20.style.color = "black"; // PFEIL LINKS SYMBOL
      arrow20.innerHTML = "&#8592;";
      arrow22.style.color = "white";
    } else if (!planedArrow.left && planedArrow.komp) {
      arrow20.style.color = "white";
      arrow22.innerHTML = "&#8594;";
      arrow22.style.color = "black"; // PFEIL RECHTS SYMBOL
    } else if (planedArrow.left && !planedArrow.komp) {
      arrow20.innerHTML = "&#8594;";
      arrow20.style.color = "black"; // PFEIL LINKS SYMBOL
      arrow22.style.color = "white";
    } else if (!planedArrow.left && !planedArrow.komp) {
      arrow20.style.color = "white";
      arrow22.innerHTML = "&#8592;";
      arrow22.style.color = "black"; // PFEIL RECHTS SYMBOL
    }
    /*     arrow20.style.display = "inline-block";
    arrow22.style.display = "inline-block"; */
  },
};
document.getElementById("exp1").addEventListener("click", () => {
  main(1);
  // Object.create(exp1).init();
});
