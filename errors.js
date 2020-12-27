// error handling middleware functions (EHMF):

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) res.status(err.status).send({ msg: err.msg });
    else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    const psqlBadRequestCodes = ["22P02"];
    const badPostRequestCode = "23502";
    if (err.code === badPostRequestCode)
        res.status(400).send({ msg: "No Can Do Pal, Bad Request. Fix Ya Body!" });
    else if (psqlBadRequestCodes.includes(err.code))
        res.status(400).send({ msg: "No Can Do Pal, Bad Request!" });
    else next(err);
};;

// error controllers:

exports.handleInvalidPath = (req, res, next) => {
    res.status(404).send({ msg: "Oopsie, Path Not Found!" });
};

exports.handle405s = (req, res, next) => {
    res.status(405).send({ msg: "Nah Pal, Method Not Allowed!" });
};

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "UHOH Server Error!" });
};