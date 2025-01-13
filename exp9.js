import { main, addPonts, uu } from "/index.js";

export const exp9 = {
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
    if (window.expNumber === 9) {
      if (!this.waitASec && this.planedArrows.length > this.timeResults.length) {
        const timeDiff = new Date().getTime() - this.timeStart;
        if (evt.isTrusted && this.planedArrows[this.timeResults.length - 1]?.id) {
          clearTimeout(this.planedArrows[this.timeResults.length - 1]?.id);
        }
        this.waitASec = true;
        const planedArrow = this.planedArrows[this.timeResults.length];

        this.timeResults.push({
          length: uu(this.timeResults.length),
          number: uu(planedArrow?.num),
          test: uu(planedArrow?.test || false),
          success: uu(planedArrow?.target || false),
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
        this.arrow21.innerHTML = "";
        //  END OF CYCLE ----------------------------------
        await this.sleep(1000); // TODO TH: 3000
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
          this.timeResults._id = "9";
          this.timeResults.points = window.points[this.timeResults._id];
          window.data.exp9 = this.timeResults;
          window.expNumber = 0;
          main();
        }
      }
    }
  },

  init: async function () {
    this.sizeExp = window.expShort ? 14 : 110;

    document.getElementById("questionForm").style.display = "none";
    document.getElementById("exp").style.display = "block";
    window.dist1();
    document.getElementById("c1").style.display = "block";
    document.getElementById("c2").style.display = "block";
    document.getElementById("c3").style.display = "block";

    this.timeResults = [];
    this.arrow11.style.color = "black";
    this.waitASec = false;
    window.expNumber = 9;

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
    let target = 15,
      isTarget = false,
      arrowTaskArray = [],
      testNum = 10,
      num = 0;

    const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    for (let i = 0; i < 100; i++) {
      target = 15;
      testNum = 10;
      isTarget = false;
      arrowTaskArray = [];
      do {
        const sizeExpNow = this.sizeExp - arrowTaskArray.length;
        isTarget = false;

        if (arrowTaskArray.length >= 2) {
          /*  const z3 = (!arrowTaskArray?.[arrowTaskArray.length - 3]?.target && 0.1) || 0;
          const z2 = (!arrowTaskArray?.[arrowTaskArray.length - 2]?.target && 0.1) || 0;
         
      const need = ((target * 2 > sizeExpNow || arrowTaskArray.length === 2) && 1) || 0;  */
          const z3 = (arrowTaskArray?.[arrowTaskArray.length - 3]?.target && -0.3) || 0;
          const z1 = (arrowTaskArray?.[arrowTaskArray.length - 1]?.target && -0.3) || 0;
          const z2 = (arrowTaskArray?.[arrowTaskArray.length - 2]?.target && -0.3) || 0;
          console.log(z1);
          const percent = arrowTaskArray.length < 10 ? 0.5 : target / sizeExpNow + z1 + z2 + z3; // + z1 + z2 + z3 + need;
          isTarget = Math.random() < percent;
        }
        if (arrowTaskArray.length === 10) {
          target = 15;
        }
        num = this.randomPick(
          numArr.filter(function (x) {
            return x !== arrowTaskArray?.[arrowTaskArray.length - 2]?.num;
          })
        );

        if (isTarget && target > 0 && !arrowTaskArray?.[arrowTaskArray.length - 2]?.target) {
          const last = arrowTaskArray[arrowTaskArray.length - 2];
          arrowTaskArray.push({ target: true, num: last.num, t: target, test: testNum > 0 ? true : false, t: target });
          target--;
        } else {
          arrowTaskArray.push({ num: num, test: testNum > 0 ? true : false });
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
    this.arrow21.innerHTML = planedArrow.num;
    this.arrow21.style.fontSize = "10vh";
    this.arrow21.style.color = "black";
  },
};
document.getElementById("exp9").addEventListener("click", () => {
  main(9);
  // Object.create(exp9).init();
});
