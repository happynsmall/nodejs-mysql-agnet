/****************************************************************************************************
 *  [Import Common Modules]
 ****************************************************************************************************/
// general
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv"); // environment setup
const cors = require('cors'); // CORS
const cron = require('node-cron'); // Cron

const mysql = require('mysql');

// custom
// const verify = require('./auth/verify-token'); // token  검사 

/****************************************************************************************************
 *  [Import Modules]
 ****************************************************************************************************/
// Route module
// const authRouter = require("./routes/auth"); // add a auth
// const bbsRouter = require('./routes/bbs'); // bbs api
// const userRouter = require('./routes/user'); // user api

// common module
const batchJob = require('./module/batch-job/batch.job')    // batch job

// db config
const nsmallDbConfig = require('./config/mysql.nsmall.db.js');

/****************************************************************************************************
 *  [Use Common Modules]
 ****************************************************************************************************/
// app.use(express.json()); // body 를  json으로 변경 
// app.use(cors());  // CORS 허용하기 


/****************************************************************************************************
 *  [Use Route Modules]
 ****************************************************************************************************/

// app.use("/api/auth", authRouter);  // prefix, /api/user/***  <- router에 정의된 resource 주소를 subfix로 함 
// app.use("/api/bbs", bbsRouter);  // bbs api
// app.use("/api/users", userRouter);  // bbs api


/****************************************************************************************************
 *  [초기화 작업]
 ****************************************************************************************************/
// 초기 환경 세팅 , mongodb
// dotenv.config();

// DB Connecting
// mongoose.connect(
//     process.env.MONGODB_CON,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     },
//     () => {
//         console.log("DB connecting ...");
//     }
// );

// mysql
const nsmallMysqlConn = mysql.createConnection(nsmallDbConfig);





/****************************************************************************************************
 *  [ Cron Job]
 ****************************************************************************************************/
// tb_user 동기화 배치잡
// cron.schedule('*/10 * * * * *', function () {
//     console.log('tbuser Sync Job Start -------');
//     batchJob.main.doNsmallTbuserSync(nsmallMysqlConn);

// });

// todo : product 동기화 배치잡
cron.schedule('*/10 * * * * *', function () {
    console.log('Nsmall product Sync Job Start -------');
    batchJob.main.doNsmallProductJobSync(nsmallMysqlConn);
});


//kafkaConsumerApi.main.doStart();

/****************************************************************************************************
 *  [ Server Port & Start ]
 ****************************************************************************************************/
// port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on  port ${port}`));