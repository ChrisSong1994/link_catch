const http = require("http");
const originRequest = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const nodeExcel = require('excel-export');

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36"
};
const url = "http://www.txzqw.me/read-htm-tid-357213.html";

function request(url, callback) {
  var options = {
    url: url,
    encoding: null,
    headers: headers
  };
  originRequest(options, callback);
}


request(url, function(err, res, body) {
  const html = iconv.decode(body, "gb2312");
  const $ = cheerio.load(html, { decodeEntities: false });
  const content = $("#read_tpc")
    .html()
    .split("<br><br><br>")
    .filter(item => {
      return item.includes(": <a");
    });
  const dataList = content.map(item => {
    const arr = item.split(": ");
    return {
      title: arr[0],
      url: $(arr[1]).text()
    };
  });

  console.log(dataList)
  
 
});
