# comproDLS SDK for Javascript
The official comproDLS SDK for JavaScript, available for browsers and Node.js backends. It provides JavaScript objects and functions to access comproDLS APIs in your application. 

## Key Concepts

### Javascript Promises
Most of the functions in comproDLS SDK are asynchronous and returns a Javascript promise. We use [Q library] (https://github.com/kriskowal/q) for promises. If you are not familiar with promises, please go through [Q library documentation] (http://documentup.com/kriskowal/q/).

### What is a token?
comproDLS uses a token based authentication mechanism i.e. it allows users to enter user credentials (organisationid, username and password) to obtain a security token. Once the token is obtained, this can be used to access protected resources/APIs instead of entering user credentials again. The method to obtain token is explained in [Usage](https://github.com/comprodls/comprodls-sdk-js#authwithcredentials) section. 

Please note, this token is valid for a limited time and needs to be refreshed after that time. However, you don't need to worry about refreshing token as SDK handles it automatically.

### Errors
A standard error object is returned for all SDK functions:
```
{
  "type": ... //API_ERROR or SDK_ERROR
  "message": ..
  ..
  ..
}
```
Possible error types are: 
- API_ERROR: In case there is some problem in the upstream comproDLS APIs themselves. 
- SDK_ERROR: In case of validation failure, invalid token or other problems within the SDK client. 

Please refer [Error Documentation](https://github.com/comprodls/comprodls-sdk-js/wiki/01_Getting-Started#errors) for detailed information. 

## Supported APIs
The SDK supports following APIs:
<table>
  <thead>
    <th>API Name</th>
    <th>API Documentation</th>
    <th>API Version</th>
  </thead>
  <tbody>
    <tr><td>Auth API</td><td>http://auth.comprodls.com</td><td>1.0.0</td></tr>
    <tr><td>Product API</td><td>http://product.comprodls.com</td><td>1.0.0</td></tr>
    <tr><td>Collab API</td><td>http://collab.comprodls.com</td><td>1.0.0</td></tr>
    <tr><td>Analytics API</td><td>http://analytics.comprodls.com</td><td>1.0.0</td></tr>
    <tr><td>Activity / Test API</td><td>http://activity.comprodls.com</td><td>1.0.0</td></tr>
    <tr><td>xAPI</td><td>http://xapi.comprodls.com</td><td>1.0.0</td></tr>      
    <tr><td>Push Notifications</td><td>---</td><td>1.0.0</td></tr>
  </tbody>
</table>

## Installation
### In Browser
To use the SDK in browser, download latest [comprodls-sdk.min.js](https://raw.githubusercontent.com/comprodls/comprodls-sdk-js/master/dist/comprodls-sdk.min.js) and add the following script tag in your HTML page:
```
<script src="{SDK Folder location}/comprodls-sdk.min.js"></script>
```
### Using Bower
You can also use [Bower](http://bower.io/) to install the SDK by typing the following into a terminal window:
```
bower install comprodls-sdk
```
### In Node.js
The preferred way to install the SDK for Node.js is to use the [npm](https://www.npmjs.com/) package manager for Node.js. Simply type the following into a terminal window:
```
npm install comprodls-sdk
```

## Usage
### Loading the SDK
#### In Browser
Once comprodls-sdk.js is loaded, "comproDLS" package is available in window object itself.
```
var comproDLS = ComproDLS.create();
```

However, if you are using AMD modules in your application, following is preferred way to get comproDLS package:
```
define(["comprodls-sdk"], function(ComproDLS) {
    var comproDLS = ComproDLS.create();
});
```

#### In Node.js
After you've installed the SDK, you can require the comproDLS package in your application using require():
```
var comproDLS = require('comprodls-sdk').create();
```
### Authentication & Tokens
Authentication (acquiring a valid token) is the first thing you need to do before using any function of comproDLS SDK. Following are the ways to authenticate:

#### authWithCredentials
You need valid comproDLS user credentials (organisationid, username and password) to use this method. Following is sample code to authenticate using credentials:
```
comproDLS.authWithCredentials("myorg", {username:"myusername", password:"mypassword"}, {}).then(
  function success(response) {
    //You may persist token object in session/localstorage etc. for later usage.    	 
    var token = response["token"];
    console.log(token.expires_in);
     
    //user object contains user information
    var user = response["user"];
    console.log(user.name);
    console.log(user.roles);
	  
    //org object contains organisation information
    var org = response["user"]["org"];
    console.log(org["type"]);
  },
  function error(err) {
    var type = err["type"];
    if (type == "API_ERROR") {
    	if (err["httpcode"] == 401) {
    		//Invalid Credentials
    		console.log(err.message);
    	}
    } else  if (type == "SDK_ERROR") {
    	console.log(err.message);
    }
  }
);
```
After successfully calling this function, the comproDLS SDK object will have a valid authentication token which will be used across all subsequent calls. All other SDK functions do not require the token or credentials (to be supplied as parameters). Furthermore, in case the token expires, SDK will automatically refresh it using the original credentials. 

See [authWithCredentials Documentation](https://github.com/comprodls/comprodls-sdk-js/wiki/02_Authentication-and-Tokens#authwithcredentials) for detailed information on method parameters, success and error response JSONs.

#### authWithToken

If you already have a persisted / saved comproDLS token (obtained via authWithCredentials method), you can use this method for a simple pass-through authentication (avoid generating a fresh token). Following is sample code:
```
/*
 * saved_token is token object obtained previously via authWithCredentials method
 */
comproDLS.authWithToken('myorg', saved_token , {}).then(
  function success(response) {
    var token = response["token"];
  }, 
  function error(errorObject) {
    //Do error handling here
  }
);
```
After successfully calling this function, the comproDLS SDK object will have a valid authentication token which will be used across all subsequent calls. All other SDK functions do not require the token or credentials (to be supplied as parameters). 

This function returns token object in success response as shown above. However, if you need user and organisation information, please also pass ```getuserdetails:true``` option as shown below:
```
comproDLS.authWithToken('myorg', saved_token , {getuserdetails:true}).then(
   function success(response) {
    //You may persist token object in session/localstorage etc. for later usage.    	 
    var token = response["token"];
    console.log(token.expires_in);
     
    //user object contains user information
    var user = response["user"];
    console.log(user.name);
    console.log(user.roles);
	  
    //org object contains organisation information
    var org = response["user"]["org"];
    console.log(org["type"]);
  },
  function error(err) {
    var type = err["type"];
    if (type == "API_ERROR") {
    	if (err["httpcode"] == 401) {
    		//Invalid Credentials
    		console.log(err.message);
    	}
    } else  if (type == "SDK_ERROR") {
    	console.log(err.message);
    }
  }
);
```
See [authWithToken Documentation](https://github.com/comprodls/comprodls-sdk-js/wiki/02_Authentication-and-Tokens#authwithtoken) for detailed information on method parameters, success and error response JSONs.


### refreshToken
The comproDLS token gets expired after a certain time. Normally SDK will take care of automatically refreshing the token for you. Alternately (rare cases), if you want to manage token renewal yourself, you will need to handle the appropriate EXPIRY events and call the **refreshToken** SDK function on your own. See [refreshToken Documentation](https://github.com/comprodls/comprodls-sdk-js/wiki/02_Authentication-and-Tokens#refreshtoken) for detailed information on method parameters, success and error response JSONs.  

### Calling APIs using SDK Adaptors

#### AUTH
comproDLS AUTH API provides functions to deal with users, roles, permissions, groups, enrollments and classrooms.
**Note** You should have authenticated with comproDLS (authWithToken or authWithCredentials) before using these functions.  

Following is an example of using AUTH API SDK adaptor to get profile information for the user. In this function, the SDK adaptor abstracts the knowledge of underlying REST URLs & Parameters, and offers a simpler interface. For a list of all SDK AUTH functions, see [AUTH Adaptor Documentation](https://github.com/comprodls/comprodls-sdk-js/wiki/04_AUTH-Adaptor).
```
var auth = comproDLS.Auth();
auth.getUserProfile().then(
  function success(response) {    	 	 
    //You may persist token object in session/localstorage etc. for later usage.    	 
    var token = response["token"];
    console.log(token.expires_in);
     
    //user object contains user information
    var user = response["user"];
    console.log(user.name);
    console.log(user.roles);
	  
    //org object contains organisation information
    var org = response["user"]["org"];
    console.log(org["type"]);
  }, 
  function error(err) {
    var type = err["type"];
    if (type == "API_ERROR") {
    	if (err["httpcode"] == 401) {
    		//Invalid Credentials
    		console.log(err.message);
    	}
    } else  if (type == "SDK_ERROR") {
    	console.log(err.message);
    }
  }
);
```

#### PUSH
comproDLS PUSH API provides functions to manage user presence (online status) and various notification events, such as collaboration, activity timeouts etc.
**Note** PUSH API is designed to be used directly in the browser (websockets). Therefore, if you have already authenticated (server-side) you do not need to re-authenticate, and can simply provide *orgid* and *userid* (optional paramters) to the *connect* function as shown in the example below. 

Following is an example of using PUSH API SDK adaptor to get notifications on status of online users. For a list of all PUSH functions & notification events, see [PUSH Adaptor Documentation](https://github.com/comprodls/comprodls-sdk-js/wiki/10_PUSH-Adaptor).

```
var push = comproDLS.Push();

push.connect(orgid, userid).then(
  function callback(notifications) {
      
        notifications.on("push_connect", function (eventContext) {
            console.log("Successfully established a connection with the PUSH services");

            /* This automatically makes the current authenticated user online, 
            * sending appropriate events (within the organization).
            */ 
        });
        
        notifications.on("push_error", function (eventContext) {
            if(eventContext.error.message == "connect_error") {
                console.log("Connect error, " + eventContext.error.description);
            } else (eventContext.error.message == "connect_timeout") {
                console.log("Timeout, " + eventContext.error.description);
            } else {
                console.log("Unknown error, " + eventContext.error.description);
            }
            
            /*
             * If Timeout, try connecting again.. 
             */
        });

        notifications.on("presence", function (eventContext) {
            console.log("List of all online users=" + eventContext.result);
        });

        notifications.on("presenceupdate", function (eventContext) {
            console.log("An online user may have gone offline, or changed his/her status");
        });

  }, 
  function error(err) {
    /*
     * An error occurred while establishing a connection with the PUSH services
     */  
    var type = err["type"];
    if (type == "API_ERROR") {
  	    console.log(err.message);
    } else  if (type == "SDK_ERROR") {
    	console.log(err.message);
    }
  }
);
