
/****************************************************************************
 * 상품 동기화 job
*****************************************************************************/
const main = {
    doStart(connection, data) {
        this.update(connection, data);
    },
    update(connection, data) {
        // todo : 쿼리 수정해야 함
        var query = "update md_goods_bas set GOODS_NM = ?, GOODS_IMG = ?, GOODS_PRICE = ? where GOODS_CD = ?";

        // todo : 데이타 객체 수정해야함 
        var goodsNm = data.GOODS_NM;
        var goodsCd = data.GOODS_CD;
        var goodsImg = data.GOODS_IMG;
        var goodsPrice = data.GOODS_PRICE;

        // todo : 쿼리 매핑 수정해야함, 순서 주의.
        connection.query(query, [goodsNm,goodsImg, goodsPrice, goodsCd], (error, rows) => {
            console.log("업데이트 성공 : " + goodsCd);
            if (error) throw error;

            if (rows.affectedRows === 0) {
                //console.log('insert start call');
                this.insert(connection, data);
            }


        });
    },
    insert(connection, data) {
        console.log("insert function ");
        // todo : 쿼리 수정해야 함
        var query = "  insert md_goods_bas (GOODS_CD, GOODS_NM, GOODS_IMG, GOODS_PRICE) values (?, ?, ?, ?); ";
        // todo : 객체 수정해야 함
        var goodsNm = data.GOODS_NM;
        var goodsCd = data.GOODS_CD;
        var goodsImg = data.GOODS_IMG;
        var goodsPrice = data.GOODS_PRICE;

        // todo : 쿼리 매핑 수정해야함, 순서 주의.
        connection.query(query, [goodsCd, goodsNm, goodsImg, goodsPrice], (error, rows) => {
            console.log("인서트 성공 : " + goodsCd);
            if (error) throw error;
            console.log('result count is: ', rows.affectedRows);

        });
    },

}
module.exports.main = main;