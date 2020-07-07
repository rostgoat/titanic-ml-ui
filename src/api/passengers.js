import request from '../utils/request'

export const passengers = (params) => {
    return request({
      url: "/passengers/find",
      method: "get",
      params
    });
  };