var messaging = {};

messaging.mixinPubSub = function (object) {
    object = object || {};
    var subscribers = [];

    object.subscribe = function () {
        _.each(arguments, function (callback) {
            subscribers.push(callback);
        });
    };

    object.unsubscribe = function (subscriber) {
        subscribers = _.filter(subscribers, function (callback) {
            return callback !== subscriber;
        });
    };

    object.publish = function (data) {
        _.each(subscribers, function (callback) {
            callback(data);
        });
    };

    return object;
};

