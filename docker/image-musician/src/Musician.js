const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const protocol = require('./MusicianProtocol');
const {v4} = require('uuid');

/* Object to map sounds and instruments */
const instruSounds = {
    piano : "ti-ta-ti",
    trumpet : "pouet",
    flute : "trulu",
    violin : "gzi-gzi",
    drum : "boum-boum"
}

function Musician(instrument) {

    this.uuid = v4();
    this.instrument = instrument;
    this.sound = instruSounds[instrument];

    Musician.prototype.update = function () {

        /* Create data to send */
        const data = {
            uuid: this.uuid,
            sound: this.sound,
        };
        const payload = JSON.stringify(data);

        /* Send the datagram */
        const message = new Buffer.from(payload);
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
            function (err, bytes) {
                console.log("Sending payload: " + payload + " via port " + socket.address().port);
            }
        );
    }

    /* Each second emit a sound */
    setInterval(this.update.bind(this), 1000);
}

/*
 * Get the instrument as a param
 */
const instrument = process.argv[2];

/*
 * Init a new Musician
 */
const m = new Musician(instrument);