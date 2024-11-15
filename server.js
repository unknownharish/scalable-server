const cluster = require('cluster');
const os = require("os");

const express = require("express");
const compression = require("compression");
const expressValidator = require('express-validator');
var createError = require('http-errors');
const app = express();


app.use(express.json());


// compression
app.use(compression({
    level: 6,
    // threshold: 10 * 100 // Uncomment and set threshold if desired
}));


// validator

function myValidator(req, res, next) {
    expressValidator.body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long")
        .run(req);

        expressValidator.body("email")
        .isEmail()
        .withMessage("Must be a valid email address")
        .run(req);

        expressValidator.body("age")
        .isInt({ min: 18 })
        .withMessage("Age must be a number and at least 18")
        .run(req);

    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(400,errors.array()))
    }
    next();
}


app.get("/", myValidator, (req, res, next) => {
    if (!req?.user) {
        return next(createError(400, "bad request"));
    }
    res.json({ message: "get route" });
});



// not found

app.use(function (req, res, next) {
    return next(createError(404, 'Not Found'));
});

// error handler

app.use(function (error, req, res, next) {
    error.status = error.status || 500;
    console.log("error is", error.status);
    console.log("error is", error.message);
    console.log("error is", Object.keys(error));
    res.status(error.status).send(error);
});


// set up for miltiple cluster

const cpus  = os.cpus().length


app.listen(4000, (e) => {
    !e && console.log(`server started at port ${4000} and process id ${process.pid}`);
});
