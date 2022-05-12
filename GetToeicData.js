const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const fs = require("fs");
const { MongoClient } = require("mongodb");

const writeTxt = (title, text) => {
  fs.writeFile(`/${title}.txt`, text, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  return;
};

const getHtml = async () => {
  try {
    const url = "https://exam.toeic.co.kr/receipt/examSchList.php";
    const htmlData = await axios.get(url);
    return htmlData;
  } catch (err) {
    console.log(err);
  }
};

getHtml().then((html) => {
  let ulList = [];

  const $ = cheerio.load(html.data);

  const bodyList = $("table.list.link_list tbody").children("tr");

  bodyList.each(function (i) {
    const sessNo = $(this)
      .children("td:first")
      .text()
      .replace(/★| |\t/g, "");

    const testDate = $(this)
      .children("td:eq(1)")
      .text()
      .replace(/\n| |\t/g, "");

    const annDate = $(this)
      .children("td:eq(2)")
      .text()
      .replace(/\n| |\t/g, "");

    const receiptDate = $(this)
      .find("td.fs_15 p")
      .text()
      .replace(/\n| |\t|정기접수|특별추가|/g, "")
      .split(":");

    const regRcpFrom = receiptDate[1].split("~")[0];
    const regRcpTo = receiptDate[1].split("~")[1];

    const addRcpFrom = receiptDate[2].split("~")[0];
    const addRcpTo = receiptDate[2].split("~")[1];

    ulList[i] = {};
    ulList[i]["sessNo"] = sessNo; // 시험 회차
    ulList[i]["testDate"] = strToDate(testDate);
    ulList[i]["annDate"] = strToDate(annDate);
    ulList[i]["regRcpFrom"] = strToDate(regRcpFrom);
    ulList[i]["regRcpTo"] = strToDate(regRcpTo);
    ulList[i]["addRcpFrom"] = strToDate(addRcpFrom);
    ulList[i]["addRcpTo"] = strToDate(addRcpTo);
  });

  // console.log(ulList);

  insertData(ulList, "local", "examList").catch(console.dir);
  // 여기서 insert
});

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
  return dateTime;
}

async function insertData(dataList, dbName, collectionName) {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();

    const database = client.db(dbName); // DB name
    const collection = database.collection(collectionName); // collection name

    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true };

    const result = await collection.insertMany(dataList, options);
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}
