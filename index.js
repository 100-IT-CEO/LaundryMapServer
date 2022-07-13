
const express = require('express');
const app = express();
const router = express.Router();
const port = 80;
const mysql = require('mysql');
​
const connection = mysql.createConnection({
    host : '143.248.199.123',
    user : 'root',
    password : '1234',
    database : 'washteriadb'
});
​


app.get("/test", function(req, res){
​
​      sql = 'INSERT INTO reservation(reserve_id, machine_id,kakao_id, reserve_start_time) VALUES(1,1,"123","7");'
    // db 접속
    connection.connect();
    connection.query(sql, (error, rows, fields) => {
        if(error) throw error;
        console.log(rows);
        res.send({
        "hello": rows
        });
    });
    connection.end();
    // 로직으로 뭔가를 계산해서
});
​
app.get('/', function(req, res, next) {
​
    next();
});
​
app.post('/', function(request, response) {
    console.log(request.body);
});
​
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
​
// nodejs mysql connectionpool
// 동기, 비동기 방식
// express router
// mysql
