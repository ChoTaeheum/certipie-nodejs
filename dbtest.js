const cheerio = require("cheerio");
const { slice } = require("cheerio/lib/api/traversing");

let regDate = "2022.03.14(월)오전10시~2022.04.18(월)오전10시";

// let st_regDate = regDate.split("~")[0];
// let en_regDate = regDate.split("~")[1];

// console.log(regDate.split("~"));
// console.log(st_regDate);
// console.log(en_regDate);

// function strToDate(str) {
//   str = str.replace(/\./g, "-").replace(/\(\W\)/g, "T");
//   date = str.slice(0, 11);
//   time = str.slice(11).replace(/시/, ":");

//   if (time.slice(0, 2) == "오전") {
//     time = time.slice(2) + "00:00";
//   } else {
//     time = 12 + Number(st_regDate.slice(2, -1)) + ":00:00";
//   }

//   dateTime = new Date(date + time);
// }

let date1 = "2023.01.05(목)낮12시";
let date2 = "2023.01.05(목)낮12시20분";
let date3 = "2022.10.15(토)오후7시10분";
let date4 = "2022.10.15(토)오후7시";
let date5 = "2022.10.30(일)오전11시";
let date6 = "2022.10.30(일)오전11시10분";

// dateTime = date.replace(/\./g, "-").replace(/\(\W\)/g, "T");

// time = dateTime.slice(11).replace(/오전|낮|분/g, "");

// 오후
// time1 = 12 + Number(time.match(/\후(.*)\시/)[1]);
// time2 = time.match(/\시(.*)/)[1];
// time = time1 + ":" + time2;

// const regex = new RegExp("오후(.):");
// time1 = regex.exec(time);

// console.log(time);

// 오전, 낮
// time1 = time.match(/(.*)\시/)[1].padStart(2, 0);
// time2 = time.match(/\시(.*)/)[1].padStart(2, 0);

// // console.log(time1.padStart(2, 0));
// console.log(time1 + ":" + time2);

function strToDate(str) {
  str = str.replace(/\./g, "-").replace(/\(\W\)/g, "T");
  date = str.slice(0, 11);
  time = str.slice(11).replace(/오전|낮|분/g, "");

  // 오후일 경우
  if (time.slice(0, 2) == "오후") {
    hour = 12 + Number(time.match(/\후(.*)\시/)[1]);
    minute = time.match(/\시(.*)/)[1].padStart(2, 0);

    // 분이 없을 경우
    if (minute == "") {
      time = hour + ":00";
    }
    // 분이 있을 경우
    else {
      time = hour + ":" + minute;
    }
  }

  // 낮, 오전일 경우
  else {
    hour = time.match(/(.*)\시/)[1].padStart(2, 0);
    minute = time.match(/\시(.*)/)[1].padStart(2, 0);
    time = hour + ":" + minute;
  }

  dateTime = new Date(date + time);
  console.log(dateTime);
}
