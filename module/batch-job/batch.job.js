const kafkaTbuserConsumerApi = require('../kafka/kafka.tbuser.consumer.api'); // tb_user consumer api
const kafkaProductConsumerApi = require('../kafka/kafka.product.consumer.api'); // tb_product consumer api
const nsmallTbuser = require('../batch-sync/mysql.nsmall.tbuser.sync'); // tb-user batch sync
const nsmallProduct = require('../batch-sync/mysql.nsmall.product.sync'); // product batch sync


/****************************************************************************
 * batch job
*****************************************************************************/
const main = {
    /*----------------------------------------------------------------------------
     *  JOB : tb_user table  동기화 
     *----------------------------------------------------------------------------*/
    doNsmallTbuserSync(connection) {
        var retData = kafkaTbuserConsumerApi.main.doStart(function (retData) {
            if (retData.length > 0) {
                retData.forEach((data) => {
                    console.log(data.value.id);
                    // // data insert 
                    nsmallTbuser.main.doStart(connection, data.value);
                });

            } else {
                console.log('연게 데이터가 없습니다.');
            }
        });
        console.log(retData);

    },
    /*----------------------------------------------------------------------------
     *  JOB : product table 동기화 
     *----------------------------------------------------------------------------*/
    doNsmallProductSync(connection) {
        var retData = kafkaProductConsumerApi.main.doStart(function (retData) {
            // todo : 개발시 아래 항목을 주석 해제하고 작업할 것
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
            if (retData.length > 0) {
                retData.forEach((data) => {
                    console.log(data.value.id);
                    // // data insert 
                    nsmallProduct.main.doStart(connection, data.value);
                });

            } else {
                console.log('연게 데이터가 없습니다.');
            }
        });
        console.log(retData);


    }

}
module.exports.main = main;