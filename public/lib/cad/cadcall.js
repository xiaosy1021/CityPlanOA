var CadCallCalss = function () {
    var pluginId = "kehihbmclfnghbopphaofoenbeeljcpf";
    this.pluginId = function () {
        return pluginId;
    };
    this.attach = function (cadFile, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "-c attach -f \"" + cadFile + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.attachRemote = function (curl, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "-c attach -u \"" + curl.replace(/\"/g, "\\\"") + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.open = function (cadFile, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "-c open -f \"" + cadFile + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.openRemote = function (curl, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "-c open -u \"" + curl.replace(/\"/g, "\\\"") + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.drawWkt = function (wkt, callback) {
        var wktString = ""
        if (typeof wkt === "array") {
            wktString = wkt.join("\n")
        } if (typeof wkt === "string") {
            wktString = wkt
        }
        else {
            throw "input must be a wkt string or an array of wkt string"
        }

        chrome.runtime.sendMessage(pluginId, {
            command: "-c draw -w \"" + wktString + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.drawGeoJson = function (geoJson, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "-c draw -j \"" + geoJson.replace(/\"/g, "\\\"") + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.sendCommand = function (commandString, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: commandString
        }, function (response) {
            console.log("message received from background: ");
            console.log(response);

            if (callback)
                callback(response);
        });
    };
};

var cadcall = new CadCallCalss();