export default class GateWayStore {
  constructor() {
    this.route = {
      DownstreamPathTemplate: "",
      DownstreamScheme: "",
      DownstreamHostAndPorts: [
        {
          Host: "",
          Port: 80
        }
      ],
      UpstreamPathTemplate: "",
      UpstreamHttpMethod: [],
      QoSOptions: {
        ExceptionsAllowedBeforeBreaking: 3,
        DurationOfBreak: 10,
        TimeoutValue: 5000
      },
      AppId: "",
      Key: ""
    };

    this.authenticationOptions = {
      AuthenticationProviderKey: "id3",
      AllowedScopes: [
        "openid",
        "offline_access",
        "profile",
        "authenticationAPI"
      ]
    };
  }
  getRoute(row) {
    if (row instanceof Object) {
      var url = new URL(row.Url);
      this.route.DownstreamPathTemplate = url.pathname
        .replace("%7B", "{")
        .replace("%7D", "}");
      this.route.DownstreamScheme = url.protocol.replace(":", "");
      this.route.DownstreamHostAndPorts[0].Host = url.hostname;
      this.route.DownstreamHostAndPorts[0].Port =
        url.port === "" ? 80 : url.port;
      this.route.UpstreamPathTemplate = row.UpstreamPathTemplate;
      this.route.UpstreamHttpMethod = row.UpstreamHttpMethod;
      this.route.Key = `${row.AppId}_${row.KeyId}`;
      this.route.AppId = row.AppId;
      if (row.AuthenticationOptions === "是") {
        this.route.AuthenticationOptions = this.authenticationOptions;
      }
      return this.route;
    } else {
      return null;
    }
  }
  upDate(row) {
    if (row instanceof Object) {
      var dataRow = new Object();
      var url = new URL(row.Url);
      var hostAndPort = [];
      var writer = {
        Host: url.hostname,
        Port: url.port === "" ? 80 : url.port
      };
      hostAndPort[0] = writer;
      dataRow.Index = row.Index;
      dataRow.AppId = row.AppId;
      dataRow.Key = row.KeyId;
      dataRow.DownstreamScheme = url.protocol.replace(":", "");
      dataRow.UpstreamPathTemplate = row.UpstreamPathTemplate;
      dataRow.UpstreamHttpMethod = row.UpstreamHttpMethod;
      dataRow.QoSOptions = this.route.QoSOptions;
      dataRow.DownstreamHostAndPorts = hostAndPort;
      dataRow.DownstreamPathTemplate = url.pathname
        .replace("%7B", "{")
        .replace("%7D", "}");
      if (row.AuthenticationOptions === "是") {
        dataRow.AuthenticationOptions = this.authenticationOptions;
      } else {
        delete dataRow["AuthenticationOptions"];
      }
      return dataRow;
    } else {
      return null;
    }
  }
}
