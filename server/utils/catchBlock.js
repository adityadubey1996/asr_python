const catchError = (res,error)=>{
    return res.status(500).json({message: ` Internal server error ${error.message}`})
}

module.exports = {
    catchError
}