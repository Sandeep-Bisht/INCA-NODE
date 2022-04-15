

exports.uploadUserFiles = async(req, res) => {
    console.log(req.file, 'hello')
    try {
        res.send({message:"file uploaded", data:req.file})
    }
    catch(err){
        res.send(err)
    }
}