import { history } from "helpers";
import { Toast } from "./toast";

export const axiosErrorHandler = (error, action, checkUnauthorized = true) => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("meetId");

  const requestStatus = error?.request?.status;
  const responseStatus = error?.response?.status;
  const dataStatus = error?.response?.data?.status;

  if (dataStatus === 401 || responseStatus === 401 || requestStatus === 401) {
    localStorage.clear();
    history.push("/");
  }
  if (dataStatus === 400 || responseStatus === 400 || requestStatus === 400) {
    //if (localStorage.getItem("token")) {
    Toast({
      type: "error",
      message: error?.response?.data?.data || error?.response?.data?.message,
    });
    // }
  }
  if (
    checkUnauthorized &&
    (dataStatus === 409 || responseStatus === 409 || requestStatus === 409)
  ) {
    if (localStorage.getItem("token")) {
      Toast({ type: "error", message: error?.response?.data?.message });
    }
  }
  if (action === "VideoCall") {
    
    if (dataStatus === 409 || responseStatus === 409 || requestStatus === 409) {
      history.push(`/consult/video-consult?meetCode=${code}`);
      window.location.reload();
      //alert("success");
    }
  }

  if (action === "uploadImage") {
    if (dataStatus === 500 || responseStatus === 500 || requestStatus === 500) {
      if (localStorage.getItem("token")) {
        const message = error?.response?.data?.message;
        message && Toast({ type: "error", message });
      } else history.push("/");
    }
  }

  if (error.response) return error.response;
  else if (error.request) return error.request;
  else return error.message;
};
