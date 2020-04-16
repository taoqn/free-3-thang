var axios = require("axios");
// const http = require('http');
// const https = require('https');

var callApi = (host, url, method, data, token) => {
  var configs = {
    method: method,
    timeout: 10000,
    url: host + url
  };
  if (data) {
    configs.data = data;
  }
  if (token) {
    configs.headers = {
      Authorization: "Bearer " + token
    };
  }
  if (process.env.NODE_ENV === "production") {
    console.info(`[API][${new Date().toISOString()}][${method}] ${host}${url}`);
  }
  // console.info(`=> ${method} ${host}${url}`);
  return axios(configs);
};

module.exports = {
  // GET
  getJSON: (host, url, token) => callApi(host, url, "GET", null, token),
  // POST
  postJSON: (host, url, data, token) => callApi(host, url, "POST", data, token),
  // PUT
  putJSON: (host, url, data, token) => callApi(host, url, "PUT", data, token),
  // DELETE
  deleteJSON: (host, url, token) => callApi(host, url, "DELETE", null, token)
};
