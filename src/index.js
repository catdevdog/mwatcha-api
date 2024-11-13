// app.js
const express = require('express');
const cors = require('cors');
const channelsRouter = require('./routes/channels');
const playlistsRouter = require('./routes/playlists');
const videosRouter = require('./routes/videos');

const app = express();
const port = 5678;

app.use(cors());
 // 특정 도메인만 app.us(cord({ origin: 'https://mwatcha.xyz' }));
 
app.use(express.json());

// 라우트 설정
app.use('/api/v1/channels', channelsRouter);
app.use('/api/v1/playlists', playlistsRouter);
app.use('/api/v1/videos', videosRouter);

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
