# 개요
kafka connector를 이용하여 CQRS 패턴을 구현한 배치 에이전트 모듈이다.
mariadb(mdgoods's database)를 소스데이터로 데이터가 추가 또는 변경되면 kafka connector가 이를 인지하여 kafka topic으로 전달한다. topic에 전달된 데이터는 nodejs 배치 에이전트 모듈내에 subscribe 기능을 구현하여 타겟 서버(happygoods's mysql)로 업데이트 한다. 

주요 키워드
- nodejs : 배치 에이전트 모듈
- mariadb : source database
- mysql : target database
- kafka : 메시지 서버
- kafka connector : mariadb에서 cdc로 데이터를  kafka topic에 전송하는 커넷터 모듈
- kafka rest proxy : topic에서 데이터를 읽을 수 있도록 API를 제공하는 Rest Proxy server
- kafka-client : kafka에 정보를 설정하기 위해 사용하는 모듈

# 초기화 
## software installation
node로 개발하기 위해 필요한 프로그램 목록
- window(heidisql), mac(dbeaver)
- node.js

## npm 초기화 
npm install

## DB Script 작성
```
CREATE TABLE `md_goods_bas` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `GOODS_CD` varchar(100) DEFAULT '10000000' NOT NULL ,
  `GOODS_NM` varchar(100)  NOT NULL,
  `GOODS_PRICE` varchar(100)  NOT NULL,
  `GOODS_IMG` varchar(100)  NOT NULL,
  `updated` timestamp default CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_goods` (`updated`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
```

## kafka topic monitoring
su - jhchoi 로 변경 후 아래 스크립트 수행
```
kubectl -n lab99 exec -ti \
    kafka-client -- /usr/bin/kafka-console-consumer \
    --bootstrap-server confluent-cp-kafka-headless:9092 \
    --topic k8s-connect-user05-md_goods_bas --from-beginning

```

## kafka 연계 배치 로그 확인

```
k logs -f nodejs-mysql-agent-0 -n nsmall
```
