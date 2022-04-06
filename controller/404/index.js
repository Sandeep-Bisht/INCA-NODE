exports.handle404Route = async (req, res) => {
    res.status(404).send({code:404, message:"route not found"});
}
