const client = require('../helpers/elasticsearchClient');

class ElasticSearch {
    search(text, callback) {

        const should = [];
        text.split(' ').forEach(element => {
            should.push({
                "match": {
                    "text": {
                        "query": element,
                        "fuzziness": "AUTO"
                    }
                }
            });
        });
        const body = {
            "query": {
                "bool": {
                    should
                }
            }
        };
        client.search({
            index: 'questions',
            type: 'question',
            body: body
        }).then((result) => {
            callback(null, result.hits.hits);
        }).catch((err) => {
            callback(err, null);
        });
    }

    insert(text) {
        client.index({ index: 'questions', type: 'question', body: { text } }).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }
}

module.exports = new ElasticSearch();