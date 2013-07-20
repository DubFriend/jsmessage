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


messaging.mixinEvents = function (object) {
    var subscribers = {};

    _.each(object, function (property, name) {
        if(_.isFunction(property)) {
            object[name] = (function (originalMethod) {
                return function () {
                    originalMethod.apply(object, arguments);
                    _.each(subscribers[name], function (callback) {
                        callback();
                    });
                };
            }(object[name]));
        }
    });

    object.on = function (event, callback) {
        subscribers[event] = subscribers[event] || [];
        subscribers[event].push(callback);
    };

    object.off = function (event, callback) {
        if(callback) {
            subscribers[event] = _.filter(subscribers[event], function (subscriber) {
                return subscriber !== callback;
            });
        }
        else {
            subscribers[event] = undefined;
        }
    };

    return object;
};
