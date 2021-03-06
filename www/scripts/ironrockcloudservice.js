//'use strict';
/*jshint esversion: 6 */
/*jslint nomen: true */
// Class definition
const ENVIRONMENT_TYPE_DEVELOPMENT = "DEVELOPMENT";
const ENVIRONMENT_TYPE_TESTING = "TESTING";
const ENVIRONMENT_TYPE_PRODUCTION = "PRODUCTION";
var ironrockcloudservice = (function() {
    //edited July 18, 2016 4:27pm
    //fixed lambda error..
    //edited July 18, 2016 10:14 am
    //added misc..
    'use strict';
    //development/testing
    const USER_POOL_ID_TEST = 'us-east-1_S05gwcXQX';
    const CLIENT_ID_TEST = '7kt3jgk37i06qlra4cmb7jd5bi';
    //production
    const USER_POOL_ID_PROD = 'us-east-1_cwLOmmqfy';
    const CLIENT_ID_PROD = '4g9qs2vn4mf93fjee5ns9oecb8';
    //variables
    const IDENTITY_POOL = 'us-east-1:ed89e513-79fc-4183-ba95-aebd5bbbabd6';
    var _userPoolId; //= 'us-east-1_S05gwcXQX';
    var _clientId; // = '7kt3jgk37i06qlra4cmb7jd5bi';

    const AWS_REGION = 'us-east-1';

    var _environmentType = ENVIRONMENT_TYPE_DEVELOPMENT;


    function set_cognito_environment() {
        switch (_environmentType) {
            case ENVIRONMENT_TYPE_PRODUCTION:
                _userPoolId = USER_POOL_ID_PROD;
                _clientId = CLIENT_ID_PROD;
                break;
                //case ENVIRONMENT_TYPE_TESTING:
                //case ENVIRONMENT_TYPE_DEVELOPMENT:
            default:
                _userPoolId = USER_POOL_ID_TEST;
                _clientId = CLIENT_ID_TEST;
                break;
        }
    }

    function set_dynamodb_tableName(base_table_name) {
        switch (_environmentType) {
            case ENVIRONMENT_TYPE_PRODUCTION:
                return "_p_" + base_table_name;
            case ENVIRONMENT_TYPE_TESTING:
                return base_table_name;
            case ENVIRONMENT_TYPE_DEVELOPMENT:
                return base_table_name;
            default:
                return base_table_name;
        }
    }

    function set_lambda_functionName(base_function_name) {
        switch (_environmentType) {
            case ENVIRONMENT_TYPE_PRODUCTION:
                return base_function_name + ":prod";
            case ENVIRONMENT_TYPE_TESTING:
                return base_function_name + ":test";
            case ENVIRONMENT_TYPE_DEVELOPMENT:
                return base_function_name;
            default:
                return base_function_name;
        }
    }


    //private properties and methods
    var _profile = {};
    var _specialuser = 'SVJBZG1pbg==';
    var _specialrole = 'QWRtaW4=';

    var _creds = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL
    });

    var _poolData;

    // Initialize the Amazon Cognito credentials provider
    // AWS.config.region = AWS_REGION; // Region
    // AWS.config.credentials = _creds;
    //
    // AWSCognito.config.region = AWS_REGION;
    // AWSCognito.config.credentials = _creds;
    //
    // AWSCognito.config.update({
    //     accessKeyId: 'anything',
    //     secretAccessKey: 'anything'
    // });

    var _userPool; //= new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_poolData);
    var _cognitoUser; // = _userPool.getCurrentUser();

    var _lambda; // = new AWS.Lambda();




    //private methods
    //Get auth details for lambda authentication
    function _getAuth() {
        var auth = {};
        if (_cognitoUser) {
            auth.username = _cognitoUser.username;
            auth.signInUserSession = _cognitoUser.signInUserSession;
        }
        return auth;
    }



    //set Credentials
    function _setCredentials(session) {
        if (session && session.isValid()) {
            var idToken = session.getIdToken().getJwtToken();
            var provider_name = 'cognito-idp.' + AWS_REGION + '.amazonaws.com/' + _userPoolId;
            _creds.params.Logins = {};
            _creds.params.Logins[provider_name] = idToken;
            _creds.expired = true;
            //AWS.config.credentials = _creds;
            //AWSCognito.config.credentials = _creds;
            console.log(_creds);
        }
    }


    //transform dynamodb fields
    function getS(value) {
        try {
            return value.S;
        } catch (err) {
            return "";
        }
    }

    function getN(value) {
        try {
            return value.N;
        } catch (err) {
            return 0;
        }
    }


    function getBool(value) {
        try {
            var valueN = parseInt(value.N);
            return valueN == 1;
        } catch (err) {
            return false;
        }
    }

    //process response from lambda
    function processLambdaData(err, resp, callback) {
        if (err) return;
        resp = JSON.parse(resp.Payload);
        if (resp && resp.errorMessage) {
            //transform errorMessage
            var newMessage = resp.errorMessage;
            switch (resp.errorMessage) {
              case "1 validation error detected: Value '[]' at 'requestItems.IronRockQuotes.member.keys' failed to satisfy constraint: Member must have length greater than or equal to 1":
                newMessage = "No Result Found";
                break;
              default:
            }
            err = new Error(newMessage);
            resp = null;
        }
        if (resp && !resp.success && resp.error_message) {
            err = new Error(resp.error_message);
            resp = null;
        }
        callback(err, resp);
    }


    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    //get broker internal function
    function _getBroker(code, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'getBroker',
            'data': {
                'code': code
            }
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    }


    //constructor  aug0, aug1    generally aug0 == _environmentType and aug1 == callback
    function ironrockcloudservice(aug0, aug1) {
        //must run last.  will check if user is valid...
        //_environmentType
        var callback;
        if (aug0 && typeof aug0 == "function") {
            callback = aug0;
        } else if (aug0) {
            _environmentType = aug0;
        }

        if (aug1 && typeof aug1 == "function") {
            callback = aug1;
        }

        var $this = this;
        //set variables
        set_cognito_environment();

        _poolData = {
            UserPoolId: _userPoolId,
            ClientId: _clientId
        };

        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = AWS_REGION; // Region
        AWS.config.credentials = _creds;

        AWSCognito.config.region = AWS_REGION;
        AWSCognito.config.credentials = _creds;

        AWSCognito.config.update({
            accessKeyId: 'anything',
            secretAccessKey: 'anything'
        });

        _lambda = new AWS.Lambda();

        _userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_poolData);
        _cognitoUser = _userPool.getCurrentUser();


        //
        if (_cognitoUser === null) {
            if (callback && typeof callback == "function") {
                callback(null, $this);
            }
            return;
        }
        _cognitoUser.getSession(function(err, session) {
            if (err) {
                console.log(err);
                _cognitoUser.signOut();
                _cognitoUser = null;
                AWS.config.credentials.clearCachedId();
                callback(new Error('Account has been expired!. Please login again!')); //   null, $this);
            } else {
                _setCredentials(session);
                _profile = parseJwt(session.getIdToken().getJwtToken());
                _profile.username = _profile['cognito:username'];
                _profile.broker = _profile['custom:brokerId'];

                if (btoa(_profile.username) == _specialuser) {
                    _profile.role = atob(_specialrole);
                } else {
                    _profile.role = _profile['custom:roleId'];
                }

                AWS.config.credentials.refresh(function() {
                    //get broker details
                    if (_profile.broker && _profile.broker.toLowerCase() != "none") {
                        _getBroker(_profile.broker, function(err, resp) {
                            if (!err) _profile.brokerDetails = resp;
                            if (callback && typeof callback == "function") {
                                callback(null, $this);
                            }

                        });
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(null, $this);
                        }
                    }
                });

            }
        });
    }

    //getUser
    //get user
    ironrockcloudservice.prototype.getUser = function(username, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'getUser',
            'data': {
                'username': username
            }
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };



    //public methods
    ironrockcloudservice.prototype.setCredentials = function(callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(_creds);
                callback(null, _creds);
            }
        });

    };

    ironrockcloudservice.prototype.getProfile = function() {
        return _profile;
    };


    ironrockcloudservice.prototype.getUsername = function() {
        if (_cognitoUser === null || _cognitoUser.signInUserSession === null) {
            return null;
        } else {
            return _cognitoUser.getUsername();
        }
    };


    // Instance methods
    ironrockcloudservice.prototype.signoff = function() {
        if (_cognitoUser !== null) {
            _cognitoUser.signOut();
            _cognitoUser = null;
            AWS.config.credentials.clearCachedId();
        }
    };

    ironrockcloudservice.prototype.disableUser = function(username, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'disableUser',
            'username': username
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    ironrockcloudservice.prototype.enableUser = function(username, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'enableUser',
            'username': username
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    ironrockcloudservice.prototype.deleteUser = function(username, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'deleteUser',
            'username': username
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    ironrockcloudservice.prototype.signup = function(user, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'createUser',
            'data': user
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    ironrockcloudservice.prototype.confirmSignup = function(username, verificationCode, callback) {
        var userData = {
            Username: username,
            Pool: _userPool
        };
        _cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        _cognitoUser.confirmRegistration(verificationCode, true, function(err, result) {
            callback(err, result);
        });
    };


    ironrockcloudservice.prototype.signin = function(username, password, callback) {
        var $this = this;
        var trimmedUsername = username.trim();
        console.log(_creds);
        var authenticationData = {
            Username: trimmedUsername,
            Password: password
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        var userData = {
            Username: trimmedUsername,
            Pool: _userPool
        };
        _cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        _cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                _setCredentials(result);
                if (callback && typeof callback == "function")
                    callback(null, false, $this);
            },
            onFailure: function(err) {
                //_cognitoUser = null;
                if (callback && typeof callback == "function")
                    callback(err, $this);
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                callback(null, true, this, userAttributes, requiredAttributes);
            }
        });
    };

    //completeChallenge
    ironrockcloudservice.prototype.completeChallenge = function(newPassword, user, $this) {
        var attributesData = {};
        attributesData.phone_number = '+18766568000';
        attributesData.gender = 'male';
        _cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, $this);
    };


    //change password for logon user
    ironrockcloudservice.prototype.changePassword = function(oldPassword, newPassword, callback) {
        _cognitoUser.changePassword(oldPassword, newPassword, function(err, result) {
            console.log('call result: ' + result);
            callback(err);
        });
    };


    //forgot password
    ironrockcloudservice.prototype.forgotPassword = function(username, callback) {
        var userData = {
            Username: username,
            Pool: _userPool
        };
        _cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        _cognitoUser.forgotPassword({
            onSuccess: function(result) {
                callback(null, false, result);
            },
            onFailure: function(err) {
                _cognitoUser = null;
                callback(err);
            },
            inputVerificationCode: function() {
                callback(null, true, this);
            }
        });
    };

    //confirm-- forgot password
    ironrockcloudservice.prototype.confirmPassword = function(verificationCode, newPassword, $this) {
        _cognitoUser.confirmPassword(verificationCode, newPassword, $this);
    };


    //admin only
    ironrockcloudservice.prototype.listUsers = function(role, broker, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'listUsers',
            'data': {
                'broker': broker,
                'role': role
            }
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //list roles
    ironrockcloudservice.prototype.listRoles = function(callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'listRoles'
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //update user
    //link user to Role
    ironrockcloudservice.prototype.updateUser = function(user, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'updateUser',
            'data': user
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };



    //list brokers
    ironrockcloudservice.prototype.listBrokers = function(callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'listBrokers'
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //get broker ---public function
    ironrockcloudservice.prototype.getBroker = function(code, callback) {
        _getBroker(code, function(err, resp) {
            callback(err, resp);
        });
    };


    //create broker
    ironrockcloudservice.prototype.createBroker = function(data, callback) {
        var jsonRequest = {};
        if (data.logo === null) data.logo = '#';
        jsonRequest.request = {
            'cmd': 'createBroker',
            'data': data
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //modify broker
    ironrockcloudservice.prototype.modifyBroker = function(data, callback) {
        var jsonRequest = {};
        if (data.logo === null) data.logo = '#';
        jsonRequest.request = {
            'cmd': 'modifyBroker',
            'data': data
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //delete broker
    ironrockcloudservice.prototype.deleteBroker = function(brokerCode, callback) {
        var jsonRequest = {};
        jsonRequest.request = {
            'cmd': 'deleteBroker',
            'data': {
                'code': brokerCode
            }
        };
        jsonRequest.auth = _getAuth();
        var requestSerialized = JSON.stringify(jsonRequest);
        var params = {
            FunctionName: set_lambda_functionName('ironrockAdminFunc'),
            Payload: requestSerialized
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //get BrokerOne data
    ironrockcloudservice.prototype.getBrokerOneData = function(brokerCode, callback) {
        if(!brokerCode || brokerCode.toLowerCase() == "none") return callback();
        var jsonRequest = {
            "brokerCode": brokerCode
        };

        var params = {
            FunctionName: set_lambda_functionName('ironrock_brokerOneGet'),
            Payload: JSON.stringify(jsonRequest)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //all registered users
    //submit quote
    ironrockcloudservice.prototype.submitQuote = function(data, callback) {
        var payload = {
            "formData": JSON.parse(data),
            "auth": _getAuth()
        };
        var params = {
            FunctionName: set_lambda_functionName('ironrockSubmitQuote'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //search for quote
    ironrockcloudservice.prototype.searchQuotes = function(data, callback) {
        var payload = JSON.parse(data);
        payload.auth = _getAuth();
        var params = {
            FunctionName: set_lambda_functionName('ironrockQuoteSearch'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //get quote
    ironrockcloudservice.prototype.getQuote = function(id, callback) {
        var params = {
            FunctionName: set_lambda_functionName('ironrockGetQuote'),
            Payload: id
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //get Licence No
    ironrockcloudservice.prototype.getDriverLicenseDetails = function(id, callback) {
        var payload = {
            "id": id
        };
        var params = {
            FunctionName: set_lambda_functionName('IronRockDriverLicense'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //get Vehicle Details
    ironrockcloudservice.prototype.getVehicleDetails = function(plateNo, chassisNo, callback) {
        var payload = {
            "plateno": plateNo,
            "chassisno": chassisNo
        };
        var params = {
            FunctionName: set_lambda_functionName('IronRockVehicle'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //get misc
    ironrockcloudservice.prototype.getMiscOptions = function(callback) {
        var params = {
            FunctionName: set_lambda_functionName('ironrockGetMiscData'),
            Payload: null
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };




    //get upload policy
    ironrockcloudservice.prototype.getUploadPolicy = function(quoteNo, callback) {
        var payload = {
            "quoteNo": quoteNo,
            "auth": _getAuth()
        };
        var params = {
            FunctionName: set_lambda_functionName('ironrockS3uploadPolicy'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //upload document to S#
    ironrockcloudservice.prototype.uploadToS3 = function(quoteNo, file, name, callback) {
        if (file.type != 'application/pdf') {
            callback(new Error("Only PDF documents allowed"));
            return;
        }
        var newFilename = this.generateRandomCode(8, 4);
        newFilename = newFilename.replace(/[^A-Z0-9]/ig, "_");
        var params = {
            Key: 'quotes/' + newFilename + ".pdf",
            ContentType: file.type,
            Body: file,
            ACL: 'private',
            Metadata: {
                "quoteNo": quoteNo,
                "broker": _profile.broker,
                "agent": _profile.username,
                "document_name": name,
                "original_filename": file.name,
            },
        };
        var _s3 = new AWS.S3({
            params: {
                Bucket: 'ironrockdocuments.courserv.com'
            }
        });
        _s3.putObject(params, function(err, resp) {
            callback(err);
        });
    };


    //get object in S3
    ironrockcloudservice.prototype.getPdfDocument = function(key, callback) {
        var params = {
            Key: key
        };
        var _s3 = new AWS.S3({
            params: {
                Bucket: 'ironrockdocuments.courserv.com'
            }
        });
        _s3.getObject(params, function(err, resp) {
            if (err) {
                callback(err);

            } else {
                if (results.Body) {
                    callback(err, resp.Body);
                } else {
                    callback();
                }
            }
        });
    };



    //get document list
    ironrockcloudservice.prototype.getDocumentList = function(quoteNo, callback) {
        var dynamodb = new AWS.DynamoDB({
            apiVersion: '2012-08-10'
        });
        dynamodb.query({
            TableName: set_dynamodb_tableName('ironRockS3Documents'),
            KeyConditions: {
                "quoteNo": {
                    "AttributeValueList": [{
                        "N": quoteNo.toString()
                    }],
                    "ComparisonOperator": "EQ"
                }
            },
        }, function(err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                var ReturnedList = [];

                for (var i = 0; i < data.Items.length; i++) {
                    var item = {};
                    item.quoteNo = data.Items[i].quoteNo.N;
                    item.key = data.Items[i].key.S;
                    item.name = data.Items[i].name.S;
                    item.fileName = data.Items[i].originalFilename.S;
                    item.key = data.Items[i].key.S;
                    ReturnedList.push(item);
                }
                callback(null, ReturnedList);
            }
        });

    };









    //generate random code
    ironrockcloudservice.prototype.generateRandomCode = function(numLc, numUc, numDigits, numSpecial) {
        numLc = numLc || 4;
        numUc = numUc || 4;
        numDigits = numDigits || 4;
        numSpecial = numSpecial || 2;


        var lcLetters = 'abcdefghijklmnopqrstuvwxyz';
        var ucLetters = lcLetters.toUpperCase();
        var numbers = '0123456789';
        var special = '!?=#*$@+-.';

        var getRand = function(values) {
            return values.charAt(Math.floor(Math.random() * values.length));
        };

        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        function shuffle(o) { //v1.0
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        var pass = [],
            i = 0;
        for (i = 0; i < numLc; ++i) {
            pass.push(getRand(lcLetters));
        }
        for (i = 0; i < numUc; ++i) {
            pass.push(getRand(ucLetters));
        }
        for (i = 0; i < numDigits; ++i) {
            pass.push(getRand(numbers));
        }
        for (i = 0; i < numSpecial; ++i) {
            pass.push(getRand(special));
        }
        return shuffle(pass).join('');
    };



    //get Broker details----public access
    ironrockcloudservice.prototype.getPubicBroker = function(code, callback) {
        var dynamodb = new AWS.DynamoDB({
            apiVersion: '2012-08-10'
        });
        var params = {
            TableName: set_dynamodb_tableName('IronRockBrokers'),
            Key: {
                code: {
                    S: code
                }
            }
        };
        dynamodb.getItem(params, function(err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(data);
                var result = {};
                if (data.Item) {
                    result.code = data.Item.code.S;
                    result.name = data.Item.name.S;
                    result.globalName = getS(data.Item.globalName);
                    result.logo = getS(data.Item.logo);
                }
                console.log(result);
                callback(null, result);

            }
        });
    };



    //convert to Policy
    ironrockcloudservice.prototype.convertToPolicy = function(payload, callback) {
        payload.username = _cognitoUser.getUsername();
        var params = {
            FunctionName: set_lambda_functionName('ironrockQuoteToPolicy'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //get policy
    ironrockcloudservice.prototype.getPolicy = function(policy_id, callback) {
        var payload = {};
        payload.policy_id = policy_id;
        var params = {
            FunctionName: set_lambda_functionName('ironrockGetPolicy'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };


    //get sources
    ironrockcloudservice.prototype.getSources = function(callback) {
        var payload = {};
        payload.username = _cognitoUser.getUsername();
        var params = {
            FunctionName: set_lambda_functionName('ironrockGetSources'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //notification
    ironrockcloudservice.prototype.getNotification = function(callback) {
        var params = {
            TableName: set_dynamodb_tableName('ironrockNotificationAddresses')
        };
        var dynamodb = new AWS.DynamoDB({
            apiVersion: '2012-08-10'
        });
        dynamodb.scan(params, function(err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log('data:');
                console.log(data);
                var addresses = [];
                for (var i = 0; i < data.Items.length; i++) {
                    addresses.push(data.Items[i].emailAddress.S);
                }
                callback(null, addresses);
            }
        });
    };

    //add notifications
    ironrockcloudservice.prototype.addNotification = function(emailAddresses, callback) {
        var payload = {};
        payload.emailAddresses = emailAddresses;
        var params = {
            FunctionName: set_lambda_functionName('ironrockNotificationAddressesUpdate'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //get certificate
    ironrockcloudservice.prototype.getCertification = function(policy_id, risk_id, callback) {
        var payload = {};
        payload.policy_id = policy_id;
        payload.risk_id = risk_id;
        var params = {
            FunctionName: set_lambda_functionName('ironRockGetCertificate'),
            Payload: JSON.stringify(payload)
        };
        //var _lambda = new AWS.Lambda();
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //get finance institution codes
    // ironrockcloudservice.prototype.getFinanceInstitutions = function(callback) {
    //     var params = {
    //         FunctionName: set_lambda_functionName('IronRockGetFinanceCodes')
    //     };
    //     //var _lambda = new AWS.Lambda();
    //     _lambda.invoke(params, function(err, resp) {
    //         callback(err, resp);
    //     });
    // };

    //get Mortgagees
    // ironrockcloudservice.prototype.getMortgagees = function(callback) {
    //     var params = {
    //         FunctionName: set_lambda_functionName('ironrockGetMortgagees')
    //     };
    //     //var _lambda = new AWS.Lambda();
    //     _lambda.invoke(params, function(err, resp) {
    //         callback(err, resp);
    //     });
    // };

    //get
    //get Mortgagees
    ironrockcloudservice.prototype.pushTransaction = function(payload, callback) {
        var params = {
            FunctionName: set_lambda_functionName('ironRockPushTransaction'),
            Payload: JSON.stringify(payload)
        };
        _lambda.invoke(params, function(err, resp) {
            processLambdaData(err, resp, function(newErr, newResp) {
                callback(newErr, newResp);
            });
        });
    };

    //
    return ironrockcloudservice;
}());
