// routes/videos.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// 모든 비디오 조회 (정렬 기준과 개수 제한을 조건부로 추가)
router.get('/', (req, res) => {
    const { limit, orderBy, sortBy } = req.query;
    let query = 'SELECT * FROM videos';
    
    // 정렬 기준 설정
    const validSortByFields = ['like_count', 'view_count', 'video_date', 'comment_count'];
    const sortField = validSortByFields.includes(sortBy) ? sortBy : 'video_date'; // 기본값은 video_date

    // 정렬 순서 설정
    const order = orderBy && orderBy.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'; // 기본값은 DESC
    query += ` ORDER BY ${sortField} ${order}`;

    // 개수 제한 설정
    if (limit) {
        query += ` LIMIT ${parseInt(limit, 10)}`;
    }

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 조회 오류' });
        res.json({ success: true, data: results });
    });
});

// 기타 라우트 설정
// ...
module.exports = router;


// 특정 비디오 조회
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM videos WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 조회 오류' });
        res.json({ success: true, data: results[0] });
    });
});

// 새 비디오 추가 또는 업데이트
router.post('/', (req, res) => {
    const {
        id, // videoId
        playlist_id,
        channel_id,
        title,
        video_date,
        channel_title,
        comment_count = 0,
        favorite_count = 0,
        like_count = 0,
        view_count = 0,
        thumbnail_url,
    } = req.body;

    const query = `
        INSERT INTO videos (id, playlist_id, channel_id, title, video_date, channel_title, comment_count, favorite_count, like_count, view_count, thumbnail_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        playlist_id = VALUES(playlist_id), 
        channel_id = VALUES(channel_id), 
        title = VALUES(title), 
        video_date = VALUES(video_date), 
        channel_title = VALUES(channel_title), 
        comment_count = VALUES(comment_count), 
        favorite_count = VALUES(favorite_count), 
        like_count = VALUES(like_count), 
        view_count = VALUES(view_count), 
        thumbnail_url = VALUES(thumbnail_url)
    `;

    db.query(query, [
        id,
        playlist_id,
        channel_id,
        title,
        video_date,
        channel_title,
        parseInt(comment_count, 10),
        parseInt(favorite_count, 10),
        parseInt(like_count, 10),
        parseInt(view_count, 10),
        thumbnail_url
    ], (err) => {
        if (err) {
            console.error('videos 테이블에 데이터 추가 또는 업데이트 오류:', err);
            return res.status(500).json({ success: false, error: 'videos 테이블에 데이터 추가 또는 업데이트 오류' });
        }
        res.status(201).json({ success: true, message: '비디오가 추가되었거나 업데이트되었습니다.' });
    });
});

// 비디오 업데이트
router.put('/:id', (req, res) => {
    const { 
        playlist_id, 
        channel_id, 
        title, 
        video_date, 
        channel_title, 
        comment_count = 0, 
        favorite_count = 0, 
        like_count = 0, 
        view_count = 0, 
        thumbnail_url 
    } = req.body;

    const query = `
        UPDATE videos 
        SET playlist_id = ?, channel_id = ?, title = ?, video_date = ?, channel_title = ?, comment_count = ?, favorite_count = ?, like_count = ?, view_count = ?, thumbnail_url = ? 
        WHERE id = ?
    `;
    db.query(query, [
        playlist_id, 
        channel_id, 
        title, 
        video_date, 
        channel_title, 
        parseInt(comment_count, 10), 
        parseInt(favorite_count, 10), 
        parseInt(like_count, 10), 
        parseInt(view_count, 10), 
        thumbnail_url, 
        req.params.id
    ], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 업데이트 오류' });
        res.json({ success: true, message: '비디오가 업데이트되었습니다.' });
    });
});

// 비디오 삭제
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM videos WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 삭제 오류' });
        res.json({ success: true, message: '비디오가 삭제되었습니다.' });
    });
});

module.exports = router;
