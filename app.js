const https = require("https");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const fs = require('fs');
let tempUserData = '';

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendStatus(200);
});
app.get("/push", (req, res) => {
  console.log("test1");
  res.send(`HTTP POST request sent to the push URL!`+ tempUserData);
  console.log("test2");
  //res.send(`HTTP POST request sent to the push URL!`);
  const messages = [{ type: "text", text: "push message!", }];
  // pushMessage(messages, userData);
  pushMessage(messages);
});

// app.post("/webhook", function (req, res) {
//   res.send("HTTP POST request sent to the webhook URL!");
// });

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  //プッシュメッセージテストここから
  switch (req.body.events[0].type) {
  //   case "follow":
  //     case "message":
      case "join":
        console.log("webhook");
        // const userData = { userId: req.body.events[0].source.userId }
        // fs.writeFileSync('./user_data.json', JSON.stringify(userData));
        const groupData = { userId: req.body.events[0].source.groupId }
        fs.writeFileSync('./user_data.json', JSON.stringify(groupData));
        
        tempUserData = JSON.stringify(req.body.events[0]);
}

  //プッシュメッセージテストここまで

  //応答メッセージテストここから
  // ユーザーがボットにメッセージを送った場合、応答メッセージを送る
  /*
  if (req.body.events[0].type === "message") {
    // APIサーバーに送信する応答トークンとメッセージデータを文字列化する
    const dataString = JSON.stringify({
      // 応答トークンを定義
      replyToken: req.body.events[0].replyToken,
      // 返信するメッセージを定義
      messages: [
        {
          type: "text",
          text: "Hello, user",
        },
        {
          type: "text",
          text: "May I help you?",
        },
      ],
    });

    // リクエストヘッダー。仕様についてはMessaging APIリファレンスを参照してください。
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    };

    // Node.jsドキュメントのhttps.requestメソッドで定義されている仕様に従ったオプションを指定します。
    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    // messageタイプのHTTP POSTリクエストが/webhookエンドポイントに送信された場合、
    // 変数webhookOptionsで定義したhttps://api.line.me/v2/bot/message/replyに対して
    // HTTP POSTリクエストを送信します。

    // リクエストの定義
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    // エラーをハンドリング
    // request.onは、APIサーバーへのリクエスト送信時に
    // エラーが発生した場合にコールバックされる関数です。
    request.on("error", (err) => {
      console.error(err);
    });

    // 最後に、定義したリクエストを送信
    request.write(dataString);
    request.end();
  }
  */
  //応答メッセージテストここまで
});

//プッシュメッセージの送信処理テストここから
// function pushMessage(messages, userData) {
  function pushMessage(messages) {
  const HEADERS = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
  };

  const userData = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
  const groupId = userData.groupId;
  console.log('groupData',groupId);
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
//プッシュメッセージの送信処理テストここまで