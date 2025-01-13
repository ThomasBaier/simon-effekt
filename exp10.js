import { main, addPonts, uu } from "/index.js";

export const exp10 = {
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
  arrowUsed: async function (evt) {
    if (window.expNumber === 10) {
      if (!this.waitASec && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;
        if (evt.isTrusted && this.planedArrows[this.timeResults.length - 1]?.id) {
          clearTimeout(this.planedArrows[this.timeResults.length - 1]?.id);
        }
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length];

        this.timeResults.push({
          length: uu(this.timeResults.length),
          symbol: uu(planedArrow?.name), // X ||
          test: uu(planedArrow?.test || false),
          success: uu(planedArrow?.target),
          time: uu(timeDiff),
          isHuman: uu(evt.isTrusted),
        });
        addPonts("10", planedArrow?.target && evt.isTrusted, timeDiff);

        if (this.planedArrows[this.timeResults.length - 1].test === true && this.planedArrows[this.timeResults.length] && this.planedArrows[this.timeResults.length]?.test === undefined) {
          arrow21.innerHTML = "Starte Experiment!";
          await this.sleep(1000);
          arrow21.innerHTML = "2s";
          await this.sleep(1000);
          arrow21.innerHTML = "1s";
          await this.sleep(1000);
        }
        //  END OF CYCLE ----------------------------------
        await this.sleep(500 + 500); // 500-1000ms warten
        this.waitASec = false;

        //  START NEW CYCLE ----------------------------------
        this.timeStart = new Date().getTime();
        planedArrow.id = setTimeout(() => this.next(), 2000);

        if (this.planedArrows.length > this.timeResults.length) {
          // arrowNumaer.textContent = this.timeResults.length + "/" + this.sizeExp;

          // arrowNumber.textContent = this.timeResults.length < 10 ? this.timeResults.length + 1 + "/10  Testrunden" : this.timeResults.length - 9 + "/" + this.sizeExp - 9;

          arrowNumber.textContent = this.timeResults.length < 10 ? "Test: " + this.timeResults.length + "/9" : "Durchlauf: " + this.timeResults.length + "/" + this.sizeExp;
          this.prepShowForNext(this.planedArrows[this.timeResults.length]);
          setTimeout(() => this.endShowSymbol(), 300);
        } else if (this.planedArrows.length === this.timeResults.length) {
          for (let y = 1; y <= 3; y++) {
            for (let x = 0; x <= 2; x++) {
              window["arrow" + y + x].innerHTML = "";
              window["arrow" + y + x].style.color = "white";
            }
          }
          document.removeEventListener("keydown", this.arrowUsed);
          this.timeResults._id = "10";

          this.timeResults.points = window.points[this.timeResults._id];

          window.data.exp10 = this.timeResults;
          window.expNumber = 0;
          main();
        }
      }
    }
  },

  init: async function () {
    this.sizeExp = window.expShort ? 14 : 50; // 40 + 10
    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    window.dist1();
    document.getElementById("c1").style.display = "block";
    document.getElementById("c2").style.display = "block";
    document.getElementById("c3").style.display = "block";

    this.timeResults = [];
    this.arrow21.style.color = "black";
    this.waitASec = false;
    window.expNumber = 10;

    const realExp = this.prepExp();
    this.planedArrows = realExp;

    for (var y = 1; y <= 3; y++) {
      for (var x = 0; x <= 2; x++) {
        window["arrow" + y + x].style.color = "black";
        window["arrow" + y + x].innerHTML = "&middot;";
      }
    }
    this.timeStart = new Date().getTime();
    setTimeout(() => this.next(), 2000);
    this.prepShowForNext(this.planedArrows[this.timeResults.length]);
    document.querySelector("body").addEventListener("keydown", (evt) => this.arrowUsed(evt));
  },
  next: function () {
    document.querySelector("body").dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
  },
  endShowSymbol: function () {
    this.arrow21.style.color = "white";
  },

  prepExp: function () {
    let target = 20,
      isTarget = false,
      notbefore = false,
      arrowTaskArray = [],
      testNum = 10;

    for (let i = 0; i < 100; i++) {
      target = 20;
      testNum = 10;
      isTarget = false;
      notbefore = false;
      arrowTaskArray = [];
      do {
        const sizeExpNow = this.sizeExp - arrowTaskArray.length;
        isTarget = false;

        const need = (target * 2 > sizeExpNow && 1) || 0;
        const percent = target / sizeExpNow + need;
        isTarget = Math.random() < percent;

        if (isTarget && target > 0 && !arrowTaskArray?.[arrowTaskArray.length - 2]?.target) {
          arrowTaskArray.push({ target: target, name: "x", test: testNum > 0 ? true : false });
          target--;
        } else {
          arrowTaskArray.push({ name: "+", test: testNum > 0 ? true : false, target: target });
        }
        if (arrowTaskArray.length === 10) {
          target = 20;
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
    this.arrow21.innerHTML = planedArrow.name;
    this.arrow21.style.color = "black";
  },
};
document.getElementById("exp10").addEventListener("click", () => {
  main(10);
  // Object.create(exp10).init();
});
