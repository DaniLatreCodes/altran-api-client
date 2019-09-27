const { LogicError, UnknownError} = require('../../../api-commons/errors')

const handleErrors = (callback, res) => {
return( async () =>{
    try{
      callback()
        .catch( error => {
          let { status = 400, name,  message } = error
          if( error instanceof LogicError) status = 409
          else if ( error instanceof UnknownError) status = 400
          res.status(status).json({ name, message: message || 'unknown error'  })
        })

    } catch ( error ) {

      let status = 400

      res.status(status).json({ error })
    }
  })()
}

module.exports = handleErrors