import { main, addPonts, uu } from "/index.js";

export const exp7 = {
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
          color: uu(planedArrow?.col),
          edges: uu(planedArrow?.edges),
          size: uu(planedArrow?.size),
          test: uu(planedArrow?.test || false),
          success: uu(planedArrow?.target),
          time: uu(timeDiff),
          isHuman: uu(evt.isTrusted),
        });

        addPonts("7", planedArrow?.target && evt.isTrusted, timeDiff);

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
          this.timeResults._id = "7";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp7 = this.timeResults;
          this.prepShowLast();
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
    this.arrow11.style.color = "black";
    this.arrow11.style.fontSize = "4vh";
    this.arrow11.style.fontSize = "7vh";
    this.waitASec = false;
    window.expNumber = 7;
    //  arrowAnalysis.style.display = "none";

    this.planedArrows = this.prepExp();

    for (var y = 1; y <= 3; y++) {
      for (var x = 0; x <= 2; x++) {
        window["arrow" + y + x].style.color = "white";
        window["arrow" + y + x].innerHTML = "";
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
  randomPick(colorArr) {
    return colorArr[Math.floor(Math.random() * colorArr.length)];
  },
  /*   Die kritische Dimension bleibt
  ausschließlich die Form (Drei-, Vier-, Fünf- und Sechseck) variiert werden zusätzlich Größe
  (5, 7, 9 und 11 cm) und Farbe (Rot, Blau, Gelb und Grün). Es werden insgesamt 50 Reize imAbstand von 2 Sekunden dargeboten, von den 20 Targets bilden und 30 neutral sind. Erfasst
  und ausgewertet werden die Reaktionszeiten und Fehlreaktionen bzw. Auslasser aller
  dargebotenen Reize, um einen rechnerischen Bezug zum Simon-Effekt herstellen zu können. */
  prepExp: function () {
    let target = 20,
      isTarget = false,
      notbefore = false,
      arrowTaskArray = [],
      testNum = 10;

    const formArr = [
        { edges: "3", poly: "polygon(0% 0%, 100% 0, 0% 100%, 0 0)" },
        { edges: "4", poly: "polygon(0% 0%, 100% 0, 100% 100%,0% 100%, 0 0" },
        { edges: "5", poly: "polygon( 50% 0, 100% 38%, 81% 100%, 19% 100%, 0 38%)" },
        { edges: "6a", poly: "polygon(75% 87%, 100% 44%, 75% 0,25% 0%, 0 44%,25% 87%)" },
        { edges: "6b", poly: "polygon(87% 75%, 87% 25%, 44% 0,0% 25%, 0 75%,44% 100%)" },
      ],
      colorArr = ["red", "blue", "yellow", "green"],
      sizeArr = [5, 7, 9, 11];

    for (let i = 0; i < 100; i++) {
      target = 20;
      testNum = 10;
      isTarget = false;
      notbefore = false;
      arrowTaskArray = [];
      do {
        const sizeExpNow = this.sizeExp - arrowTaskArray.length,
          color = this.randomPick(colorArr),
          size = this.randomPick(sizeArr),
          form = this.randomPick(formArr);
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
          arrowTaskArray.push({ target: true, t: target, edges: last.edges, col: color, size: size, poly: form.poly, test: testNum > 0 ? true : false });
          target--;
        } else {
          arrowTaskArray.push({ target: false, edges: form.edges, col: color, size: size, poly: form.poly, test: testNum > 0 ? true : false });
        }
        testNum--;
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
    this.arrow21.style.backgroundColor = planedArrow.col;
    this.arrow21.style.width = ((93 * planedArrow.size) / 2.54).toString() + "px";
    this.arrow21.style.height = ((93 * planedArrow.size) / 2.54).toString() + "px";
    var clipPath = planedArrow.poly;
    this.arrow21.style.webkitClipPath = clipPath;
  },
  prepShowLast: async function () {
    this.arrow21.style.backgroundColor = "white";
    this.arrow21.style.webkitClipPath = "";
  },
};
document.getElementById("exp7").addEventListener("click", () => {
  main(7);
  // Object.create(exp7).init();
});
