import axios from "axios";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// response interceptor
instance.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    console.log(
      "graphql.response.error:",
      error.response.status,
      error.response.data.message || error.response.statusText || error.message,
    );
    // if (error.response.status === 401) {
    //   const localObj = LoadJsonFromLocalStorage('wallet'); // name from `@/stores/wallet.ts`
    //   if (localObj && localObj.state.hasLogin) {
    //     localObj.state.hasLogin = false;
    //     localObj.state.authToken = '';
    //     localObj.state.userInfo = undefined;
    //     localStorage.setItem('wallet', JSON.stringify(localObj));
    //     window.location.href = '/';
    //   }
    // }
    return Promise.reject(
      error.response.data.message || error.response.statusText || error.message,
    );
  },
);

export const FetchData = async (
  endpoint: string,
  data?: any,
  config?: any,
): Promise<any> => {
  return instance.post(endpoint, data, config);
};

export const MAX_PAGE_SIZE = 1000;

export const BLOCK_LATEST = "latest";
