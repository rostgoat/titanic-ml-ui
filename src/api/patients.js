import request from '../utils/request'

export const patients = (params) => {
    return request({
      url: "/patients/find",
      method: "get",
      params
    });
  };