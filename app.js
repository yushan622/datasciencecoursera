// Mock Server Required Dependencies
const express = require('express')
const http = require("http");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const fs = require('fs');

const jws = require('jws');

// Mock Server Instantiation
var app = express();
app.use(cookieParser());
var cert = fs.readFileSync('jwtRS256.key', 'utf8');

// Mock Server Config
const port = 8000

// Mocked authn API response body
const authnBody = {
  "stateToken": "007ucIX7PATyn94hsHfOLVaXAmOBkKHWnOOLG43bsb",
  "expiresAt": "2019-11-03T10:15:57.000Z",
  "status": "SUCCESS",
  "relayState": "/",
  "sessionToken": "00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "passwordChanged": "2015-09-08T20:14:45.000Z",
      "profile": {
        "login": "dade.murphy@example.com",
        "firstName": "Dade",
        "lastName": "Murphy",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
};

//const authorizeUrlParams = "&token_type=Bearer&expires_in=3600&scope=openid profile email offline_access&id_token="
const authorizeUrlParams = "&token_type=Bearer&expires_in=3600&scope=openid profile email offline_access&id_token="

const payload = {
  sub: '00ub0oNGTSWTBKOLGLNR',
  ver: 1,
  iss: 'http://localhost:8000/oauth2/default',
  aud: '{clientId}',
  iat: 1536350635,
  jti: 'ID.ql9c_IcbtDtfft1cEVrIdOiTnY8U-_zLHhip8jsfOOo',
  amr: [
    'pwd'
  ],
  nonce: 'QHz6u1AP2uZOHcbMVHjLgWCTL2vu8f1rX3u3V4ZdJzT5XN4IB14TY0By9LYcNJIh',
  auth_time: 1536350635
}

const openidConfig = {
    "stateToken": "007ucIX7PATyn94hsHfOLVaXAmOBkKHWnOOLG43bsb",
    "issuer": "http://localhost:8000/oauth2/default",
    "authorization_endpoint": "http://localhost:8000/oauth2/default/v1/authorize",
    "token_endpoint": "http://localhost:8000/oauth2/default/v1/token",
    "userinfo_endpoint": "http://localhost:8000/oauth2/default/v1/userinfo",
    "registration_endpoint": "http://localhost:8000/oauth2/default/v1/clients",
    "jwks_uri": "http://localhost:8000/oauth2/default/v1/keys",
    "response_types_supported": [
        "code",
        "code id_token",
        "code token",
        "code id_token token",
        "id_token",
        "id_token token"
    ],
    "response_modes_supported": [
        "query",
        "fragment",
        "form_post",
        "okta_post_message"
    ],
    "grant_types_supported": [
        "authorization_code",
        "implicit",
        "refresh_token",
        "password"
    ],
    "subject_types_supported": [
        "public"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "scopes_supported": [
        "openid",
        "email",
        "profile",
        "address",
        "phone",
        "offline_access",
        "groups"
    ],
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "claims_supported": [
        "iss",
        "ver",
        "sub",
        "aud",
        "iat",
        "exp",
        "jti",
        "auth_time",
        "amr",
        "idp",
        "nonce",
        "name",
        "nickname",
        "preferred_username",
        "given_name",
        "middle_name",
        "family_name",
        "email",
        "email_verified",
        "profile",
        "zoneinfo",
        "locale",
        "address",
        "phone_number",
        "picture",
        "website",
        "gender",
        "birthdate",
        "updated_at",
        "at_hash",
        "c_hash"
    ],
    "introspection_endpoint": "http://localhost:8000/oauth2/default/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "revocation_endpoint": "http://localhost:8000/oauth2/default/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "end_session_endpoint": "http://localhost:8000/oauth2/default/v1/logout",
    "request_parameter_supported": true,
    "request_object_signing_alg_values_supported": [
        "HS256",
        "HS384",
        "HS512"
    ]
};

const keysBody = {
  "stateToken": "007ucIX7PATyn94hsHfOLVaXAmOBkKHWnOOLG43bsb",
  "keys": [
    {
      'alg': 'RS256',
      'e': 'AQAB',
      'kid': 'testKey',
      'kty': 'RSA',
      'n': 'sDCn3aYGTb27rn9ekaMH1TWeDBb6uZUMxjmL_n-p-OWkeo1uCOI4C2BTHqJjII6jpCaiVgatgI7pvfnQADfl9fvEGldnyUIYoyTsNZMnRVFzaNEv1Ln1I9jgpn-mw4usYPgrGR1oiMzIyhm_Pbt-luV4lwkQuScYytwP99fLlIzsEyS1HAtTs5s08VmrhA56Kx6ZyvcqxR_thbfcdjlLj2C9ra58DRYtxkWbSBNelPM_Tzxgb8zfxHDwNL4xGZEwHYHAg3tDPEJ0Zrf115ZkyvSE-p_rypRAKXUY6RmzAlc2Nyl1iGjQJiJqkrpR6Viyvq1V-F6z3A5dOqeDosiHT8H-EN4_s9ciVDU27k8KPR2ErbiTBiCsG6_OehOAy1Ch0_BOszaiG2FOvT86uylfcrOhbMbRrG3KHpEaHnf51Gh6s6nNS4R7yBIde8o4QvlqsMTHPXVhTv99Np5zObBB5LWl8EItamb8PR_9qGCaTEs1ITpMtWr5eM3jEhrKJpJlLOhB1I-UFtgNwMkO3Xcp4PUnt8Uwp8Nv9aGHNYaOy7z4IkeD9kAWbKFXCx4qpyxkHmpDa4Y-jdQUccKQbHFkDEbon4Nh3gM9RgnCNbdgSbx8yM8ycZSpl2A50HqkaIOS_jssS6V1a5thvWgYlOMrso-1XOojSotR6o_zqYo4nRs',
      'use': 'sig'
    }
  ]
}

// Pre-flight request to authn API
app.options('/api/v1/authn', (request, response) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:4200");
  response.header("Access-Control-Allow-Credentials", true);
  response.header("Access-Control-Allow-Headers", "content-type,x-okta-user-agent-extended,x-okta-xsrftoken");
  response.send();

});

// Call authn API
app.post('/api/v1/authn', (request, response) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:4200");
  response.header("Access-Control-Allow-Credentials", true);
  response.header("Access-Control-Allow-Headers", "content-type,x-okta-user-agent-extended,x-okta-xsrftoken")
  response.json(authnBody);
  response.send();

});

