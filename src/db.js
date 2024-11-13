// db.js
const mysql = require('mysql2');

// MariaDB 연결 풀링 설정
const dbPool = mysql.createPool({
    host: 'catdevdog.i234.me',
    user: 'root',
    password: '15951rkdalsrn_APM!',
    database: 'youtube',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // 풀링 연결 유지를 위한 설정
    keepAliveInitialDelay: 10000, // 초기 지연 시간 (ms)
    enableKeepAlive: true, // keep-alive 활성화
});

// 주기적으로 Ping 쿼리를 보내 연결을 유지
setInterval(() => {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.error('Ping 중 연결 오류 발생:', err);
            return;
        }
        connection.ping((pingErr) => {
            if (pingErr) {
                console.error('Ping 쿼리 오류:', pingErr);
            } else {
                console.log('Ping 성공');
            }
            connection.release(); // 풀로 연결 반환
        });
    });
}, 5 * 60 * 1000); // 5분마다 ping

// dbPool을 다른 파일에서 사용할 수 있게 내보내기
module.exports = dbPool;
