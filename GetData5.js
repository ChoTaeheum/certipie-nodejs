const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const fs = require("fs");

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

  // writeTxt("toeic", html.data);

  const $ = cheerio.load(html.data);

  const bodyList = $("table.list.link_list tbody").children("tr");

  // console.log(bodyList.text());

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

    const regRcp = $(this).children("td:eq(3)").text();
    // console.log(regRcp);

    ulList[i] = {};
    ulList[i]["sessNo"] = sessNo; // 시험 회차
    ulList[i]["testDate"] = testDate;
    ulList[i]["annDate"] = annDate;
    ulList[i]["regRcp"] = "";
    ulList[i]["addRcp"] = "";
  });
  console.log(ulList);
});
