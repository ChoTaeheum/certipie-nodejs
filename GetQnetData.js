const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get(
      "https://www.q-net.or.kr/crf021.do?id=crf02101&gSite=Q&gId=&scheType=01"
    );
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then((html) => {
    let ulList = [];
    const $ = cheerio.load(html.data); // 인자로 html 문자열을 받아서 cheerio 객체를 반환
    console.log(html.data);
    // console.log("$: ", $);

    // children: 인자로 html selector를 문자열로 받아 cheerio 객체에서 선택된 html 문자열에서 해당하는 모든 태그들의 배열을 반환합니다.
    const $tableList = $(".cont_parbx").children("ul");
    console.log("tableList: ", $tableList);

    // each: 인자로 콜백함수 받아서 태그들의 배열을 순회하면서 콜백함수를 실행
    $tableList.each(function (i, elem) {
      ulList[i] = {
        rule: $(this).find("li").text(), // find: 인자로 html selector 문자열로 받아 해당하는 태그를 반환
      };
    });
    console.log("ulList: ", ulList);

    const data = ulList.filter((n) => n.rule);
    console.log("data: ", data);
    return data;
  })
  .then((res) => log(res));
