(function () {
    var publisher,
        callbackData,
        callbackData2,
        callback = function (data) { callbackData = data; },
        callback2 = function (data) { callbackData2 = data; };

    module("mixinPubSub", {
        setup: function () {
            publisher = messaging.mixinPubSub();
            callbackData = undefined;
            callbackData2 = undefined;
        }
    });

    test("methods are added to object", function () {
        var publisher = messaging.mixinPubSub({five: 5});
        deepEqual(publisher.five, 5, "retains existing properties");
        ok(_.isFunction(publisher.subscribe), "has subscribe method");
        ok(_.isFunction(publisher.unsubscribe), "has unsubscribe method");
        ok(_.isFunction(publisher.publish), "has publish method");
    });

    test("test publish/subscribe", function () {
        publisher.subscribe(callback);
        publisher.publish("foo");
        deepEqual(callbackData, "foo", "publisher calls callback");
    });

    test("test publish/subscribe, multiple subscribers", function () {
        publisher.subscribe(callback);
        publisher.subscribe(callback2);
        publisher.publish("bar");
        deepEqual(callbackData, "bar", "first callbackData ok");
        deepEqual(callbackData2, "bar", "second callbackData ok");
    });

    test("test subscribe, pass multiple callbacks", function () {
        publisher.subscribe(callback, callback2);
        publisher.publish("baz");
        deepEqual(callbackData, "baz", "first callbackData ok");
        deepEqual(callbackData2, "baz", "second callbackData ok");
    });

    test("unsubscribe", function () {
        publisher.subscribe(callback, callback2);
        publisher.unsubscribe(callback);
        publisher.publish("foo");
        deepEqual(callbackData, undefined, "callbackData not updated");
        deepEqual(callbackData2, "foo", "callbackData2 is updated");
    });

}());
