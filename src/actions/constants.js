// Server URL
export const _URL = `${process.env.REACT_APP_SERVER_WEB}`;
export const _PREFIX = `${process.env.REACT_APP_SERVER_PREFIX}`;
export const _URL_PREFIX = `${_URL}${_PREFIX}`;
export const _API_URL = `${process.env.REACT_APP_SERVER_API}`;

// CSRF
export const _CSRF_KEY = "CSRF-Token";
export const _CSRF_META = "csrf-token";

// Roles
export const _ADMIN = "admin";
export const _PARTNER = "partner";
export const _USER = "user";

//cookie jwt
// Keys
export const _URL_ADD = "/add";
export const _URL_EDIT = "/update";
export const _URL_DELETE = "/delete";

export const PREFIX_ACCOUNT_URL = "/account";
export const PREFIX_CATEGORY_URL = "/category";
export const PREFIX_ONLINE_URL = "/online";
export const PREFIX_PARTNER_URL = "/partner";
export const PREFIX_UPLOAD_URL = "/upload";

export const PREFIX_API_URL = "/api";
export const AUTH_API_URL = PREFIX_API_URL + "/auth";
export const PUBLIC_API_URL = PREFIX_API_URL + "/public";

export const UPLOAD_API_URL = PUBLIC_API_URL + "/upload";
export const UPLOAD_AUTH_API_URL = AUTH_API_URL + "/upload";

export const ADMIN_API_URL = `${AUTH_API_URL}/${_ADMIN}`;
export const PARTNER_API_URL = `${AUTH_API_URL}/${_PARTNER}`;
export const USER_API_URL = `${AUTH_API_URL}/${_USER}`;

export const CATEGORY_API_URL = PUBLIC_API_URL + "/category";
export const CATEGORY_AUTH_API_URL = AUTH_API_URL + "/category";
export const CATEGORY_ADMIN_API_URL = ADMIN_API_URL + "/category";
