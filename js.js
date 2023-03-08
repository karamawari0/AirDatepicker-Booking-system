let firstName = document.querySelector('[data-id="name"]');
let dateInput = document.querySelector('[data-id="checkinout"]');
const guestCounters = document.querySelectorAll(".number");
const guestsNumberArray = Array.from(guestCounters);
const form = document.getElementById("form");
const space = "%0A";
var currDate;
const priceLow = [900, 1200, 1600];
const priceMedium = [1200, 1600, 2200];
const priceHigh = [1600, 2200, 2800];

//Токен бота в телеграмме (нужно захешить, закодировать и т.д.)
const TELEGRAM_TOKEN = "HERE_GOES_YOUR_TELEGRAM_TOKEN";
//Задать стартовую дату и инициализировать календарь
let startDate = new Date();

let juneOrSeptemberDates = populateArr(1, 10),
  mayDates = populateArr(20, 31),
  augustDates = populateArr(1, 25);

new AirDatepicker("#airdatepicker", {
  inline: false,
  position: "bottom center",
  //Окрасить клетки календаря в разные цвета согласно ценовому периоду (пока не понял, как выбрать конкретный месяц + день, только месяц целиком)
  onRenderCell({ date, cellType }) {
    let isDay = cellType === "day",
      _date = date.getDate();

    if (cellType === "day") {
      let IsMay = isDay && mayDates.includes(_date),
        IsJune = (IsSeptember = isDay && juneOrSeptemberDates.includes(_date)),
        IsaugustDates = isDay && augustDates.includes(_date);

      if (date.getMonth() === 4) {
        return {
          classes: IsMay ? "-green-" : undefined,
        };
      }

      if (date.getMonth() === 5) {
        return {
          classes: IsJune ? "-green-" : "-yellow-",
        };
      }

      if (cellType === "day") {
        if (date.getMonth() === 6) {
          return {
            classes: "-red-",
          };
        }
      }

      if (date.getMonth() === 7) {
        return {
          classes: IsaugustDates ? "-red-" : "-yellow-",
        };
      }

      if (date.getMonth() === 8) {
        return {
          classes: IsSeptember ? "-yellow-" : undefined,
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
  //Если не заданы даты вывести "ОЖИДАЕМАЯ СТОИМОСТЬ: ХХХ"
  if (typeof date[0] == "undefined") {
    return (document.getElementById(
      "price"
    ).innerHTML = `ЗАПОЛНИТЕ ПОЛЯ, ЧТОБЫ УЗНАТЬ ЦЕНУ`);
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

    if (sum != 0) {
      return (document.getElementById(
        "price"
      ).innerHTML = `ОЖИДАЕМАЯ СТОИМОСТЬ: ${formatSum(sum)}`);
    } else {
      return (document.getElementById(
        "price"
      ).innerHTML = `ЗАПОЛНИТЕ ПОЛЯ, ЧТОБЫ УЗНАТЬ ЦЕНУ`);
    }
  }

  sum = 0;
  var dateString = date[0];
  var dateObj = new Date(dateString);
  var momentObj = moment(dateObj);
  momentObj = momentObj.hour(0);
  calcPrice(momentObj);
  // console.log(sum);

  if (sum != 0) {
    document.getElementById(
      "price"
    ).innerHTML = `ОЖИДАЕМАЯ СТОИМОСТЬ: ${formatSum(sum)}`;
  } else {
    document.getElementById(
      "price"
    ).innerHTML = `ЗАПОЛНИТЕ ПОЛЯ, ЧТОБЫ УЗНАТЬ ЦЕНУ`;
  }
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
  const roomType = document.getElementById("roomSelect").value;
  telephone_number.value;
  switch (roomType) {
    case "double":
      sum += priceModifier[0];
      break;
    case "triple":
      sum += priceModifier[1];
      break;
    case "cuatro":
      sum += priceModifier[2];
      break;
  }
}

//Посчитать даты
function populateArr(start, end) {
  arr = [];
  for (i = start; i <= end; ++i) {
    arr.push(i);
  }
  return arr;
}

//Отменить действие по-умолчанию - обновление страницы
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

document.getElementById("roomSelect").addEventListener("change", function () {
  getDate(currDate);
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

//Отформатировать сумму
function formatSum(sum) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(sum);
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
  let formattedSum = formatSum(sum);
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
