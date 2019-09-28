const logic = require('../logic')
const express = require('express')
const handleErrors = require('../helpers/handle-errors')
const { UnauthorizedError, HttpError } = require('api-commons')
const auth = require('../helpers/auth')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const router = express.Router()
const  bodyParser  = require('body-parser')
const jsonParser = bodyParser.json()

const { env: { JWT_SECRET } } = process


router.post('/auth', jsonParser,[
  check('name', 'Name required').not().isEmpty().trim(),
  check('email', 'Incorrect mail format').trim().isEmail()
  ], (req, res) =>{

  const errors = validationResult(req)
  if(!errors.isEmpty()) return res.status(422).json({ error: errors.array() })
  
  const { body: { name, email } } = req
    
  handleErrors ( async ()=> {

    const { sub, role } = await logic.authenticateUser( name, email)
    const token = jwt.sign({ sub, role }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({token})
  }, res)

})

router.post('/client', jsonParser,
[
check('name').trim().optional(),
check('idClient').trim().optional()
],
auth, (req, res) => {

  const errors = validationResult(req)
  if(!errors.isEmpty()) return res.status(422).json({ error: errors.array() })

    const { body:{ name,  id } , role } = req
    console.log(role)

    handleErrors( async ()=> {
      if( (role !== 'admin') &&  (role !== 'user') ) throw new UnauthorizedError('The role credentials are not allowed to access to this data')
      if(!name && !id) throw new HttpError('Bad request params')

      let client
      if(name)
          client = await logic.retrieveClientByName( name )
      else
          client = await logic.retrieveClientById( id )

      return res.json(client)
      }, res)
})

router.get('/userPolicies', jsonParser,
[
  check('name').not().optional(),
], auth, (req, res) => {

  const errors = validationResult(req)
  if(!errors.isEmpty()) return res.status(422).json({ error: errors.array() })
    
    const { query: { name }, role } = req

    handleErrors( async () => {
      if( role === 'admin' ) throw new UnauthorizedError('The role credentials are not allowed to access to this data')

      const clientsPolicies = await logic.retrieveClientPoliciesByName( name )
      return res.json(clientsPolicies)
    }, res)
})

router.get('/policy', jsonParser, [
  check('policy').not().optional(),
], auth, (req, res) => {

  const errors = validationResult(req)
  if(!errors.isEmpty()) return res.status(422).json({ error: errors.array() })
    
    const { query: { id }, role } = req
    handleErrors( async () => {
      if( role === 'admin' ) throw new UnauthorizedError('The role credentials are not allowed to access to this data')
      const policyClient = await logic.retrieveUserByPolicyId( id )
      return res.json(policyClient)
    }, res)
})



module.exports = router