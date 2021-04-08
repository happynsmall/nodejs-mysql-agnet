
/****************************************************************************
 * tb_user 사용자 테이블 동기화 job
*****************************************************************************/
const main = {
    doStart(connection, data) {
        this.update(connection, data);
    },
    update(connection, data) {
        // todo : 쿼리 수정해야 함
        var query = "update tb_user set user_nm = ? where user_id = ?";

        // todo : 데이타 객체 수정해야함 
        var userNm = data.user_nm;
        var userId = data.user_id;

        connection.query(query, [userNm, userId], (error, rows) => {
            console.log("업데이트 성공 : " + userId);
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
        var query = "  insert tb_user (user_id, user_nm) values (?, ?); ";
        // todo : 객체 수정해야 함
        var userNm = data.user_nm;
        var userId = data.user_id;

        connection.query(query, [userId, userNm], (error, rows) => {
            console.log("인서트 성공 : " + userId);
            if (error) throw error;
            console.log('result count is: ', rows.affectedRows);

        });
    },

}
module.exports.main = main;