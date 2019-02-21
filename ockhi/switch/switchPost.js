const utils = require('../lib/utils');
const config = require('./lib/config');
const domain = require('./domain');
const configuration = require('./configuration');
const dialplan = require('./dialplan');
const fs = require('./socket/fs');

function switchPostHandler(io, req, cb) {

    switch (req.body.section) {
        case "directory":
            {
                if (req.body.action === "sip_auth" || req.body.action === "user_call" || req.body.action === "voicemail-lookup" || req.body.action === "message-count" || req.body['Event-Calling-Function'] === "user_data_function") {
                    domain.getAuth(req.body, function (result) {
                        console.log("RESULT: ", result);
                        cb(result);
                    });
                } else if (req.body.purpose === "gateways" || req.body.purpose === 'network-list' || req.body["Event-Calling-Function"] === "switch_xml_locate_domain") {
                    domain.getDomains(req.body, function (result) {
                        console.log("DOMAINS RESULT: ", result);
                        cb(result);
                    });
                } else {
                    utils.toXML(config.NOT_FOUND, function (result) {
                        cb(result);
                    });
                }
            }
            break;

        // case "configuration":
        //     {
        //         if (req.body.key_value === "sofia.conf") {
        //             configuration.getSofiaConf(function (err, data) {
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }
        //             });
        //         } else if (req.body.key_value === "conference.conf") {
        //             configuration.getConferenceConf(req.body, function (err, data) {
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }
        //             });
        //         } else if (req.body.key_value === "ivr.conf") {
        //             configuration.getIvrConf(req.body, function (err, data) {
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }
        //             });
        //         } else if (req.body.key_value === "callcenter.conf") {
        //             configuration.getCallcenterConf(req.body, function (err, data) {
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }
        //             });
        //         } else if (req.body.key_value === "fifo.conf") {
        //             configuration.getFifoConf(req.body, function (err, data) {
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }
        //             });
        //         } else if (req.body.key_value === "acl.conf") {
        //             configuration.getAclConf(function (err, data) {
        //                 // console.log(err, data);
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }

        //             });
        //         } else if (req.body.key_value === "http_cache.conf") {
        //             configuration.getAwsS3Conf(function (err, data) {
        //                 // console.log(err, data);
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }

        //             });
        //         } else if (req.body.key_value === "post_load_modules.conf") {
        //             configuration.getPostLoadModulesConf(function (err, data) {
        //                 // console.log(err, data);
        //                 if (err)
        //                     console.log(err);
        //                 else {
        //                     cb(data);
        //                 }

        //             });
        //         } else if (req.body.key_value === "post_load_switch.conf") {
        //             setTimeout(() => {
        //                 fs.subscribeEvents(io);
        //             }, 1000);
        //             utils.toXML(config.NOT_FOUND, function (result) {
        //                 cb(result);
        //             });
        //         } else {
        //             utils.toXML(config.NOT_FOUND, function (result) {
        //                 cb(result);
        //             });
        //         }
        //     }
        //     break;

        // case "dialplan":
        //     {
        //         if (req.body['Event-Calling-Function'] === "dialplan_xml_locate") {
        //             dialplan.getDialPlanContext(req.body, function (err, data) {
        //                 if (err) {
        //                     console.log(err);
        //                     utils.toXML(config.NOT_FOUND, function (result) {
        //                         cb(result);
        //                     });
        //                 }
        //                 else {
        //                     cb(data);
        //                 }
        //             });
        //         } else {
        //             utils.toXML(config.NOT_FOUND, function (result) {
        //                 cb(result);
        //             });
        //         }
        //     }
        //     break;
        default:
            utils.toXML(config.NOT_FOUND, function (result) {
                cb(result);
            });
            break;
    }
}

module.exports = {
    switchPostHandler
};