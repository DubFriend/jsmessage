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


//  example
//  var object = messaging.mixinEvents(object, {
        //passed return value of called method, and "this"
        //is bound to the object receiving the mixin.
//      functionName: function (returnValue) {
            //what is returned is what gets passed to the user supplied callback.
//          return {
//              foo: returnValue,
//              bar: this.objectProperty
//          };
//      }
//  });
messaging.mixinEvents = function (object, argumentGenerators) {
    var bindings = {},
        argGen = argumentGenerators || {};

    //wrap each function of the object with its trigger.
    _.each(object, function (property, name) {
        if(_.isFunction(property)) {
            object[name] = function () {
                var callbackArg,
                    returnValue = property.apply(object, arguments);

                if(bindings[name]) {
                    if(argGen[name]) {
                        callbackArg = argGen[name].apply(object, [returnValue]);
                    }

                    _.each(bindings[name], function (callback) {
                        callback(callbackArg);
                    });
                }

                return returnValue;
            };
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
