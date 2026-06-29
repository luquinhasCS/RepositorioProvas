function errorHandler(err, req, res, next) {
    console.error(err);

    const message = err.message || "Erro interno.";
    const status = err.statusCode || 400;

    return res.status(status).json({
        message
    });
}

module.exports = errorHandler;