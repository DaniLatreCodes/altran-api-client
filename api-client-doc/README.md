# API's use

This API feeds the JSON content that serves by fechting it from tow endpoints-placeholders. Proccess and filter those JSON fetched from placeholders and send it following the requirements.

To to so, you first must to get a authoritation token, then, depending no wich role you have you will be able to perform some fetching data actions.

<span style="color:green">**The api-client is deployed in heroku server**</span>, you can test it by sending JSON data on the links I'll describe bellow

## End points

### Geting an athoritation "token"

You need to povide the api-client an exintin "name" and "email" that already exist on the placeholder that feed this API.

#### POST: https://floating-ocean-72055.herokuapp.com/api/auth

😺Getting a client that has "users" role authoritation

```
      {
         "name":"Barnett",
         "email":"barnettblankenship@quotezart.com",
      }

```

😸Getting a client that has "admins" role authoritation

```
      {  
         "name":"Britney",
         "email":"britneyblankenship@quotezart.com"
      }

```

### Retrieving user data filtered by "id"

In that case you need to send on the headers the token you got from the step above. Rest of data goes on the body. Any user role can retrieve data from this endpoint

#### POST: https://floating-ocean-72055.herokuapp.com/api/client

😺Getting a client that has "users" role authoritation

```
      {
         "id":"a3b8d425-2b60-4ad7-becc-bedf2ef860bd"
      }

```

😸Getting a client that has "admins" role authoritation

```
      {  
         "id":"a0ece5db-cd14-4f21-812f-966633e7be86"
      }

```

### Retrieving user data filtered by "name"

Same endpoint as above, just change data sent on the body. 

#### POST: https://floating-ocean-72055.herokuapp.com/api/client

😺Getting a client that has "users" role authoritation

```
      {
         "name":"Barnett"
      }

```

😸Getting a client that has "admins" role authoritation

```
      {  
         "name":"Britney"
      }

```

### Retrieving list of polices linked to a user by "name"

Only users with "admin" role can performe this action, not all users have policies linked to them

#### GET: https://floating-ocean-72055.herokuapp.com/api/userPolicies?name=Britney


😸Client with policies linked to her

```
      {  
         "name":"Britney"
      }

```
### Retrieving user linked to a "policy" number

Only users with "admin" role can performe this action, not all users have policies linked to them

#### GET: https://floating-ocean-72055.herokuapp.com/api/userPolicies?name=Britney


😸Client with policies linked to her

```
      {  
         "name":"Britney"
      }

```