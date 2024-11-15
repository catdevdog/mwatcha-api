// app.js
const express = require('express');
const cors = require('cors');
const channelsRouter = require('./routes/mwatcha/channels');
const playlistsRouter = require('./routes/mwatcha/playlists');
const videosRouter = require('./routes/mwatcha/videos');

const app = express();
const port = 5678;

app.use(cors());
 // 특정 도메인만 app.us(cord({ origin: 'https://mwatcha.xyz' }));
 
app.use(express.json());

// 라우트 설정
app.use('/mwatcha/v1/channels', channelsRouter);
app.use('/mwatcha/v1/playlists', playlistsRouter);
app.use('/mwatcha/v1/videos', videosRouter);

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});

