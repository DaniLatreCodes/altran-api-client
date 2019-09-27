require('dotenv').config()

const  fetchAPI  = require('./fetchAPI')
const  { LogicError }  = require('../../common/errors')
const { expect } = require('chai')
const logic = require('.')

describe('logic', ()=> {

  describe('Authenticate client', () =>  {
    let randomClient

    beforeEach( async ()=>{
      clientsAPI = await fetchAPI('clients')
      randomClient  = clientsAPI[Math.floor( Math.random() * ( 0 + (clientsAPI.length - 1)) - 0)]
    })

    it('should succeed on correct data', async () => {
      const { id, name , email, role } = randomClient
      const clientAPITest = await logic.authenticateUser( name, email)
      
      expect(clientAPITest.sub).to.equal(id)
      expect(clientAPITest.role).to.equal(role)

    })

    it('should fail on worn name', async () => {
      const wornName = 'eeeeeeee'
      const email = randomClient.email
      try {
      await logic.authenticateUser( wornName, email)
      throw Error("should not reach this point")
      } catch ( error ) {
        expect(error).to.be.instanceOf(LogicError)
        expect(error.name).to.equal('LogicError')
        expect(error.message).to.equal('Wrong user credentials')
      }
    })


  })

  describe('Retrieve user data by ID', ()=> {
    let randomClient

    beforeEach( async ()=>{
      clientsAPI = await fetchAPI('clients')
      randomClient  = clientsAPI[Math.floor( Math.random() * ( 0 + (clientsAPI.length - 1)) - 0)]
    })

    it('should succeed on correct data', async () => {
      const clientAPIFiltered = clientsAPI.filter( client => client.id === randomClient.id)[0]
      const clientLogicTest = await logic.retrieveClientById(randomClient.id)

      expect(clientLogicTest).to.exist
      expect(clientLogicTest.id).to.equal(clientAPIFiltered.id)
      expect(clientLogicTest.name).to.equal(clientAPIFiltered.name)
      expect(clientLogicTest.email).to.equal(clientAPIFiltered.email)
      
    })

    it('should fail on worn data', async () => {
      const wornClientId = 000000000000000
      try{
        await logic.retrieveClientById(wornClientId)
        throw Error("should not reach this point")
      } catch( error ){
        expect(error).not.to.be.undefined
        expect(error).to.instanceOf(LogicError)
        expect(error.name).to.equal(LogicError.name)
        expect(error.message).to.equal(`Client with ID ${wornClientId} doesn't exist`)
      }
    })
  })

  describe('Retrieve client by name', () => {
    let randomClient

    beforeEach( async ()=>{
      clientsAPI = await fetchAPI('clients')
      randomClient  = clientsAPI[Math.floor( Math.random() * ( 0 + (clientsAPI.length - 1)) - 0)]
    })

    it('should succeed on correct data', async () => {
      const clientAPIFiltered = clientsAPI.filter( client => client.name === randomClient.name)[0]
      const clientLogicTest = await logic.retrieveClientByName(randomClient.name)

      expect(clientLogicTest).to.exist
      expect(clientLogicTest[0].id).to.equal(clientAPIFiltered.id)
      expect(clientLogicTest[0].name).to.equal(clientAPIFiltered.name)
      expect(clientLogicTest[0].email).to.equal(clientAPIFiltered.email)
    })

    it('should fail on worn data', async () => {
      const wornClientName = 'aaaaaaaaaaaaa'
      try{
        await logic.retrieveClientByName(wornClientName)
        throw Error("should not reach this point")
      } catch( error ){
        expect(error).not.to.be.undefined
        expect(error).to.instanceOf(LogicError)
        expect(error.name).to.equal(LogicError.name)
        expect(error.message).to.equal(`Client with name ${wornClientName} doesn't exist`)
      }
    })

  })

  describe('Retrieve client policies by client name', ()=>{

    let randomClient, policies

    beforeEach( async ()=>{
      clientsAPI = await fetchAPI('clients')
      policiesAPI = await fetchAPI('policies')
      randomClient  = clientsAPI[Math.floor( Math.random() * ( 0 + (clientsAPI.length - 1)) - 0)]
    })

    it('should succeed on correct data', async ()=>{
      const clientLogicTest = await logic.retrieveClientPoliciesByName(randomClient.name)

        expect(clientLogicTest[0].id).to.equal(randomClient.id)
        expect(clientLogicTest[0].name).to.equal(randomClient.name)
        expect(clientLogicTest[0].email).to.equal(randomClient.email)
        expect(clientLogicTest[0].policies).to.be.an('array')
      
        if(clientLogicTest[0].policies.length > 0){
          clientLogicTest[0].policies.forEach( policyClient => {
            let policyAPI = policiesAPI.find( policy => policy.id === policyClient.id )
            expect(policyClient.id).to.equal(policyAPI.id)
            expect(policyClient.clientId).to.equal(policyAPI.clientId)
            expect(policyClient.amountInsured).to.equal(policyAPI.amountInsured)
            expect(policyClient.inceptionDate).to.equal(policyAPI.inceptionDate)
            expect(policyClient.installmentPayment).to.equal(policyAPI.installmentPayment)
          })
        }

    })

    it('should fail on wrong data', async () =>{
      const wornClientName = 'aaaaaaa'
      try {
        await logic.retrieveClientPoliciesByName(wornClientName)
        throw Error("should not reach this point")
      } catch (error) {
        expect(error).not.to.be.undefined
        expect(error).to.instanceOf(LogicError)
        expect(error.name).to.equal(LogicError.name)
        expect(error.message).to.equal(`Client with name ${wornClientName} doesn't exist`)
      }
    })

  })

  describe('Retrieve user by policy ID', ()=>{
    let randomPolicy, clientAPI

    beforeEach( async ()=>{
      clientsAPI = await fetchAPI('clients')
      policiesAPI = await fetchAPI('policies')
      randomPolicy  = policiesAPI[Math.floor( Math.random() * ( 0 + (policiesAPI.length - 1)) - 0)]
      clientAPI = clientsAPI.find( client => client.id === randomPolicy.clientId)
    })

    it('should succeed on correct data', async ()=>{
      const clientAPITest = await logic.retrieveUserByPolicyId(randomPolicy.id)

      expect(clientAPITest.id).to.equal(clientAPI.id)
      expect(clientAPITest.name).equal(clientAPI.name)
      expect(clientAPITest.email).equal(clientAPI.email)
    })

    it('should fail in worn data', async ()=>{
      const wrongPolicyID = 22222222222

      try {
        await logic.retrieveUserByPolicyId(wrongPolicyID)
        throw Error('Should not reach this point')
      } catch (error) {
        expect(error).not.to.be.undefined
        expect(error).to.instanceOf(LogicError)
        expect(error.name).to.equal('LogicError')
        expect(error.message).to.equal(`Policy with id ${wrongPolicyID} does not exist`)
      }


    })

  })


})