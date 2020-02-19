const request = require('request-promise')
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const path = window.require("path")

function to(promise) {
  return promise
    .then(data => {
      return [null, data]
    })
    .catch(err => [err, null])
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36"
};

const catchLink = async (url) => {
  var options = {
    url: url,
    encoding: null,
    headers: headers
  };
  const [err, body] = await to(request(options))
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err)
    } else {
      try {
        const html = iconv.decode(body, "gb2312");   // 中文编码解码
        const $ = cheerio.load(html, { decodeEntities: false });
        const content = $("#read_tpc").html().split("<br><br><br>")
          .filter(item => {
            return item.includes(": <a");
          });
        const dataList = content.map(item => {
          const arr = item.split(": ");
          const url = $(arr[1]).text()
          return {
            title: arr[0],
            url: url,
            key: path.parse(url).name
          };
        }).filter(item => !!item.url);
        return resolve(dataList)
      } catch (err) {
        return reject(err)
      }
    }
  })
}

module.exports = catchLink

