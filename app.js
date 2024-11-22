const https = require("https");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
// const nodemailer = require('nodemailer');
const fs = require('fs');
// const request = require('request');
let tempUserData = '';
let tempGroupData = '';
let tempUserDataOrg = '';

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendStatus(200);
});
// app.get("/push", (req, res) => {
//   console.log("test1");
//   res.send(`HTTP POST request sent to the push URL!` + tempUserData + tempGroupData);
//   const groupId = tempUserDataOrg.source.groupId;
//   const HEADERS = {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + TOKEN,
//   };
//   fetch("https://api.line.me/v2/bot/group/" + groupId + "/summary", { headers: HEADERS })
//     .then(responce => { jsonData = responce.json(); return jsonData })
//     .then(responce2 => {
//       if (responce2) {
//         console.log("test2", responce2.groupId, responce2.groupName);
//         return true;
//       } else {
//         console.log("test-false", responce2);
//         return false;
//       }
//     })
//     .catch(err => console.log(err));
//   //res.send(`HTTP POST request sent to the push URL!`);
//   const messages = [{ type: "text", text: "push message!", }];
//   // pushMessage(messages, userData);
//   pushMessage(messages);
// });

// app.post("/webhook", function (req, res) {
//   res.send("HTTP POST request sent to the webhook URL!");
// });

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  //検証
  // console.log("res", res);
  // console.log("req", req);
  // console.log("req.body", req.body);
  //検証ここまで
  
  //プッシュメッセージテストここから
  console.log("type", req.body.events[0]);
  switch (req.body.events[0].type) {
    //   case "follow":
    //     case "message":
    case "join":
      console.log("webhook");
      const userData = req.body.events[0].source.userId;
      // fs.writeFileSync('./user_data.json', JSON.stringify(userData));
      const groupData = { groupId: req.body.events[0].source.groupId }
      fs.writeFileSync('./user_data.json', JSON.stringify(groupData));
      tempUserDataOrg = req.body.events[0];
      tempUserData = userData;
      tempGroupData = JSON.stringify(req.body.events[0]);
      const groupId = tempUserDataOrg.source.groupId;
        const HEADERS = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + TOKEN,
        };
        fetch("https://api.line.me/v2/bot/group/" + groupId + "/summary", { headers: HEADERS })
          .then(responce => { jsonData = responce.json(); return jsonData })
          .then(responce2 => {
            if (responce2) {
              console.log("test2", responce2.groupId, responce2.groupName);
              const messages = [{ type: "text", text: "push message!", }];
              // pushMessage(messages, userData);
              pushMessage(messages);
              return true;
            } else {
              console.log("test-false", responce2);
              return false;
            }
          })
          .catch(err => console.log(err));
      
  };

});

function pushMessage(messages) {
  const HEADERS = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + TOKEN,
  };

  const userData = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
  const groupId = userData.groupId;
  console.log('groupData', groupId);
  // const userId = userData.userId;
  const dataString = JSON.stringify({
    // to: userId,
    to: groupId,
    messages: messages,
  });
  console.log("test3");
  const webhookOptions = {
    hostname: "api.line.me",
    path: "/v2/bot/message/push",
    method: "POST",
    headers: HEADERS,
    body: dataString,
  }
  console.log("test4");
  const request = https.request(webhookOptions, res => {
    console.log("test5");
    res.on("data", d => {
      process.stdout.write(d);
    });
    console.log("test6");
  });
  request.on("error", err => {
    console.log("test7");
    console.error(err);
  });
  console.log("test6.5");
  request.write(dataString);
  console.log("test8");
  request.end();
  console.log("test9");
}