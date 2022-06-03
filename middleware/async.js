// a more elegant approch to catch errors in routes
module.exports = function(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            return res.status(400).send(ex.message);
        }
    };
}