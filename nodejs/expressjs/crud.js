var db = require('app-root-path').require('/bin/db.js');
var express = require('express');

function CRUDRouter(collection, ids, properties) {
    this.collection = collection;
    this.ids = ids;
    this.properties = properties;
    this.uri = ids.map(id => `/:${id}`).join();
    this.coll = db.database.collection(collection);
    this.getQuery = function (params) {
        result = {};
        this.ids.map(id => result[id] = params[id]);
        return result;
    };
    this.checkProperties = function (object, properties) {
        var objectKeys = Object.keys(object).sort();
        var properties = properties.sort();
        var checks = objectKeys.map((key, i) => { return key === properties[i];});
        return !checks.includes(false);
    };
    this.get = async function (params) {
        const query = this.getQuery(params);
        const elem = await this.coll.findOne(query);
        return elem;
    };
    this.post = async function (elem) {
        if (!this.checkProperties(elem, this.properties)) {
            return null;
        }

        const query = this.getQuery(elem);
        if (null === await this.coll.findOne(query)) {
            const result = await this.coll.insertOne(elem);
            return result.ops;
        }

        return null;
    };
    this.put = async function(params, elem) {
        if (!this.checkProperties(elem, this.properties)) {
            return null;
        }

        const query = this.getQuery(params);
        const options = { upsert: true };
        const result = await this.coll.replaceOne(query, elem, options);

        if (result.matchedCount > 0) {
            return result.ops;
        }
        return null;
    };
    this.delete = async function(params) {
        const query = this.getQuery(params);
        const result = await this.coll.deleteOne(query);

        if (result.deletedCount > 0) {
            return '';
        }
        return null;
    };
}

function buildRouter(collection, ids, properties) {
    const crudRouter = new CRUDRouter(collection, ids, properties);
    const router = express.Router();

    router.get(crudRouter.uri, async function(req, res) {
        const elem = await crudRouter.get(req.params);
        const code = null !== elem ? 200 : 404;
        return res.status(code).send(elem);
    });
      
    router.post('/', async function(req, res) {
        const elem = await crudRouter.post(req.body);
        const code = null !== elem ? 200 : 404;
        return res.status(code).send(elem);
    });
      
    router.put(crudRouter.uri, async function(req, res) {
        const elem = await crudRouter.put(req.params, req.body);
        const code = null !== elem ? 200 : 404;
        return res.status(code).send(elem);
    });
      
    router.delete(crudRouter.uri, async function(req, res) {
        const elem = await crudRouter.delete(req.params);
        const code = null !== elem ? 200 : 404;
        return res.status(code).send(elem);
    });

    return router;
}

module.exports.CRUDRouter = CRUDRouter;
module.exports.buildRouter = buildRouter;