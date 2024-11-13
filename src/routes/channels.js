// routes/channels.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // DB 연결 모듈을 따로 분리한 경우

// 모든 채널 조회
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM channels';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 조회 오류' });
        res.json({ success: true, data: results });
    });
});

// 특정 채널 조회
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM channels WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 조회 오류' });
        res.json({ success: true, data: results[0] });
    });
});

// 새로운 채널 추가
router.post('/', (req, res) => {
    const { id, name, open } = req.body;
    const last_update_dt = new Date().toISOString().slice(0, 19).replace('T', ' '); // 현재 시각으로 설정
    const query = 'INSERT INTO channels (id, name, last_update_dt, open) VALUES (?, ?, ?, ?)';
    db.query(query, [id, name, last_update_dt, open], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 삽입 오류' });
        res.status(201).json({ success: true, message: '채널이 추가되었습니다.' });
    });
});


// 채널 정보 업데이트
router.put('/:id', (req, res) => {
    const { name, open, last_update_dt } = req.body;
    const query = 'UPDATE channels SET name = ?, last_update_dt = ?, open = ? WHERE id = ?';
    db.query(query, [name, last_update_dt, open, req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 업데이트 오류' });
        res.json({ success: true, message: '채널이 업데이트되었습니다.' });
    });
});


// 채널 삭제
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM channels WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'DB 삭제 오류' });
        res.json({ success: true, message: '채널이 삭제되었습니다.' });
    });
});

module.exports = router;
