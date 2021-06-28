const express = require('express');

const ID_PROPERTY = 'id';
const PROPERTY = null;

class CRUDController {
    constructor(collection, object) {
        if (!Object.values(object).includes('id')) {
            throw "Object has to have a id property"
        }
        this.object = object;
        this.collection = collection;
    }

    query(object) {
        const result = {};
        Object.keys(this.object)
              .filter(k => this.object[k] == 'id' && k in object)
              .map(id => result[id] = object[id])
        return result;
    }

    sameKeys(object1, object2) {
        const object1Keys = Object.keys(object1).sort();
        const object2Keys = Object.keys(object2).sort();
        
        if (object1Keys === object2Keys) return true;
        if (object1Keys == null || object2Keys == null) return false;
        if (object1Keys.length !== object2Keys.length) return false;

        for (var i = 0; i < object1Keys.length; ++i) {
            if (object1Keys[i] !== object2Keys[i]) return false;
        }
        return true;
    }

    async get(req, res) {
        const query = this.query(req.params);
        const elem = await this.collection.findOne(query);
        delete elem["_id"];
        const code = null !== elem ? 200 : 404;
        return res.status(code).send(elem);
    }

    async post(req, res) {
        let elem = null
        if (this.sameKeys(req.body, this.object)) {
            const query = this.query(req.body);
            if (null === await this.collection.findOne(query)) {
                const result = await this.collection.insertOne(req.body);
                elem = result.ops;
                delete elem["_id"];
            }
        }

        const code = null !== elem ? 200 : 404;
        return res.status(code).send(elem);
    }

    async put(req, res) {
        let elem = null;
        if (this.sameKeys(req.body, this.object)) {
            const query = this.query(req.params);
            const options = { upsert: true };
            const result = await this.collection.replaceOne(query, req.body, options);

            if (result.matchedCount > 0) {
                elem = result.ops;
                delete elem["_id"];
            }
        }

        const code = null !== elem ? 200 : 404;
        return res.status(code).send(elem);
    }

    async delete(req, res) {
        const query = this.query(req.params);
        const result = await this.collection.deleteOne(query);
        const code = result.deletedCount > 0 ? 200 : 404;
        return res.status(code).send();
    }
}

const CRUDRouterBuilder = {
    build(path, collection, object) {
        const controller = new CRUDController(collection, object);
        const ids = Object.keys(object).filter(k => object[k] == 'id');
        const mainUri = path.concat(ids.map(id => `/:${id}`).join(''));
        const getUris = ids.map(id => `${path}/:${id}`).concat(path);

        const router = express.Router();

        for (const uri of getUris) {
            router.get(uri, (req, res, next) => controller.get(req, res));
        }
        router.post(path, (req, res, next) => controller.post(req, res));
        router.put(mainUri, (req, res, next) => controller.put(req, res));
        router.delete(mainUri, (req, res, next) => controller.delete(req, res));

        return router;
    }
}

const CRUDAPIBuilder = {
    build(database, model) {
        return Object.keys(model).map(c => {
            const collection = database.collection(c);
            const path = '/'.concat(c);
            const object = model[c];
            return CRUDRouterBuilder.build(path, collection, object);
        });
    }
}

module.exports.ID_PROPERTY = ID_PROPERTY;
module.exports.PROPERTY = PROPERTY;
module.exports.CRUDController = CRUDController;
module.exports.CRUDRouterBuilder = CRUDRouterBuilder;
module.exports.CRUDAPIBuilder = CRUDAPIBuilder;
