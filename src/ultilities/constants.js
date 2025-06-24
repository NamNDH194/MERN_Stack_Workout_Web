let apiRoot = "";
if (process.env.REACT_APP_BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}
if (process.env.REACT_APP_BUILD_MODE === "production") {
  apiRoot = "https://trello-api-hxmr.onrender.com";
}
// export const API_ROOT = "http://localhost:8017";
export const API_ROOT = apiRoot;
