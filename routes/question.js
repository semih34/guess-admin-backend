const express = require('express');
const router = express.Router();

//Mongo
const QuestionSchema = require('../models/Question');

//elastic
const ElasticSearch = require('../services/elasticsearch');


router.post('/create', (req, res, next) => {
    const { text, answer, language } = req.body;
    const question = {};
    question[language] = text;

    const q = new QuestionSchema({
        question,
        answer
    });
    q.save((err, data) => {
        if (err) {
            return res.status(400).json({ 'info': 'Benzer kayıt mevcut', 'error': err });
        }
        ElasticSearch.insert(text);
        return res.status(200).json(data);
    });

});

router.get('/search', (req, res, next) => {
    ElasticSearch.search(req.query.text, (err, data) => {
        if (err) {
            return res.status(400).json({ 'message': 'Sistem hatası' });
        }
        const result = [];
        data.forEach(element => {
            result.push(element._source.text);
        });
        return res.status(200).json(result);
    });
});

module.exports = router;