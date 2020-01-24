'use strict';

class IUserManagerService extends AbstractClass {
    abstractMethods = [
          "start"                 // () -> undefined
        , "stop"                  // () -> undefined
        , "login"                 // (plainUsername:str, plainPassword:str) -> Promise()
        , "logout"                // () -> undefined
        , "createUser"            // (plainUsername:str, plainPassword:str) ->
        , "deleteUserByUserHash"  // (userHash ) ->
        , "chgPassword"           // (username, old_password, new_password ) ->
        , "getUserName"           // ()->
        , 
    ];
};