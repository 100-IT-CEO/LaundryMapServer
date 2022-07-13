const express = require('express'); 
const { request } = require('http');
const path = require('path')// 파일 경로 모듈
require('dotenv').config({ path: path.join(__dirname, './env/server.env') });//env 로드 모듈
const mysql = require('./db/db'); // 싱글톤 패턴

const app = express(); 
app.use(express.json())
const port = process.env.PORT || 80; 


//세탁소 아이디 주면 세탁소 아이디에 맞는 column 주기
app.get("/washteria_location",(req, res)=>{
    const sql= 'select * from washteria;'
    try {
        console.log(req);
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});

//세탁기 id에 맞는 정보 주기
app.get("/washteria_location/:id",(req,res)=>{
    const id = req.params.id;
    sql=`select * from washteria where washteria_id=${id};`
    try {
        console.log(req);
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
})

//예약하기 
app.post("/create_reservation",(req,res)=>{
    const machine_id = req.query.machine_id;
    const kakao_id = req.query.kakao_id;
    const reserve_start_time = req.query.reserve_start_time;
    console.log(typeof parseInt(machine_id));
    console.log(typeof kakao_id);
    console.log(typeof reserve_start_time);
    console.log(machine_id, kakao_id, reserve_start_time);
    var sql1= `update machine set status = 2 where machine_id = ${machine_id};`
    var sql2= ` insert into reservation (machine_id, kakao_id, reserve_start_time, reservation_status) values (${machine_id}, "${kakao_id}", "${reserve_start_time}", 1);`
    var sql3 = `update reservation set reservation_status = 0 where machine_id = ${machine_id};`
    try {
         mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql1, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
            });
            connection.release(); // Connectino Pool 반환
        });
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql2, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                      
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result : {}
                        });
                        setTimeout(function(){
                            connection.query(sql3,(err,result,fields)=>{
                                console.log("완료");
                            })
                            console.log('timeout');
                        },600000);
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
        });
        
    
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
})

//머신아이디 받으면 바로 다 주기 
//세탁기 id에 맞는 정보 주기
app.get("/machine_info",(req,res)=>{
    const machine_id = req.query.machine_id;
    sql=`select * from machine where machine_id=${machine_id};`
    try {
        console.log(req);
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
})

//사용시작 
app.post("/using_machine",(req,res)=>{
    const machine_id = req.query.machine_id;
    const kakao_id = req.query.kakao_id;
    const date = req.query.date;
    var operation_time=req.query.operation_time;
    sql=`insert into UsageList (machine_id, kakao_id, date, operation_time) values("${machine_id}", "${kakao_id}","${date}","${operation_time}");`
    sql2=`update UsageList set useage_status=0 where machine_id = ${machine_id};`
    try {
        console.log(req);
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                        operation_time= Number(operation_time)*60*1000;
                        setTimeout(function(){
                            connection.query(sql2,(err,result,fields)=>{
                            
                            })
                            console.log('timeout');
                        },operation_time);
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
})


//제일 최근의reservation 
app.get("/reservation/recent",(req, res)=>{
    const kakao_id = req.query.kakao_id
    console.log(typeof id);
    const sql= `SELECT Washteria.name, Machine.machine_type, LastReservation.reserve_start_time, LastReservation.reservation_status
    FROM User 
    LEFT JOIN (
       SELECT machine_id, reserve_start_time, reservation_status, kakao_id FROM Reservation WHERE kakao_id = "${kakao_id}" ORDER BY reserve_start_time DESC LIMIT 1
    ) AS LastReservation USING(kakao_id)
    LEFT JOIN Machine USING(machine_id)
    LEFT JOIN Washteria USING(washteria_id)
    WHERE kakao_id = "${kakao_id}"`
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});


//사용자 id로 예약 조회 
app.get("/user",(req, res)=>{
    const kakao_id = req.query.kakao_id;
    console.log(typeof id);
   
    var sql =  `select * from user where kakao_id =${kakao_id} `
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET"); 
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });

            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});

//사용자 id로 예약 조회 
app.get("/load_reservation",(req, res)=>{
    const id = req.query.id;
    console.log("여기 이상함");
    var sql =  `select * from reservation where kakao_id =${id} order by reserve_id desc limit 1`
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET"); 
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });

            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});


