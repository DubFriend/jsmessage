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

messaging.makeEvented = function (object) {
    var that = {},
        subscribers = {};

    _.each(object, function (property, name) {
        if(_.isFunction(property)) {
            that[name] = function () {
                object[name].apply(that, arguments);
                _.each(subscribers[name], function (callback) {
                    callback();
                });
            };
        }
        else {
            that[name] = property;
        }
    });

    that.on = function (event, callback) {
        subscribers[event] = subscribers[event] || [];
        subscribers[event].push(callback);
    };

    return that;
};