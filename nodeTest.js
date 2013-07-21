//run this from node.

var jsMessage = require('./jsmessage');
var pub = jsMessage.mixinPubSub();

pub.subscribe(function (data) {
    console.log(data);
});

pub.publish("jsMessage is loaded and working.");
