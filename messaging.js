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
    var bindings = {};

    _.each(object, function (property, name) {
        if(_.isFunction(property)) {
            object[name] = (function (originalMethod) {
                return function () {
                    originalMethod.apply(object, arguments);
                    _.each(bindings[name], function (callback) {
                        callback();
                    });
                };
            }(object[name]));
        }
    });

    object.on = function (event, callback) {
        bindings[event] = bindings[event] || [];
        bindings[event].push(callback);
    };

    object.off = function (event, callback) {
        if(callback) {
            bindings[event] = _.filter(bindings[event], function (subscriber) {
                return subscriber !== callback;
            });
        }
        else {
            bindings[event] = undefined;
        }
    };

    return object;
};
