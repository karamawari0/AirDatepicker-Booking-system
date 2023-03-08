const telephone_number = document.getElementById("telephone_input");
const button = document.getElementById("special");
const close = document.getElementById("close");
const menu = document.getElementById("mini");
const decrement = document.getElementsByClassName("gg-remove");
const decrementCollection = Array.from(decrement);
const increment = document.getElementsByClassName("gg-add");
const incrementCollection = Array.from(increment);
let childrenButtonIndex = 0;
const guestsCollection = [
  [
    "1 взрослый",
    "2 взрослых",
    "3 взрослых",
    "4 взрослых",
    "5 взрослых",
    "6 взрослых",
    "7 взрослых",
    "8 взрослых",
    "9 взрослых",
  ],
  [
    "1 ребёнок",
    "2 ребёнка",
    "3 ребёнка",
    "4 ребёнка",
    "5 детей",
    "6 детей",
    "7 детей",
    "8 детей",
    "9 детей",
    "10 детей",
    "11 детей",
    "12 детей",
    "13 детей",
    "14 детей",
    "15 детей",
    "16 детей",
    "17 детей",
    "18 детей",
  ],
];

button.addEventListener("click", function () {
  menu.classList.toggle("active");
});

close.addEventListener("click", function () {
  menu.classList.toggle("active");
});

window.addEventListener("click", function (e) {
  if (!button.contains(e.target)) {
    if (menu.contains(e.target) && menu.classList.contains("active")) {
    } else {
      menu.classList.remove("active");
    }
  }
});

//МИНУС
decrementCollection.forEach((decrementButton, index) => {
  decrementButton.addEventListener("click", function () {
    if (index == 0) {
      //Кнопка минус для взрослых
      let currentValue = button.getAttribute("value");
      adultButtonIndex = parseInt(
        decrementButton.parentElement.children[1].innerHTML
      );
      if (adultButtonIndex != 1) {
        let newValue = currentValue.replace(
          guestsCollection[0][adultButtonIndex - 1],
          guestsCollection[0][adultButtonIndex - 2]
        );
        button.setAttribute("value", newValue);
      } else {
        let newValue = currentValue.replace(
          guestsCollection[0][adultButtonIndex - 1],
          ""
        );
        button.setAttribute("value", newValue.trim());
      }
      adultButtonIndex--;
      decrementButton.parentElement.children[1].innerHTML = adultButtonIndex;

      if (adultButtonIndex <= 0) {
        decrementButton.classList.toggle("disactivated");
      }

      if (adultButtonIndex == 8) {
        decrementButton.parentElement.children[2].classList.remove(
          "disactivated"
        );
      }
    } else {
      //Кнопка минус для детей
      let currentValue = button.getAttribute("value");
      let thisChildrenButton = parseInt(
        decrementButton.parentElement.children[1].innerHTML
      );
      thisChildrenButton--;

      if (childrenButtonIndex != 1) {
        let newValue = currentValue.replace(
          guestsCollection[1][childrenButtonIndex - 1],
          guestsCollection[1][childrenButtonIndex - 2]
        );
        button.setAttribute("value", newValue);
      } else {
        let newValue = currentValue.replace(
          guestsCollection[1][childrenButtonIndex - 1],
          ""
        );
        button.setAttribute("value", newValue.trim());
      }

      childrenButtonIndex--;
      decrementButton.parentElement.children[1].innerHTML = thisChildrenButton;

      if (thisChildrenButton <= 0) {
        decrementButton.classList.toggle("disactivated");
      }

      if (thisChildrenButton == 8) {
        decrementButton.parentElement.children[2].classList.remove(
          "disactivated"
        );
      }
    }
  });
});

//ПЛЮС
incrementCollection.forEach((incrementButton, index) => {
  adultButtonIndex = parseInt(
    incrementButton.parentElement.children[1].innerHTML
  );

  incrementButton.addEventListener("click", function () {
    //Кнопка плюс для взрослых
    if (index == 0) {
      let currentValue = button.getAttribute("value");

      if (currentValue) {
        if (adultButtonIndex == 0 && childrenButtonIndex > 0) {
          button.setAttribute(
            "value",
            guestsCollection[0][0] + " " + currentValue
          );
        } else {
          let newValue = currentValue.replace(
            guestsCollection[0][adultButtonIndex - 1],
            guestsCollection[0][adultButtonIndex]
          );
          button.setAttribute("value", newValue);
        }
      } else {
        button.setAttribute("value", guestsCollection[0][childrenButtonIndex]);
      }
      adultButtonIndex++;
      incrementButton.parentElement.children[1].innerHTML = adultButtonIndex;

      if (adultButtonIndex >= 9) {
        incrementButton.classList.toggle("disactivated");
      }
      if (adultButtonIndex > 0) {
        incrementButton.parentElement.children[0].classList.remove(
          "disactivated"
        );
      }
    } else {
      //Кнопка плюс для детей
      let currentValue = button.getAttribute("value");
      let thisChildrenButton = parseInt(
        incrementButton.parentElement.children[1].innerHTML
      );
      thisChildrenButton++;

      if (currentValue) {
        if (childrenButtonIndex == 0 && adultButtonIndex > 0) {
          button.setAttribute(
            "value",
            currentValue + " " + guestsCollection[1][0]
          );
        } else {
          let newValue = currentValue.replace(
            guestsCollection[1][childrenButtonIndex - 1],
            guestsCollection[1][childrenButtonIndex]
          );
          button.setAttribute("value", newValue);
        }
      } else {
        button.setAttribute("value", guestsCollection[1][childrenButtonIndex]);
      }
      childrenButtonIndex++;
      incrementButton.parentElement.children[1].innerHTML = thisChildrenButton;

      if (thisChildrenButton >= 9) {
        incrementButton.classList.toggle("disactivated");
      }
      if (thisChildrenButton > 0) {
        incrementButton.parentElement.children[0].classList.remove(
          "disactivated"
        );
      }
    }
  });
});

telephone_number.addEventListener("click", function () {
  if (telephone_number.value == "") {
    telephone_number.value = "+7";
  }
});
