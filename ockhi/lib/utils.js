const builder = require('xmlbuilder');
const util = require('util');
const fs = require('fs-extra');
const crypto = require('crypto');
const config = require('./config');
const csv = require('csvtojson');

function toXML(data, cb) {
    console.log("to xml data: ");
    console.log(util.inspect(data, false, null))

    var feed = builder.create(data, { encoding: 'utf-8' });
    var result = feed.end({ pretty: true });
    cb(result);
}

function checkDirPath(dir, cb) {
    process.umask(0); // to create 777 permissions, else it would create 755 or 775
    var opts = { mode: parseInt('777', 8) }   // Read, Write, Exec to all as recordings are written by freeswitch user.
    fs.ensureDir(dir, opts, err => {
        if (err) console.log(err)
        // Directory path exists / created new
        cb();
    });
}

function encrypt(key, req) {
    var cipher = crypto.createCipher(config.CRYPT_ALGORITHM, key);
    var encrypted = cipher.update(JSON.stringify(req), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(key, res) {
    var decipher = crypto.createDecipher(config.CRYPT_ALGORITHM, key)
    var decrypted = decipher.update(res, 'hex', 'utf8')
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

function generateAction(application, data, inline) {
    var action = {
        "@application": application,
    };
    if (data)
        action["@data"] = data;
    if (inline)
        action["@inline"] = true;
    return action;
}

function createResourceDirs(domain, type) {
    var runner = require("child_process");

    checkDirPath("/opt/tringphone/sounds/" + domain + "/", () => { });
    checkDirPath("/opt/tringphone/mohs/" + domain + "/", () => { });

    runner.exec('node ' + __dirname + '/../utils/createDir.js ' + type + ' ' + domain, function (err) {
        if (err) console.log('[ UPLOAD DIR PATH ERROR ! ] ' + err);
    });
}

function padLeft(value, base, chr) {
    var len = (String(base || 10).length - String(value).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + value : value;
}

function formatDate(date) {
    let d = new Date(date)
    return [d.getFullYear(), padLeft(d.getMonth() + 1), padLeft(d.getDate()),].join('-') + ' ' + [padLeft(d.getHours()), padLeft(d.getMinutes()), padLeft(d.getSeconds())].join(':')
}

function csvToJson(filename, headers, cb) {
    csv({ headers: headers })
        .fromFile(filename)
        .then((jsonObj) => {
            console.log(jsonObj);
            cb(jsonObj)
        })
}

module.exports = {
    toXML,
    formatDate,
    csvToJson,
    encrypt,
    decrypt,
    checkDirPath,
    generateAction,
    createResourceDirs,
    getGateways
};