// Call authorize API
app.get('/oauth2/default/v1/authorize', (request, response) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:4200");
  response.header("Access-Control-Allow-Credentials", true);
  response.header("Access-Control-Allow-Headers", "content-type,x-okta-user-agent-extended,x-okta-xsrftoken")
  payload.nonce = request.cookies['okta-oauth-nonce'];
  var state = request.cookies['okta-oauth-state'];
  console.log(payload);
 // var token = jwt.sign(payload, cert, { algorithm: 'RS256', header: {kid: 'testKey'}});
  var token = jwt.sign(payload, cert, { algorithm: 'RS256', expiresIn: 30000, header: {kid: 'testKey', scopes: [ 'openid', 'profile', 'email' ], expiresAt: '2019-11-02T23:44:41.736Z', idToken: 'abcdefg12345'}});
  //var token = jws.sign({header: {alg: 'RS256', keyid: 'testKey'}, payload: payload, privateKey: cert});
  console.log(token);
  response.redirect('http://localhost:4200/implicit/callback#access_token=' + token + authorizeUrlParams + token + '&state=' + state);
});

// Pre-flight request for openid-config
app.options('/oauth2/default/.well-known/openid-configuration', (request, response) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:4200");
  response.header("Access-Control-Allow-Credentials", true);
  response.header("Access-Control-Allow-Headers", "content-type,x-okta-user-agent-extended,x-okta-xsrftoken,X-Requested-With");
  response.send();
});

// Call openid-config API
app.get('/oauth2/default/.well-known/openid-configuration', (request, response) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:4200");
  response.header("Access-Control-Allow-Credentials", true);
  response.header("Access-Control-Allow-Headers", "content-type,x-okta-user-agent-extended,x-okta-xsrftoken,X-Requested-With");
  response.json(openidConfig);
});

// Pre-flight request for keys
app.options('/oauth2/default/v1/keys', (request, response) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:4200");
  response.header("Access-Control-Allow-Credentials", true);
  response.header("Access-Control-Allow-Headers", "content-type,x-okta-user-agent-extended,x-okta-xsrftoken,X-Requested-With");
  response.send();
});

// Call keys API
app.get('/oauth2/default/v1/keys', (request, response) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:4200");
  response.header("Access-Control-Allow-Credentials", true);
  response.header("Access-Control-Allow-Headers", "content-type,x-okta-user-agent-extended,x-okta-xsrftoken,X-Requested-With");
  response.json(keysBody);
});

// Start Mock Server
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

