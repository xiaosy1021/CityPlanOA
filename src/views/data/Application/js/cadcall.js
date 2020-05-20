var CadCallCalss = function () {
    var pluginId = "knldjmfmopnpolahpmmgbagdohdnhkik";
    this.pluginId = function () {
        return pluginId;
    };
    this.attach = function (cadFile, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "attach --file \"" + cadFile + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.attachRemote = function (curl, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "attach --curl \"" + curl.replace(/\"/g, "\\\"") + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.open = function (cadFile, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "open --file \"" + cadFile + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.openRemote = function (curl, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "open --curl \"" + curl.replace(/\"/g, "\\\"") + "\""
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
            throw "input must be a wkt or an array of wkt"
        }

        chrome.runtime.sendMessage(pluginId, {
            command: "write --wkts \"" + wktString + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.drawGeoJson = function (geoJson, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "write --geojson \"" + geoJson.replace(/\"/g, "\\\"") + "\""
        }, function (response) {
            if (callback)
                callback(response);
        });
    };
    this.sendCommand = function (commandString, callback) {
        chrome.runtime.sendMessage(pluginId, {
            command: "keyin " + commandString
        }, function (response) {
            console.log("message received from background: ");
            console.log(response);

            if (callback)
                callback(response);
        });
    };
};

export const cadcall = new CadCallCalss();