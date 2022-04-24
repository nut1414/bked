import APIError from "./APIError.js"

const errorHandler = (err, req, res, next) => {
    let error = err
    if (!(error instanceof APIError)){
        console.log(error)
        error = new APIError()
        if (process.env.NODE_ENV === 'development'){
            console.log(err)
        }
    }
    res.status(error.statuscode).json({error: error.message})
}

export default errorHandler