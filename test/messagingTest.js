(function () {
    var publisher,
        callbackData,
        callbackData2,
        callback = function (data) { callbackData = data; },
        callback2 = function (data) { callbackData2 = data; };

    module("mixinPubSub", {
        setup: function () {
            publisher = messaging.mixinPubSub({five: 5});
            callbackData = undefined;
            callbackData2 = undefined;
            publisher.subscribe(callback, callback2);
            publisher.publish("foo");
        }
    });

    test("methods are added to object", function () {
        deepEqual(publisher.five, 5, "retains existing properties");
        ok(_.isFunction(publisher.subscribe), "has subscribe method");
        ok(_.isFunction(publisher.unsubscribe), "has unsubscribe method");
        ok(_.isFunction(publisher.publish), "has publish method");
    });

    test("publish/subscribe, multiple subscribers", function () {
        deepEqual(callbackData, "foo", "first callbackData ok");
        deepEqual(callbackData2, "foo", "second callbackData ok");
    });

    test("unsubscribe", function () {
        publisher.unsubscribe(callback);
        publisher.publish("bar");
        deepEqual(callbackData, "foo", "callbackData not updated");
        deepEqual(callbackData2, "bar", "callbackData2 is updated");
    });

}());

(function () {
    var evented, event1Data1, event1Data2, event2Data;

    module("mixinEvents", {
        setup: function () {
            event1Data1 = undefined;
            event1Data2 = undefined;
            event2Data = undefined;
            evented = messaging.makeEvented({
                five: 5,
                event1: function (data1, data2) {
                    event1Data1 = data1;
                    event1Data2 = data2;
                },
                event2: function (data) {
                    event2Data = data;
                }
            });
        }
    });

    test("methods are added to object", function () {
        deepEqual(evented.five, 5, "retains existing properties");
        ok(_.isFunction(evented.event1), "retains existing methods");
        ok(_.isFunction(evented.event2), "retains existing methods");
        ok(_.isFunction(evented.on), "has on method");
    });

    test("binds to event", function () {
        var isCallback1Called = false,
            isCallback2Called = false,
            isCallback3Called = false;

        evented.on("event1", function () { isCallback1Called = true; });
        evented.on("event1", function () { isCallback2Called = true; });
        evented.on("event2", function () { isCallback3Called = true; });

        evented.event1("foo", "bar");
        deepEqual(event1Data1, "foo", "regular event1 is called with arguments");
        deepEqual(event1Data2, "bar", "regular event1 is called with arguments");
        ok(isCallback1Called, "callback1 is called when event1 is called");
        ok(isCallback2Called, "callback2 is called when event1 is called");
        deepEqual(event2Data, undefined, "callback3 not called");

        evented.event2("baz");
        deepEqual(event2Data, "baz", "regular event2 is called");
        ok(isCallback3Called, "callback3 is called when event2 is called");
    });

}());

