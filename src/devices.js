define(["helpers"], function(helpers) {
  // Wrapper for AT&T M2X Device API
  //
  // https://m2x.att.com/developer/documentation/device
    var Devices = function(client, keysAPI) {
        this.client = client;
        this.keysAPI = keysAPI;
    };

    // List/search the catalog of public devices
    //
    // This allows unauthenticated users to search Devices from other users
    // that have been marked as public, allowing them to read public Device
    // metadata, locations, streams list, and view each Devices' stream metadata
    // and its values.
    //
    // https://m2x.att.com/developer/documentation/v2/device#List-Search-Public-Devices-Catalog
    Devices.prototype.catalog = function(params, callback, errorCallback) {
        if (typeof params === "function") {
            callback = params;
            errorCallback = callback;
            params = {};
        }
        return this.client.get("/devices/catalog", { qs: params || {} }, callback, errorCallback);
    };

    // Retrieve the list of devices accessible by the authenticated API key that
    // meet the search criteria
    //
    // https://m2x.att.com/developer/documentation/v2/device#List-Search-Devices
    Devices.prototype.search = function(params, callback, errorCallback) {
        return this.client.get("/devices", { qs: params || {} }, callback, errorCallback);
    };

    // Retrieve the list of devices accessible by the authenticated API key that
    // meet the search criteria
    //
    // https://m2x.att.com/developer/documentation/v2/device#List-Search-Devices
    Devices.prototype.list = function(callback, errorCallback) {
        return this.search({}, callback, errorCallback);
    };

    // List the devices groups for the authenticated user
    //
    // https://m2x.att.com/developer/documentation/v2/device#List-Device-Groups
    Devices.prototype.groups = function(callback, errorCallback) {
        return this.client.get("/devices/groups", callback, errorCallback);
    };

    // Create a new device
    //
    // https://m2x.att.com/developer/documentation/v2/device#Create-Device
    Devices.prototype.create = function(params, callback, errorCallback) {
        return this.client.post("/devices", params, callback, errorCallback);
    };

    // Update a device
    //
    // https://m2x.att.com/developer/documentation/v2/device#Update-Device-Details
    Devices.prototype.update = function(id, params, callback, errorCallback) {
        return this.client.put( helpers.url("/devices/{0}", id), {
            headers: { "Content-Type": "application/json" },
            params: params
        }, callback, errorCallback);
    };

    // Return the details of the supplied device
    //
    // https://m2x.att.com/developer/documentation/v2/device#View-Device-Details
    Devices.prototype.view = function(id, callback, errorCallback) {
        return this.client.get(helpers.url("/devices/{0}", id), callback, errorCallback);
    };

    // Return the current location of the supplied device
    //
    // Note that this method can return an empty value (response status
    // of 204) if the device has no location defined.
    //
    // https://m2x.att.com/developer/documentation/v2/device#Read-Device-Location
    Devices.prototype.location = function(id, callback, errorCallback) {
        return this.client.get(helpers.url("/devices/{0}/location", id), callback, errorCallback);
    };

    // Update the current location of the device
    //
    // https://m2x.att.com/developer/documentation/v2/device#Update-Device-Location
    Devices.prototype.updateLocation = function(id, params, callback, errorCallback) {
        return this.client.put(
            helpers.url("/devices/{0}/location", id),
            { params: params },
            callback, errorCallback
        );
    };

    // Return a list of the associated streams for the supplied device
    //
    // https://m2x.att.com/developer/documentation/v2/device#List-Data-Streams
    Devices.prototype.streams = function(id, callback, errorCallback) {
        return this.client.get(helpers.url("/devices/{0}/streams", id), callback, errorCallback);
    };

    // Update stream's properties
    //
    // If the stream doesn't exist it will create it. See
    // https://m2x.att.com/developer/documentation/device#Create-Update-Data-Stream
    // for details.
    //
    // https://m2x.att.com/developer/documentation/v2/device#Create-Update-Data-Stream
    Devices.prototype.updateStream = function(id, name, params, callback, errorCallback) {
        return this.client.put(
            helpers.url("/devices/{0}/streams/{1}", id, name),
            { params: params },
            callback, errorCallback
        );
    };

    // Set the stream value
    //
    // https://m2x.att.com/developer/documentation/v2/device#Update-Data-Stream-Value
    Devices.prototype.setStreamValue = function(id, name, params, callback, errorCallback) {
        return this.client.put(
            helpers.url("/devices/{0}/streams/{1}/value", id, name),
            { params: params },
            callback, errorCallback
        );
    };

    // Return the details of the supplied stream
    //
    // https://m2x.att.com/developer/documentation/v2/device#View-Data-Stream
    Devices.prototype.stream = function(id, name, callback, errorCallback) {
        return this.client.get(
            helpers.url("/devices/{0}/streams/{1}", id, name),
            callback, errorCallback
        );
    };

    // List values from an existing data stream associated with a
    // specific device, sorted in reverse chronological order (most
    // recent values first).
    //
    // https://m2x.att.com/developer/documentation/v2/device#List-Data-Stream-Values
    Devices.prototype.streamValues = function(id, name, params, callback, errorCallback) {
        var url = helpers.url("/devices/{0}/streams/{1}/values", id, name);

        if (typeof params === "function") {
            errorCallback = callback;
            callback = params;
            params = {};
        }

        return this.client.get(url, { qs: params }, callback, errorCallback);
    };

    // Sample values from an existing stream
    //
    // https://m2x.att.com/developer/documentation/v2/device#Data-Stream-Sampling
    Devices.prototype.sampleStreamValues = function(id, name, params, callback, errorCallback) {
        return this.client.get(
            helpers.url("/devices/{0}/streams/{1}/sampling", id, name),
            { qs: params },
            callback, errorCallback
        );
    };

    // Return the stream stats
    //
    // https://m2x.att.com/developer/documentation/v2/device#Data-Stream-Stats
    Devices.prototype.streamStats = function(id, name, params, callback, errorCallback) {
        return this.client.get(
            helpers.url("/devices/{0}/streams/{1}/stats", id, name),
            { qs: params },
            callback, errorCallback
        );
    };

    // Post timestamped values to an existing stream
    //
    // https://m2x.att.com/developer/documentation/v2/device#Post-Data-Stream-Values
    Devices.prototype.postValues = function(id, name, values, callback, errorCallback) {
        return this.client.post(
            helpers.url("/devices/{0}/streams/{1}/values", id, name),
            { params: { values: values } },
            callback, errorCallback
        );
    };

    // Delete values from a stream by a date range
    //
    // https://m2x.att.com/developer/documentation/v2/device#Delete-Data-Stream-Values
    Devices.prototype.deleteStreamValues = function(id, name, params, callback, errorCallback) {
        return this.del(
            helpers.url("/devices/{0}/streams/{1}/values", id, name),
            { params: params },
            callback, errorCallback
        );
    };

    // Delete the stream (and all its values) from the device
    //
    // https://m2x.att.com/developer/documentation/v2/device#Delete-Data-Stream
    Devices.prototype.deleteStream = function(id, name, callback, errorCallback) {
        return this.client.del(helpers.url("/devices/{0}/streams/{1}", id, name), callback, errorCallback);
    };

    // Post multiple values to multiple streams
    //
    // This method allows posting multiple values to multiple streams
    // belonging to a device. All the streams should be created before
    // posting values using this method.
    //
    // https://m2x.att.com/developer/documentation/v2/device#Post-Device-Updates--Multiple-Values-to-Multiple-Streams-
    Devices.prototype.postMultiple = function(id, values, callback, errorCallback) {
        return this.client.post(helpers.url("/devices/{0}/updates", id), {
            headers: { "Content-Type": "application/json" },
            params: { values: values }
        }, callback, errorCallback);
    };

    // Retrieve list of triggers associated with the specified device.
    //
    // https://m2x.att.com/developer/documentation/v2/device#List-Triggers
    Devices.prototype.triggers = function(id, callback, errorCallback) {
        return this.client.get(helpers.url("/devices/{0}/triggers", id), callback, errorCallback);
    };

    // Create a new trigger associated with the specified device.
    //
    // https://m2x.att.com/developer/documentation/v2/device#Create-Trigger
    Devices.prototype.createTrigger = function(id, params, callback, errorCallback) {
        return this.client.post(helpers.url("/devices/{0}/triggers", id), {
            params: params
        }, callback, errorCallback);
    };

    // Get details of a specific trigger associated with an existing device.
    //
    // https://m2x.att.com/developer/documentation/v2/device#View-Trigger
    Devices.prototype.trigger = function(id, triggerID, callback, errorCallback) {
        return this.client.get(
            helpers.url("/devices/{0}/triggers/{1}", id, triggerID),
            callback, errorCallback
        );
    };

    // Update an existing trigger associated with the specified device.
    //
    // https://m2x.att.com/developer/documentation/v2/device#Update-Trigger
    Devices.prototype.updateTrigger = function(id, triggerID, params, callback, errorCallback) {
        return this.client.put(
            helpers.url("/devices/{0}/triggers/{1}", id, triggerID),
            { params: params },
            callback, errorCallback
        );
    };

    // Test the specified trigger by firing it with a fake value.
    //
    // This method can be used by developers of client applications
    // to test the way their apps receive and handle M2X notifications.
    //
    // https://m2x.att.com/developer/documentation/v2/device#Test-Trigger
    Devices.prototype.testTrigger = function(id, triggerName, callback, errorCallback) {
        return this.client.post(
            helpers.url("/devices/{0}/triggers/{1}", id, triggerName),
            callback, errorCallback
        );
    };

    // Delete an existing trigger associated with a specific device.
    //
    // https://m2x.att.com/developer/documentation/v2/device#Delete-Trigger
    Devices.prototype.deleteTrigger = function(id, triggerID, callback, errorCallback) {
        return this.client.del(
            helpers.url("/devices/{0}/triggers/{1}", id, triggerID),
            callback, errorCallback
        );
    };

    // Return a list of access log to the supplied device
    //
    // https://m2x.att.com/developer/documentation/v2/device#View-Request-Log
    Devices.prototype.log = function(id, callback, errorCallback) {
        return this.client.get(helpers.url("/devices/{0}/log", id), callback, errorCallback);
    };

    // Delete an existing device
    //
    // https://m2x.att.com/developer/documentation/v2/device#Delete-Device
    Devices.prototype.deleteDevice = function(id, callback, errorCallback) {
        return this.del(helpers.url("/devices/{0}", id), callback, errorCallback);
    };

    // Returns a list of API keys associated with the device
    Devices.prototype.keys = function(id, callback, errorCallback) {
        return this.client.get("/keys", { qs: { device: id } }, callback, errorCallback);
    };

    // Creates a new API key associated to the device
    //
    // If a parameter named `stream` is supplied with a stream name, it
    // will create an API key associated with that stream only.
    Devices.prototype.createKey = function(id, params, callback, errorCallback) {
        this.keysAPI.create(helpers.extend(params, { device: id }), callback, errorCallback);
    };

    // Updates an API key properties
    Devices.prototype.updateKey = function(id, key, params, callback, errorCallback) {
        this.keysAPI.update(key, helpers.extend(params, { device: id }), callback, errorCallback);
    };

    return Devices;
});
