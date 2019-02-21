const mongo = require('../db');
const utils = require('../lib/utils');
const config = require('../lib/config');
const util = require('util');

function getAuth(request, cb) {
    var domain = request.domain;
    var userid = request.user;

    var calling_function = request['Event-Calling-Function'];
    var append_variables = true;

    var user = {
        "document": {
            "@type": "freeswitch/xml",
            "section": {
                "@name": "directory",
                "domain": {
                    "@name": domain,
                    "@alias": "true",
                    "params": {
                        "param": [
                            {
                                "@name": "jsonrpc-allowed-methods",
                                "@value": "verto"
                            },
                            {
                                "@name": "jsonrpc-allowed-event-channels",
                                "@value": "demo,conference,presence"
                            }
                        ]
                    },
                    "groups": {
                        "group": {
                            "@name": "default",
                            "users": {
                                "user": {
                                    "@id": null,
                                    "@number-alias": null,
                                    "params": {
                                        "param": []
                                    }
                                    // ,
                                    // "variables": {
                                    //     "variable": []
                                    // }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    checkUser(userid, domain, function (err, doc) {
        if (doc) {
            if ((request['Event-Calling-File'] === "mod_fifo.c") && (doc["callStatus"] && doc["callStatus"] !== "hangup")) {
                console.log("User Not Available To Take Call: ", userid + "@" + domain, " ", doc["callStatus"]);
                utils.toXML(config.NOT_FOUND, function (result) {
                    cb(result);
                });
            } else {
                user.document.section.domain.groups.group.users.user['@id'] = doc['@id'];
                user.document.section.domain.groups.group.users.user['@number-alias'] = doc['@number-alias'];
                user.document.section.domain.groups.group.users.user.params.param = doc.params;
                utils.toXML(user, function (result) {
                    cb(result);
                });
            }
        } else {
            console.log("User not found: ", userid + "@" + domain);
            utils.toXML(config.NOT_FOUND, function (result) {
                cb(result);
            });
        }
    });
}

function checkUser(userid, domain, cb) {
    mongo.db.users.findOne({
        $or: [{ "@id": userid }, { "@number-alias": userid }],
        "domain": domain
    }, function (err, doc) {
        if (doc) {
            console.log("User exists: ", userid + "@" + domain);
            cb(null, doc);
        } else {
            if (!doc) {
                console.log("User doesn't exist: ", userid + "@" + domain);
                cb(null, null);
            } else if (err) {
                console.log(err);
                cb(0, null);
            }
        }
    });
}

function getDomains(request, cb) {
    var domains = {
        "document": {
            "@type": "freeswitch/xml",
            "section": {
                "@name": "directory",
                "domain": []
            }
        }
    };

    let query = {};
    if (request["Event-Calling-Function"] === "switch_xml_locate_domain") {
        query = {
            "@name": request["key_value"]
        }
    }

    mongo.db.domains.find(
        query, {
            _id: 0,
            "@name": 1
        }
        , function (err, doc) {
            if (doc) {
                domains.document.section.domain = doc;
                utils.toXML(domains, function (result) {
                    cb(result);
                });
            } else {
                if (err) console.log(err);
            }
        });
}

module.exports = {
    getAuth,
    getDomains,
    checkUser
}
