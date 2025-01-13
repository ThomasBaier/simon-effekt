import { main, addPonts, uu } from "/index.js";

export const exp4 = {
  // TODO THBX ADD TEST USAGE!

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
    if (window.expNumber === 4) {
      if (!this.waitASec && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;
        if (evt.isTrusted && this.planedArrows[this.timeResults.length - 1]?.id) {
          clearTimeout(this.planedArrows[this.timeResults.length - 1]?.id);
        }
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length];

        this.timeResults.push({
          length: uu(this.timeResults.length),
          x: uu(planedArrow?.x),
          y: uu(planedArrow?.y),
          arrowName: uu(planedArrow?.name),
          test: uu(planedArrow?.test || false),
          success: uu(planedArrow?.target),
          time: uu(timeDiff),
          isHuman: uu(evt.isTrusted),
        });
        addPonts("9", planedArrow?.target && evt.isTrusted, timeDiff);

        if (this.planedArrows[this.timeResults.length - 1]?.test === true && this.planedArrows[this.timeResults.length] && this.planedArrows[this.timeResults.length]?.test === undefined) {
          arrow21.innerHTML = "Starte Experiment!";
          await this.sleep(2000);
          arrow21.innerHTML = "2s";
          await this.sleep(1000);
          arrow21.innerHTML = "1s";
          await this.sleep(1000);
        }
        for (let y = 1; y <= 3; y++) {
          for (let x = 0; x <= 2; x++) {
            window["arrow" + y + x].style.color = "white";
          }
        }
        //  END OF CYCLE ----------------------------------
        await this.sleep(Math.random() * 500 + 500); // 500-1000ms warten
        this.waitASec = false;

        //  START NEW CYCLE ----------------------------------
        this.timeStart = new Date().getTime();
        planedArrow.id = setTimeout(() => this.next(), 2000);

        if (this.planedArrows.length > this.timeResults.length) {
          arrowNumber.textContent = this.timeResults.length < 10 ? "Test: " + this.timeResults.length + "/9" : "Durchlauf: " + this.timeResults.length + "/" + this.sizeExp;
          this.prepShowForNext(this.planedArrows[this.timeResults.length]);
        } else if (this.planedArrows.length === this.timeResults.length) {
          for (let y = 1; y <= 3; y++) {
            for (let x = 0; x <= 2; x++) {
              window["arrow" + y + x].innerHTML = "";
              window["arrow" + y + x].style.color = "black";
            }
          }

          document.removeEventListener("keydown", this.arrowUsed);
          this.timeResults._id = "4";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp4 = this.timeResults;
          window.expNumber = 0;
          main();
        }
      }
    }
  },

  init: async function () {
    this.sizeExp = window.expShort ? 20 : 60;

    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    window.dist1();
    document.getElementById("c1").style.display = "block";
    document.getElementById("c2").style.display = "block";
    document.getElementById("c3").style.display = "block";

    document.getElementById("description").innerHTML = "Erklärung:   Wenn das X an der selben Position erscheint wie <u>vorletzte</u> Runde ist es ein Treffer!" + " <br>Drücken sie nun schnell einen Buchstaben. Achtung: Nach einem Treffer kann direkt noch ein Treffer kommen.";
    this.timeResults = [];
    this.arrow11.style.color = "black";
    this.waitASec = false;
    window.expNumber = 4;
    //  arrowAnalysis.style.display = "none";

    const realExp = this.prepExp();
    // this.planedArrows = this.test.concat(realExp);
    this.planedArrows = realExp;

    for (var y = 1; y <= 3; y++) {
      for (var x = 0; x <= 2; x++) {
        window["arrow" + y + x].style.color = "white";
        window["arrow" + y + x].innerHTML = "X";
      }
    }
    this.timeStart = new Date().getTime();
    setTimeout(() => this.next(), 2000);
    // Prepare
    this.prepShowForNext(this.planedArrows[this.timeResults.length]);

    document.querySelector("body").addEventListener("keydown", (evt) => this.arrowUsed(evt));
  },
  next: function () {
    document.querySelector("body").dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

    // const event = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", which: 13, keyCode: 13 });
  },
  prepExp: function () {
    let target = 20,
      isTarget = false,
      notbefore = false,
      arrowTaskArray = [];

    for (let i = 0; i < 100; i++) {
      target = 20;
      isTarget = false;
      notbefore = false;
      arrowTaskArray = [];

      do {
        const sizeExpNow = this.sizeExp - arrowTaskArray.length,
          y = Math.ceil(Math.random() * 3),
          x = Math.floor(Math.random() * 3);
        isTarget = false;

        if (arrowTaskArray.length >= 2) {
          const z3 = (!arrowTaskArray?.[arrowTaskArray.length - 3]?.target && 0.1) || 0;
          const z2 = (!arrowTaskArray?.[arrowTaskArray.length - 2]?.target && 0.1) || 0;
          const z1 = (!arrowTaskArray?.[arrowTaskArray.length - 1]?.target && 0.1) || (!arrowTaskArray?.[arrowTaskArray.length - 1]?.target && -0.5);
          const need = ((target * 2 > sizeExpNow || arrowTaskArray.length === 2) && 1) || 0;
          const percent = target / sizeExpNow + z1 + z2 + z3 + need;
          isTarget = Math.random() < percent;
        }
        if (arrowTaskArray.length === 10 && this.sizeExp !== 20) {
          target = 20;
        }
        if (isTarget && target > 0 && !arrowTaskArray?.[arrowTaskArray.length - 2]?.target) {
          const last = arrowTaskArray[arrowTaskArray.length - 2];
          arrowTaskArray.push({ target: true, t: target, name: last.name, x: last.x, y: last.y, test: arrowTaskArray.length < 10 });
          target--;
        } else {
          arrowTaskArray.push({ target: false, name: "arrow" + y + x, x: x, y: y, test: arrowTaskArray.length < 10 });
        }
      } while (arrowTaskArray.length < this.sizeExp);
      if (target === 0) {
        break;
      }
      console.log("Falsch", i, arrowTaskArray);
    }
    console.log(arrowTaskArray);

    return arrowTaskArray;
  },
  prepShowForNext: async function (planedArrow) {
    window[planedArrow.name].style.color = "black";
    // console.log(planedArrow.name);
  },
};
document.getElementById("exp4").addEventListener("click", () => {
  main(4);
  // Object.create(exp4).init();
});
