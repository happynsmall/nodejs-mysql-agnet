const kafkaConsumerApi = require('../kafka/kafka.consumer.api'); // kafka consumer api
const nsmallTbuserJob = require('../batch-sync/mysql.nsmall.tbuser.sync'); // tb-user batch sync
const nsmallProductJob = require('../batch-sync/mysql.nsmall.product.sync'); // product batch sync


/****************************************************************************
 * batch job
*****************************************************************************/
const main = {
    consumer: {
        url: "http://169.56.84.35:30432/consumers/",
    },
    /*----------------------------------------------------------------------------
     *  JOB : tb_user table  동기화 
     *----------------------------------------------------------------------------*/
    doNsmallTbuserJobSync(connection) {

        // consumer 정보 정의 
        //-------------------------------------------------------------------------
        this.consumer.group = "tb-user_consumer-02";
        this.consumer.instance = "tb-user_consumer-02_instance";
        this.consumer.topic = "k8s-connect-tb_user";
        //-------------------------------------------------------------------------

        var retData = kafkaConsumerApi.main.doStart(function (retData) {
            if (retData.length > 0) {
                retData.forEach((data) => {
                    console.log(data.value.id);
                    // // data insert 
                    nsmallTbuserJob.main.doStart(connection, data.value);
                });

            } else {
                console.log('연게 데이터가 없습니다.');
            }
        }, this.consumer);
        console.log(retData);

    },
    /*----------------------------------------------------------------------------
     *  JOB : product table 동기화 
     *----------------------------------------------------------------------------*/
    doNsmallProductJobSync(connection) {

        // consumer 정보 정의 
        //-------------------------------------------------------------------------
        this.consumer.group = "tb-product_consumer-02";
        this.consumer.instance = "tb-product_consumer-02_instance";
        this.consumer.topic = "k8s-connect-user05-md_goods_bas";
        //-------------------------------------------------------------------------

        var retData = kafkaConsumerApi.main.doStart(function (retData) {
            if (retData.length > 0) {
                retData.forEach((data) => {
                    console.log(data.value.id);
                    // // data insert 
                    nsmallProductJob.main.doStart(connection, data.value);
                });
    
            } else {
                console.log('연게 데이터가 없습니다.');
            }
        }, this.consumer);
        console.log(retData);

       


    }

}
module.exports.main = main;