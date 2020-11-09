const Elasticsearch = require('elasticsearch');
const client = new Elasticsearch.Client({
    host: process.env.ELASTIC_HOST
});
module.exports = client;