# SessionManager

## Dependencies

MongoDB Persistor ([io.vertx~mod-mongo-persistor~2.1.0](https://github.com/vert-x/mod-mongo-persistor))
(and it's dependency: a running MongoDB instance)

---

## Name

ch.rgw.vertx.SessionManager

---

## Configuration

    {
        "address": <string>,
        "persistor_address": <String>,
        "users_colection": <string>
    }
    
* `address`: The main address for this module.
* `persistor_address`: The address of the MongoDB-persistor module
* `users_collection`: Collection in the MongoDB database, where users info should be stored

---

## Operations

### (address).create

Create a new sessionID, which is needed for all subsequent operations.

Parameters: none

Returns:

      {
        "status": "ok",
        "sessionID": <String: sessionID>
      }
    
### (address).destroy

Invalidate the sessionID. Subsequent attempts for operations using this sessionID will fail.

Parameters:

    {
        "sessionID": <sessionID>
    }
    
Returns: nothing

### (address).login

Attempts to connect a user with a sessionID

Parameters:

    {
        "sessionID": <sessionID>,
        "username": <String>,
        "password": <String>
    }
    
Returns:

    {
        "status": "ok"
    }

or

    {
        "status": "fail"
    }

### (address).logout

Removes the link between a user and a session.

Parameters:

    {
        "sessionID": <sessionID>
    }
    
Returns:

    {
        "status": "ok"
    }
    
    
### (address).authorize

Asks if the current session can act as a specified role

Parameters:

    {
        "sessionID": <sessionID>,
        "role": <String>
    }
    
Returns:

    {
        "status": "ok" or "denied"
    }
    
### (address).admin

Administrative tasks

Parameters:
    
    {
        "sessionID": <sessionID>,
        "command":  <String>,
        further parameters depending on command
    }
    
#### subcommand: "adduser"

Additional parameters:

    "user":  {
                "username": <String>,
                "password": <String>,
                "roles":    <Array of Strings>
                any additional attributes will be stored unmodified with the user object
             }

#### subcommand: "removeuser"

Additional parameters:

    "username": <String>
    