const handleErrors = require('../../helpers/handle-errors')
const { UnauthorizedError } = require('../../../api-commons/errors')
const jwt = require('jsonwebtoken')

const { env: { JWT_SECRET } } = process

module.exports = (req, res, next) => {
  handleErrors( async () => {
                const { headers: { authorization } } = req
    
                if (!authorization) throw new UnauthorizedError()
                const token = authorization.slice(7)
                const { sub, role } = jwt.verify(token, JWT_SECRET)

                req.userId = sub
                req.role = role

                next()
        }, res)
}