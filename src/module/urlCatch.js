const request= require('request-promise')
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

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
// const url = "http://www.txzqw.me/read-htm-tid-357213.html";

const  catchLink= async (url)=>{
    var options = {
        url: url,
        encoding: null,
        headers: headers
      };
const [err,data]= await to(request(options))
console.log(err,data)

}

module.exports= catchLink

// function request(url, callback) {
//   var options = {
//     url: url,
//     encoding: null,
//     headers: headers
//   };
//   originRequest(options, callback);
// }


// request(url, function(err, res, body) {
//   const html = iconv.decode(body, "gb2312");   // 中文编码解码
//   const $ = cheerio.load(html, { decodeEntities: false });
//   const content = $("#read_tpc")
//     .html()
//     .split("<br><br><br>")
//     .filter(item => {
//       return item.includes(": <a");
//     });
//   const dataList = content.map(item => {
//     const arr = item.split(": ");
//     return {
//       title: arr[0],
//       url: $(arr[1]).text()
//     };
//   });

//   console.log(dataList)
  
 
// });
