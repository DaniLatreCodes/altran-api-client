const  fetchAPI  = require('../fetch-api')
const  { LogicError }  = require('../../api-commons/errors')


const logic = {

  authenticateUser(name, email) {
    return( async() => { 
      const clientsAPI  = await fetchAPI('clients')
      const clientAPI = clientsAPI.find(
        client => (client.name === name && client.email === email))
        
      if(!clientAPI) throw new LogicError('Wrong user credentials')
      const { id, role} = clientAPI

      return { sub: id, role }
    })()
  },

  retrieveClientById( id_ ){
    return( async () => {
      const clientsAPI = await fetchAPI('clients')

        const clientAPI = clientsAPI.find( client => client.id === id_)
        if(!clientAPI)  throw new LogicError(`Client with ID ${id_} doesn't exist`)
        const { id, name, email } = clientAPI
        return { id, name, email }
    }
    )()
  },

  retrieveClientByName( name_ ){
    return( async () => {
      const clientsAPI = await fetchAPI('clients')
        const clientAPI = clientsAPI.filter( client => client.name === name_)
                                    .map(client => { return { id: client.id, name: client.name, email: client.email } })
        if(clientAPI.length === 0) throw new LogicError(`Client with name ${ name_ } doesn't exist`)
        return clientAPI
    }
    )()
  },

  retrieveClientPoliciesByName( name_ ){
    return( async ()=> {
      const policiesAPI = await fetchAPI('policies')
      const clientsAPIByName = await this.retrieveClientByName( name_ )
      
      const clientsPolicies = clientsAPIByName.map( client => {
        let { id, name, email } = client
        let policies = policiesAPI.filter( policy => policy.clientId === client.id)
        return { id, name, email, policies}
      })

      return clientsPolicies
    })()

  },

  retrieveUserByPolicyId( idPolicy ){
    return( async()=> {
      const policiesAPI = await fetchAPI('policies')
      const clientsAPI = await fetchAPI('clients')
      
      const policy = policiesAPI.find( policy => policy.id === idPolicy)
      if( !policy ) throw new LogicError(`Policy with id ${idPolicy} does not exist`)

      const client = clientsAPI.find( client => policy.clientId === client.id)
      if( !client ) throw new LogicError(`This client doesn't have any policy`)

      return { id: client.id, name: client.name, email: client.email, policy}
    })()
  }
  
}

module.exports = logic


