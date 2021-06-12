const http = require("http");
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const fs = require("fs");
var requests = require("requests");
const { constants } = require("buffer");
const homefile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, oregval) => {
    let temp = tempVal.replace("{%tempval%}",oregval.main.temp);
        temp = temp.replace("{%tempmin%}",oregval.main.temp_min);
        temp = temp.replace("{%tempmax%}",oregval.main.temp_max);
        temp = temp.replace("{%location%}",oregval.name);
        temp = temp.replace("{%coun%}",oregval.sys.country);
        temp = temp.replace("{%status%}",oregval.weather[0].main);
        temp = temp.replace("{%date%}",dateBuilder());
        return temp;
};
const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
        "http://api.openweathermap.org/data/2.5/weather?q=Panna&units=metric&appid=50c62cdc83daaee65ec07e38194ba980",
    )
      .on("data",  (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrayData = [objdata];
          const realtimedata = arrayData.map((val) =>replaceVal(homefile,val)).join("");
        res.write(realtimedata)
        console.log(objdata)
      })
      .on("end",  (err) => {
        if (err) return console.log("connection closed due to errors", err);

        console.log("end");
        res.end();
      });
  }
});

server.listen(port,() => {
    console.log(`Server running at port `+port);
  });
  
function dateBuilder () {
    let d = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
  }
