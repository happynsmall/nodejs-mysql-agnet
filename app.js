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
const userRouter = require('./routes/user'); // user api

// common module
const kafkaConsumerApi = require('./batch/kafka.consumer.api'); // batch job
const mysqlJob = require('./batch/mysql.tbuser.job'); // batch job

// db config
const dbconfig = require('./config/mysql.js');

/****************************************************************************************************
 *  [Use Common Modules]
 ****************************************************************************************************/
app.use(express.json()); // body 를  json으로 변경 
app.use(cors());  // CORS 허용하기 


/****************************************************************************************************
 *  [Use Route Modules]
 ****************************************************************************************************/

// app.use("/api/auth", authRouter);  // prefix, /api/user/***  <- router에 정의된 resource 주소를 subfix로 함 
// app.use("/api/bbs", bbsRouter);  // bbs api
app.use("/api/users", userRouter);  // bbs api


/****************************************************************************************************
 *  [초기화 작업]
 ****************************************************************************************************/
// 초기 환경 세팅 
dotenv.config();

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

const connection = mysql.createConnection(dbconfig);





/****************************************************************************************************
 *  [ Cron Job]
 ****************************************************************************************************/
cron.schedule('*/10 * * * * *', function () {
    console.log('Sync Job Start -------');


    var retData = kafkaConsumerApi.main.doStart(function (retData) {
        if (retData.length > 0) {
            retData.forEach((data) => {
                console.log(data.value.id);
                // // data insert 
                mysqlJob.main.doStart(connection, data.value);
            });

        } else {
            console.log('연게 데이터가 없습니다.');
        }
    });
    console.log(retData);

    // var retData = [
    //     {
    //         topic: 'k8s-connect-tb_user',
    //         key: null,
    //         value: {
    //             id: 4,
    //             user_id: 'dd',
    //             user_nm: 'test',
    //             addr: null,
    //             cell_phone: null,
    //             agree_info: null,
    //             birth_dt: null,
    //             updated: 1617609851000
    //         },
    //         partition: 0,
    //         offset: 0
    //     },
    //     {
    //         topic: 'k8s-connect-tb_user',
    //         key: null,
    //         value: {
    //             id: 5,
    //             user_id: 'jhchoi',
    //             user_nm: 'choi',
    //             addr: 'test',
    //             cell_phone: null,
    //             agree_info: 'aa',
    //             birth_dt: '20200101',
    //             updated: 1617609851000
    //         },
    //         partition: 0,
    //         offset: 1
    //     }
    // ];




});


//kafkaConsumerApi.main.doStart();

/****************************************************************************************************
 *  [ Server Port & Start ]
 ****************************************************************************************************/
// port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on  port ${port}`));