const esl = require('modesl');
// const dtmf = require('./dtmf');
// const playRecording = require('./playRecording');

const eslServer = new esl.Server({ port: 8085, myevents: true }, () => {
    console.log('esl ivr server is up');
}); // esl_server

eslServer.on('connection::ready', (conn) => {

    // console.log(conn)
    // conn.answer()
    // conn.execute('playback', '/usr/local/freeswitch/sounds/en/us/callie/conference/8000/conf-pin.wav');
    conn.execute("play_and_get_digits", "1 1 5 3000 # $${base_dir}/sounds/en/us/callie/conference/8000/conf-pin.wav /invalid.wav foobar (1)", (err, res) => {
        console.log(err, res)
        conn.execute("hangup")
    })
    // digits = conn.playAndGetDigits(1, 3, 3, 3000, "#", "/menu-greeting.wav", "/invalid.wav", "\\d+")
    // session:consoleLog("info", "Got dtmf: ".. digits .."\n");
    //   dtmf.startDTMF(conn);
    //   playRecording.ivrMenu(conn);
    //   dtmf.captureDTMF(conn);
}); // eslServer.on