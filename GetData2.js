const request = require("request");

request.get(
  {
    url: "https://www.tistory.com/",
  },
  function (err, res, body) {
    console.log(body);
  }
);
