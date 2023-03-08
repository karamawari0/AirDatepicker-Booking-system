let firstName = document.querySelector('[data-id="name"]');
let dateInput = document.querySelector('[data-id="checkinout"]');
const guestCounters = document.querySelectorAll(".number");
const guestsNumberArray = Array.from(guestCounters);
const form = document.getElementById("form");
const space = "%0A";
var currDate;
const priceLow = 900;
const priceMedium = 1200;
const priceHigh = 1600;

//Токен бота в телеграмме (нужно захешить, закодировать и т.д.)
const TELEGRAM_TOKEN = "5738529884:AAH5oLyeZ8ieuWFrj5DtRDXzO5i5tafFahg";
//Задать стартовую дату и инициализировать календарь
let startDate = new Date();
new AirDatepicker("#airdatepicker", {
  inline: false,
  position: "bottom center",
  //Окрасить клетки календаря в разные цвета согласно ценовому периоду (пока не понял, как выбрать конкретный месяц + день, только месяц целиком)
  onRenderCell({ date, cellType }) {
    if (cellType === "day") {
      let dates = [1, 2, 3, 4, 5, 6];
      isDay = cellType === "day";
      (_date = date.getDate()),
        (shouldChangeContent = isDay && dates.includes(_date));

      if (date.getMonth() === 5) {
        return {
          classes: shouldChangeContent ? "-emoji-cell-" : undefined,
        };
      }

      if (date.getMonth() === 4) {
        return {
          classes: shouldChangeContent ? "-emoji-cell-" : undefined,
        };
      }
    }
  },

  //Действие при выборе даты
  onSelect({ date }) {
    currDate = date;
    getDate(date);
  },

  //Диапазон дат и вид разделителя
  range: true,
  multipleDatesSeparator: " — ",

  //Кнопки "Очистить" и "Сегодня"
  buttons: ["clear", "today"],
});

function getDate(date) {
  //Если не заданы даты вывести "ЦЕНА: ХХХ"
  if (typeof date[0] == "undefined") {
    return (document.getElementById("price").innerHTML = `ЦЕНА: XXX`);
  }

  //Если заданы обе даты
  if (typeof date[1] !== "undefined") {
    sum = 0;
    var dateString = date[0];
    var dateObj = new Date(dateString);
    var momentObj = moment(dateObj);
    momentObj = momentObj.hour(0);

    var dateStringT = date[1];
    var dateObjT = new Date(dateStringT);
    var momentObjT = moment(dateObjT);
    momentObjT = momentObjT.hour(0);
    var m = moment();
    calcPrice(momentObjT);
    while (momentObj.isSame(momentObjT) == false) {
      m = momentObjT.subtract(1, "d");
      calcPrice(m);
    }
    // console.log(sum.toLocaleString);
    return (document.getElementById("price").innerHTML = `ЦЕНА: ${sum} РУБЛЕЙ`);
  }

  sum = 0;
  var dateString = date[0];
  var dateObj = new Date(dateString);
  var momentObj = moment(dateObj);
  momentObj = momentObj.hour(0);
  calcPrice(momentObj);
  // console.log(sum);
  document.getElementById("price").innerHTML = `ЦЕНА: ${sum} РУБЛЕЙ`;
}

//Посчитать цену за выбранный период (даты указываются включительно доп. аргументом "[]")
function calcPrice(m) {
  if (m.isBetween("2023-05-20", "2023-06-10", undefined, "[]")) {
    calculator(priceLow);
  } else if (
    m.isBetween("2023-06-11", "2023-06-30", undefined, "[]") ||
    m.isBetween("2023-08-26", "2023-09-10", undefined, "[]")
  ) {
    calculator(priceMedium);
  } else if (m.isBetween("2023-07-01", "2023-08-25", undefined, "[]")) {
    calculator(priceHigh);
  } else {
    calculator(priceLow);
  }
}

function calculator(priceModifier) {
  guestsArr = learnGuests();
  sum +=
    priceModifier * guestsArr[0] +
    ((priceModifier * guestsArr[1]) / 100) * 70 +
    300 * guestsArr[2];
}

//Отменить действие по-умолчанию - обновление страницы
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

//Отправить сообщение боту, проверив валидность формы via Constraint validation API
async function sendMessage() {
  if (form.checkValidity()) {
    await hitTheBot();
  } else {
    console.log("фетч не прошел");
  }
}

//Посчитаем, сколько гостей
function learnGuests() {
  let guestsArr = [];
  for (let i of guestsNumberArray) {
    guestsArr.push(i.innerHTML);
  }
  return guestsArr;
}

//Непосредственно запрос к боту по URL с сообщением
async function hitTheBot() {
  let guestsArr = learnGuests();
  let guests = "";
  const length = guestsArr.length;
  for (let i = 0; i < length; i++) {
    if (guestsArr[i] != 0) {
      switch (i) {
        case 0:
          guests += space + `Взрослые - ${guestsArr[0]}`;
          break;
        case 1:
          guests += space + `Дети до 7-ми лет - ${guestsArr[1]}`;
          break;
        case 2:
          guests += space + `Дети до 3-ёх лет - ${guestsArr[2]}`;
          break;
      }
    }
  }

  let titleToSend = `Новое бронирование!`;
  let nameToSend = space + `Имя клиента: ${firstName.value}`;
  let datesToSend = space + `Желаемые даты: ${dateInput.value}`;
  let guestsToSend = space + `Количество и возраст гостей: ${guests}`;
  let formattedSum = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(sum);
  let sumToSend = space + `Предварительная сумма: ${formattedSum}`;
  let url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=@samburova48&parse_mode=HTML&text=${titleToSend}${nameToSend}${datesToSend}${guestsToSend}${sumToSend}`;

  await fetch(url).then((res) => {
    if (res.ok) {
      confirm("Спасибо, за Ваш запрос! Мы свяжемся с Вами как можно скорее!");
      form.submit();
    } else {
      confirm("Что-то пошло не так, попробуйте позже");
    }
  });
}
