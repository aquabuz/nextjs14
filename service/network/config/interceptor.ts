import { Instance, ApiError } from "./types";

const interceptor = (instance: Instance) => {
  instance.interceptors.request.use(
    (config) => {
      console.log(
        "↖︎ REQUEST( " +
          config.method?.toUpperCase() +
          " " +
          config.url +
          " ) %o",
        config.data
      );
      // console.log(config.data);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      console.log(
        "↘︎ RESPONSE( " +
          res.config.method?.toUpperCase() +
          " " +
          res.config.url +
          " ) %o",
        res.data
      );
      return res;
    },
    (error) => {
      console.log("↘︎ RESPONSE ERROR( " + error.config.url + " ) %o", error);
      // const errorMsg = {
      //   status: error.status,
      //   message: `${error.status} ${error.message}`,
      // };
      return Promise.reject<ApiError>(error);
    }
  );
};

export default interceptor;
