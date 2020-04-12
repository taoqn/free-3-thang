import { _URL_PREFIX, _CSRF_KEY, _CSRF_META } from "./constants";
import { openLoading, closeLoading } from "./loading";
import { getContentMetaTag } from "./util";

const exportConfigsFetch = (method, body) => {
  let configs = {
    method: method,
    credentials: "same-origin", // <-- includes cookies in the request
    headers: {
      Accept: "application/json",
    },
  };
  if (method !== "GET") {
    if (method === "POST" || method === "PUT") {
      configs["body"] = body;
      configs.headers["Content-Type"] = "application/json";
    }
    if (process.env.NODE_ENV === "production") {
      // Read the CSRF token from the <meta> tag
      configs.headers[_CSRF_KEY] = getContentMetaTag(_CSRF_META);
    }
  }
  return configs;
};

const exportFetch = (prefix, url, method, body) => {
  if (method !== "GET") {
    openLoading();
  }
  return fetch(`${prefix}${url}`, exportConfigsFetch(method, body))
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    })
    .catch((error) => {
      try {
        error.json().then((err) => console.log(err.message));
      } catch {}
      return Promise.reject(error);
    })
    .finally(() => method !== "GET" && closeLoading());
};

// Make a request using the Fetch API
export function FetchMapping(url, method = "GET") {
  return exportFetch("", url, method);
}
export function GetMappingPublic(url) {
  return exportFetch(_URL_PREFIX, url, "GET");
}
export function GetMappingAuthorization(url) {
  return exportFetch(_URL_PREFIX, url, "GET");
}
export function PostMappingPublic(url, body) {
  return exportFetch(_URL_PREFIX, url, "POST", body);
}
export function PostMappingAuthorization(url, body) {
  return exportFetch(_URL_PREFIX, url, "POST", body);
}
export function PutMappingAuthorization(url, body) {
  return exportFetch(_URL_PREFIX, url, "PUT", body);
}
export function DeleteMappingAuthorization(url) {
  return exportFetch(_URL_PREFIX, url, "DELETE");
}
