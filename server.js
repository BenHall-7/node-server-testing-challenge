const express = require("express");
const status = require("http-status-codes");
const db = require("./data/dbConfig");

const server = express();
server.use(express.json());

server.get("/jokes", (req, res) => {
    db("jokes")
        .then(res2 => {
            res.status(status.OK).json(res2);
        })
        .catch(() => { res.status(status.INTERNAL_SERVER_ERROR).json({error: "Error retrieving jokes"}) })
});

server.get("/jokes/:id", (req, res) => {
    db("jokes")
        .where({id: req.params.id})
        .first()
        .then(res2 => {
            if (res2) {
                res.status(status.OK).json(res2);
            } else {
                res.status(status.BAD_REQUEST).json({error: "No joke found with that ID"})
            }
        })
        .catch(() => { res.status(status.INTERNAL_SERVER_ERROR).json({error: "Error retrieving jokes"}) })
});

server.post("/jokes", validateJokeObject, (req, res) => {
    db("jokes")
        .insert(req.joke)
        .then(([res2]) => {
            res.status(status.CREATED).json(res2);
        })
        .catch(() => { res.status(status.INTERNAL_SERVER_ERROR).json({error: "Error posting joke"}) })
});

server.put("/jokes/:id", validateJokeObject, (req, res) => {
    db("jokes")
        .where({id: req.params.id})
        .update(req.joke)
        .then(res2 => {
            if (res2) {
                res.sendStatus(status.OK); 
            } else {
                res.status(status.BAD_REQUEST).json({error: "The specified ID wasn't found"});
            }
        })
        .catch(() => { res.status(status.INTERNAL_SERVER_ERROR).json({error: "Error updating joke"}) })
});

server.delete("/jokes/:id", (req, res) => {
    db("jokes")
        .where({id: req.params.id})
        .del()
        .then(res2 => {
            if (res2) {
                res.sendStatus(status.OK);
            } else {
                res.status(status.BAD_REQUEST).json({error: "The specified ID wasn't found"});
            }
        })
        .catch(() => { res.status(status.INTERNAL_SERVER_ERROR).json({error: "Error deleting joke"}) })
});

function validateJokeObject(req, res, next) {
    if (typeof req.body === 'object') {
        if (typeof req.body.joke === "string") {
            req.joke = {joke: req.body.joke};
            next();
        } else {
            res.status(status.BAD_REQUEST).json({error: "request body must have 'joke' (string) parameter"});
        }
    } else {
        res.status(status.BAD_REQUEST).json({error: "request must have json body"});
    }
}

module.exports = server;