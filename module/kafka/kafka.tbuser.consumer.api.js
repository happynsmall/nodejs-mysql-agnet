const axios = require('axios');

/****************************************************************************************************
 *  [ kafka consumer manage api]
 ****************************************************************************************************/
const main = {
    doStart(callback) {
        this.callApi(callback);
    },

    consumer: {
        url: "http://169.56.84.35:30432/consumers/",
        group: "tb-user_consumer-02",
        instance: "tb-user_consumer-02_instance",
        topic: "k8s-connect-tb_user"
    },
    callApi(callback) {
        var url = main.consumer.url + main.consumer.group + "/instances/" + main.consumer.instance + "/records ";
        console.log("Get data from kafka consumer groups Start .....");
        console.log(url);
        /*
                curl -X GET -H "Accept: application/vnd.kafka.json.v2+json" \
                http://169.56.84.35:30432/consumers/tb_user/instances/tb_user-instnace/records 
        */
        axios.get(
            url,
            {
                headers: {
                    "Accept": "application/vnd.kafka.json.v2+json"
                }
            })
            .then(response => {
                if (response.status === 200) {
                    console.log("Api results : " + response.data.length);
                    return callback(response.data);
                } else {
                    return [];
                }

            })
            .catch(error => {
                //console.log(error);
                if (error.response.data) {
                    console.log("등록된 컨슈머 그룹이 없습니다. : " + error.response.data.error_code);
                    this.callMakeConsumer();
                }
                //console.log(error.request.data);
                console.log("ERR:" + error.request.data);
            });
    },
    callMakeConsumer() {
        console.log("컨슈머 그룹을 생성 합니다.");
        var url = main.consumer.url + main.consumer.group;
        console.log(url);
        /*
        curl -X POST -H "Content-Type: application/vnd.kafka.v2+json" \
              --data '{"name": "tb-user_consumer-02_instance", "format": "json", "auto.offset.reset": "earliest"}' \
              http://169.56.84.35:31988/consumers/tb-user_consumer-02 
        */
        axios.post(
            url,
            {
                "name": main.consumer.instance,
                "format": "json",
                "auto.offset.reset": "earliest",
                "consumer.request.timeout.ms": "5000", // 작은면 2번 콜해야 함
            },
            {
                headers: {
                    "Content-Type": "application/vnd.kafka.v2+json"
                }

            })
            .then(response => {
                console.log(response.data);
                //console.log("subscribe 등록 합니다. ");
                this.callMakeConsumerSubscribe();
                // console.log(response.data.url);
                // console.log(response.data.explanation);

            })
            .catch(error => {
                console.log("subscrib err code :" + error.response.data.error_code);
                if (error.response.data.error_code === 40902) {
                    console.log("subscribe 호출 합니다. ");
                    this.callMakeConsumerSubscribe();
                } else {
                    console.log("subscribe 호출을 진행하지 않습니다.  ");

                }
                //console.log(error.response.data);
                //console.log("ERR:" + error.request);
            });
    },
    callMakeConsumerSubscribe() {
        console.log("Subscribe 등록 시작");
        var url = main.consumer.url + main.consumer.group + "/instances/" + main.consumer.instance + "/subscription";
        console.log(url);
        /*
            curl -X POST -H "Content-Type: application/vnd.kafka.v2+json" --data '{"topics":["k8s-connect-tb-user"]}' \
            http://169.56.84.35:31988/consumers/tb-user_consumer-02/instances/tb-user_consumer-02_instance/subscription
        */

        var topics = [];
        topics.push(main.consumer.topic);
        console.log(topics[0]);

        axios.post(
            url,
            {
                "topics": topics
            },
            {
                headers: {
                    "Content-Type": "application/vnd.kafka.v2+json"
                }

            })
            .then(response => {
                console.log(response.status);
                console.log(response.data);
                console.log("subscribe 등록을 완료 하였습니다. ");
                // console.log(response.data.url);
                // console.log(response.data.explanation);

            })
            .catch(error => {
                console.log(error);
                if (error.response.data) {
                    // callMakeConsumer();
                }
                console.log(error.response.data);
                //console.log("ERR:" + error.request);
            });
    }
}

module.exports.main = main;