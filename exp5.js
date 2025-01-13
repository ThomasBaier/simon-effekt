import { main, addPonts, uu } from "/index.js";

export const exp5 = {
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
    if (window.expNumber === 5) {
      const zeichen = evt.key;
      if (((zeichen === "a" && !this.waitASec) || (zeichen === "l" && !this.waitASec)) && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;
        arrow21.style.color = "white";

        arrow20.style.color = "white";
        arrow22.style.color = "white";
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length],
          a = evt.key === "a" && planedArrow?.left,
          b = evt.key === "l" && !planedArrow?.left;
        // a = (evt.key === "a" && planedArrow?.left && planedArrow?.komp) || (evt.key === "a" && planedArrow?.left && !planedArrow?.komp),
        // b = (evt.key === "l" && !planedArrow?.left && planedArrow?.komp) || (evt.key === "l" && !planedArrow?.left && !planedArrow?.komp);

        this.timeResults.push({
          length: uu(this.timeResults.length),
          left: uu(planedArrow?.left),
          komp: uu(planedArrow?.komp),
          validForecast: uu(planedArrow?.isCorrect),
          test: uu(planedArrow?.test),
          success: uu(a || b || false),
          time: uu(timeDiff),
          omit: uu(timeDiff > 2000),
        });
        addPonts("5", a || b || false, timeDiff);

        if (this.planedArrows[this.timeResults.length - 1].test === true && this.planedArrows[this.timeResults.length] && this.planedArrows[this.timeResults.length]?.test === undefined) {
          arrow21.style.color = "lightsteelblue";
          arrow21.innerHTML = "Starte Experiment!";
          await this.sleep(2000);
          arrow21.innerHTML = "2s";
          await this.sleep(1000);
          arrow21.innerHTML = "1s";
          await this.sleep(1000);
          arrow21.innerHTML = "";
          arrow21.style.color = "white";
        }
        //  END OF CYCLE ----------------------------------
        await this.sleep(500);
        if (this.planedArrows.length > this.timeResults.length) {
          const now = this.planedArrows[this.timeResults.length];
          if (now.left) {
            // links  8592
            // rechts 8594
            arrow21.innerHTML = now.isCorrect ? "&#8592;" : "&#8594;";
          } else {
            arrow21.innerHTML = now.isCorrect ? "&#8594;" : "&#8592;";
          }
          arrow21.style.color = "lightsteelblue";
        }
        await this.sleep(Math.random() * 500 + 500); // 500-1000ms warten
        this.waitASec = false;

        //  START NEW CYCLE ----------------------------------
        this.timeStart = new Date().getTime();

        if (this.planedArrows.length > this.timeResults.length) {
          // TODO: arrowNumber.textContent = this.timeResults.length <= 10 ? this.timeResults.length + 1 + "/10  Testrunden" : this.timeResults.length - 10 + "/" + this.sizeExp;
          arrowNumber.textContent = this.timeResults.length < 10 ? "Test: " + this.timeResults.length + "/9" : "Durchlauf: " + this.timeResults.length + "/" + this.sizeExp;
          this.prepShowForNext(this.planedArrows[this.timeResults.length]);
        } else if (this.planedArrows.length === this.timeResults.length) {
          arrow21.style.color = "white";
          arrow20.style.color = "white";
          arrow22.style.color = "white";
          document.removeEventListener("keydown", this.arrowUsed);
          this.timeResults._id = "5";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp5 = this.timeResults;
          window.expNumber = 0;
          main();
        }
      }
    }
  },

  init: async function () {
    this.sizeExp = window.expShort ? 12 : 110;

    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    window.dist1();
    this.timeResults = [];
    arrow20.style.color = "white";
    arrow22.style.color = "white";
    arrow21.innerHTML = "";
    this.waitASec = false;
    window.expNumber = 5;

    const realExp = this.prepExp();
    this.planedArrows = realExp;

    this.timeStart = new Date().getTime();

    // Prepare
    this.prepShowForNext(this.planedArrows[this.timeResults.length]);

    document.querySelector("body").addEventListener("keydown", (evt) => this.arrowUsed(evt));
  },
  prepExp: function () {
    let arrowTaskArray = [];
    for (let i = 0; i < 100; i++) {
      let dist2 = [
          { name: "LIsize", value: this.sizeExp / 4, left: true, komp: false },
          { name: "LKsize", value: this.sizeExp / 4, left: true, komp: true },
          { name: "RIsize", value: this.sizeExp / 4, left: false, komp: false },
          { name: "RKsize", value: this.sizeExp / 4, left: false, komp: true },
        ],
        left,
        komp,
        which,
        isCorrect,
        validNum = Math.floor((4 * this.sizeExp) / 5),
        sizeExpNow = this.sizeExp;
      arrowTaskArray = [];
      do {
        left = Math.random() < dist2.filter((item) => item.left === true).reduce((a, b) => a.value + b.value) / (1 + sizeExpNow);
        komp = Math.random() < dist2.filter((item) => item.komp === true).reduce((a, b) => a.value + b.value) / (1 + sizeExpNow);
        isCorrect = Math.random() < validNum / (1 + sizeExpNow);
        which = dist2.find((item) => item.komp === komp && item.left === left);
        if (which.value > 0) {
          sizeExpNow--;
          which.value--;
          if (isCorrect) {
            validNum--;
          }
          if (arrowTaskArray.length === 10 && this.sizeExp !== 12) {
            dist2 = [
              { name: "LIsize", value: (this.sizeExp - 10) / 4, left: true, komp: false },
              { name: "LKsize", value: (this.sizeExp - 10) / 4, left: true, komp: true },
              { name: "RIsize", value: (this.sizeExp - 10) / 4, left: false, komp: false },
              { name: "RKsize", value: (this.sizeExp - 10) / 4, left: false, komp: true },
            ];
          }
          // links  8592
          // rechts 8594
          if (left) {
            arrowTaskArray.push({ Ri: "L", komp: komp, left: left, isCorrect: isCorrect, test: arrowTaskArray.length < 10 });
          } else {
            arrowTaskArray.push({ Ri: "R", komp: komp, left: left, isCorrect: isCorrect, test: arrowTaskArray.length < 10 });
          }
        }
      } while (dist2.filter((part) => part.value > 0).length > 0);
      console.log(i, arrowTaskArray);
      if (validNum === 0) {
        break;
      }
    }
    return arrowTaskArray;
  },
  prepShowForNext: async function (planedArrow) {
    // links  8592
    // rechts 8594
    if (planedArrow.left && planedArrow.komp) {
      arrow20.style.color = "black"; // PFEIL LINKS SYMBOL
      arrow20.innerHTML = "&#8592;";
      arrow22.style.color = "white";
    } else if (!planedArrow.left && planedArrow.komp) {
      arrow20.style.color = "white";
      arrow22.innerHTML = "&#8594;";
      arrow22.style.color = "black"; // PFEIL RECHTS SYMBOL
    } else if (planedArrow.left && !planedArrow.komp) {
      // arrow20.innerHTML = "&#8594;"; // Linker Pfeil müsste auf arrow22 kommen
      arrow22.innerHTML = "&#8592;"; // Linker Pfeil müsste auf arrow22 kommen
      arrow22.style.color = "black"; // PFEIL LINKS SYMBOL
      arrow20.style.color = "white";
    } else if (!planedArrow.left && !planedArrow.komp) {
      arrow22.style.color = "white";
      // arrow22.innerHTML = "&#8592;"; // rechter pfeil müsste links kommen
      arrow20.innerHTML = "&#8594;"; // rechter pfeil müsste links kommen
      arrow20.style.color = "black"; // PFEIL RECHTS SYMBOL
    }
    arrow20.style.display = "inline-block";
    arrow22.style.display = "inline-block";
  },
};
document.getElementById("exp5").addEventListener("click", () => {
  main(5);
  // Object.create(exp5).init();
});
