const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const fs = require("fs");

const getHtml = async () => {
  try {
    const url =
      "https://www.q-net.or.kr/crf021.do?id=crf02101s01&IMPL_YY=2022&SERIES_CD=01";
    const htmlData = await axios.get(url, { responseType: "arraybuffer" });
    const decoded = iconv.decode(htmlData.data, "EUC-KR");
    return decoded;
  } catch (err) {
    console.log(err);
  }
};

getHtml().then((html) => {
  let ulList = [];

  const $ = cheerio.load(html);

  const bodyList = $("ul.list.num").children("li");

  bodyList.each(function (i) {
    ulList[i] = $(this).html().split("<")[0]; // 자식의 자식 제외, 논리 아직 모름 ㅋㅋㅋ
  });
  console.log(ulList);
});
