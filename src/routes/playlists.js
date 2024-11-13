// routes/playlists.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 모든 플레이리스트 조회
router.get('/', (req, res) => {
    const query = 'SELECT * FROM playlists';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 조회 오류' });
        res.json({ success: true, data: results });
    });
});

// 특정 플레이리스트 조회
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM playlists WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 조회 오류' });
        res.json({ success: true, data: results[0] });
    });
});

// 새 플레이리스트 추가
router.post('/', (req, res) => {
    const {
        id,
        channel_id,
        channel_title,
        playlist_title,
        item_count,
        etag,
        kind,
        open,
        privacy_status,
    } = req.body;

    const query = `
        INSERT INTO playlists (id, channel_id, channel_title, playlist_title, item_count, etag, kind, open, privacy_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        channel_id = VALUES(channel_id),
        channel_title = VALUES(channel_title),
        playlist_title = VALUES(playlist_title),
        item_count = VALUES(item_count),
        etag = VALUES(etag),
        kind = VALUES(kind),
        open = VALUES(open),
        privacy_status = VALUES(privacy_status)
    `;

    db.query(query, [
        id,
        channel_id,
        channel_title,
        playlist_title,
        parseInt(item_count, 10),
        etag,
        kind,
        open ? 1 : 0,
        privacy_status
    ], (err) => {
        if (err) {
            console.error('playlists 테이블에 데이터 추가 또는 업데이트 오류:', err);
            return res.status(500).json({ success: false, error: 'playlists 테이블에 데이터 추가 또는 업데이트 오류' });
        }
        res.status(201).json({ success: true, message: '플레이리스트가 추가되었거나 업데이트되었습니다.' });
    });
});

// 플레이리스트 업데이트
router.put('/:id', (req, res) => {
    const { 
        channel_id, 
        channel_title, 
        playlist_title, 
        item_count, 
        etag, 
        kind, 
        open, 
        privacy_status 
    } = req.body;

    const query = `
        UPDATE playlists 
        SET channel_id = ?, channel_title = ?, playlist_title = ?, item_count = ?, etag = ?, kind = ?, open = ?, privacy_status = ? 
        WHERE id = ?
    `;

    db.query(query, [
        channel_id, 
        channel_title, 
        playlist_title, 
        parseInt(item_count, 10), 
        etag, 
        kind, 
        open ? 1 : 0, 
        privacy_status, 
        req.params.id
    ], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 업데이트 오류' });
        res.json({ success: true, message: '플레이리스트가 업데이트되었습니다.' });
    });
});

// 플레이리스트 삭제
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM playlists WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 삭제 오류' });
        res.json({ success: true, message: '플레이리스트가 삭제되었습니다.' });
    });
});

module.exports = router;
