#jsMessage
jsMessage provides mixins for publish/subscribe, and event binding patterns.



#mixinPubSub
Gives passed object a publish-subscribe implementation.  Subscribers register callbacks to listen for events on a topic.
```javascript
object = jsMessage.mixinPubSub(object);
```

####publish
Publish data to all subscribers of a given topic.
```javascript
pubSub.publish("topicName", data);
```

####subscribe
Subscribe a callback function to receive updates on a specified topic from the pubSub object.
```javascript
pubSub.subscribe("topicName", function (data) {
    console.log(data);
});
```

####unsubscribe
Unsubscribe a callback function from pubSub object.
```javascript
//unsubscribe from any topic
pubSub.unsubscribe(callbackFunction);
//of only from a specified topic
pubSub.unsubscribe(callbackFunction, "topicName");
```

####autoPublish
Returns a getter/setter function that automatically publishes to a given topic when the data is set to a new value.
```javascript
var data = pubSub.autoPublish("topicName");

//sets data to "hello" and publishes "hello" to "topicName"
data("hello");

//returns "hello", does not publish.
var storedValue = data();
```
autoPublish takes an optional callback as its second argument.  The callback will be called on data before it is published.
```javascript
var data = pubSub.autoPublish("topicName", function (data) {
    return data.toUpperCase();
});

data("foo"); //publishes "FOO"
data() === "foo"; //true
```



#mixinEvents
Gives passed object an events implementation.  Subscribers register callbacks to listen for when specific methods are executed.  mixinEvents should be called last, after the passed object is allready completely defined.  (Any methods added after will not be visible to the events system)

The second argument to mixinEvents defines functions that will be used to generate arguments that will be passed to the listening callback functions. The second argument is optional, and may be defined for only a subset of the objects methods.

**example**
```javascript
var object = {
    prop: "foo",
    increment: function (num) {
        return num + 1;
    }
};

object = jsMessage.mixinEvents(object, {
    //these functions will be passed the return value of the associated method,
    //and will have their "this" value set to the object getting the event mixin.
    increment: function (returnedValue) {
        //the returned value is what will be passed into callbacks listening to
        //the associated method.
        return {
            returnedValue: returnedValue,
            prop: this.prop
        };
    }
});

object.on("increment", function (arg) {
    console.log(arg.returnedValue);
    console.log(arg.prop);
});

//logs "foo", and "3" to the console.
object.increment(2);
```

####on
Register a callback to be called after the execution of the specified method.  If the specified method was given a argumentsGenerator function it will be called, and its returned results will be passed into the registered callback.
```javascript
object.on("methodName", callback);
```

####off
Remove a callback from listening to a method.
```javascript
object.off("methodName", callback);
```