//머신 상태 0 : 사용안함  
//머신 상태 2: 예약중

//예약 상태 0: 예약없음
//예약상태 1: 예약중 
//머신상태를 2-> 0 , 예약상태를 1-> 0 
app.get("/reservation/cancel",(req, res)=>{
    const id = req.query.id;
    var sql = `Update machine set status=0 where machine_id in (select machine_id from reservation where kakao_id = ${id}) ; `
    var sql2 = `Update reservation set reservation_status=0 where kakao_id = ${id} ; `
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
            });
            connection.release(); // Connectino Pool 반환
        });
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql2, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
        });
        
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});

//washteria i를 다 받고 관련된 아이디 다 
app.get("/washteria_machines",(req, res)=>{
    const id = req.query.id;
    var sql = `select * from machine where washteria_id = ${id} ; `
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });

            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});

app.post("/create_user",(req, res)=>{
    const kakao_id = req.query.kakao_id;
    const nickname = req.query.nickname;
    const user_img=req.query.user_img;  
    console.log("*******************************");
    console.log( kakao_id,nickname, user_img);
    var sql= ` insert into user (kakao_id, nickname, user_img) values ("${kakao_id}", "${nickname}", "${user_img}");`
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });

            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});


//이용 기록 추가 
app.post("/create_useageList",(req, res)=>{
    const machine_id = req.query.machine_id;
    const kakao_id = req.query.kakao_id;
    const date = req.query.date;
    const operation_time=req.query.operation_time;  
    console.log("*******************************");
    var sql= `insert into UsageList (machine_id, kakao_id, date, operation_time) Values(${machine_id},"${kakao_id}","${date}","${operation_time}"); `
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool POST");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool post Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });

            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});

//모든 예약조회
app.get("/reservation",(req, res)=>{
    const sql= 'select * from reservation;'
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool GET");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool GET Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });
            connection.release(); // Connectino Pool 반환
            console.log("여기 끝");
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});

//사용자의 이용기록 가져오기 
app.get("/load_useageList",(req, res)=>{
    const kakao_id = req.query.kakao_id;
    console.log("*******************************");
    var sql= `SELECT Washteria.name, Machine.machine_type, UsageList2.date, UsageList2.operation_time
    FROM User
    LEFT JOIN (
        SELECT machine_id, date, kakao_id, operation_time FROM UsageList WHERE kakao_id = "${kakao_id}" ORDER BY date DESC
    ) AS UsageList2 USING(kakao_id)
    LEFT JOIN Machine USING(machine_id)
    LEFT JOIN Washteria USING(washteria_id)
    WHERE kakao_id = "${kakao_id}";`
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool POST");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool post Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        });
                    }
                }
            });

            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});

//사용자의 제일 최근 이용기록 가져오기 
app.get("/load_useageList/recent",(req, res)=>{
    const kakao_id = req.query.kakao_id;
    console.log("*******************************");
    var sql= `SELECT Washteria.name, Machine.machine_type, UsageList2.date, UsageList2.operation_time, UsageList2.useage_status
    FROM User
    LEFT JOIN (
        SELECT machine_id, date, kakao_id, operation_time, useage_status FROM UsageList WHERE kakao_id = "${kakao_id}" ORDER BY date DESC limit 1
    ) AS UsageList2 USING(kakao_id)
    LEFT JOIN Machine USING(machine_id)
    LEFT JOIN Washteria USING(washteria_id)
    WHERE kakao_id = "${kakao_id}";`
    try {
        mysql.getConnection((err, connection)=>{ // Connection 연결
            console.log("connection_pool POST");
            if(err) throw err;
            connection.query(sql, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.error("connection_pool post Error / "+err);
                    res.status(500).send("message : Internal Server Error");
                }
                else {
                    if(result.length === 0){
                        res.status(400).send({
                            success : false,
                            message : "DB response Not Found"
                        });
                    }
                    else{
                        res.status(200).send({
                            success : true,
                            result
                        }
                        
                        );
                    }
                }
            });

            connection.release(); // Connectino Pool 반환
        });
    } catch (err) {
        console.error("connection_pool GET Error / "+err);
        res.status(500).send("message : Internal Server Error");
    }        
});


app.listen(port, () => console.log(`Server Start Listening on port ${port}`));

