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