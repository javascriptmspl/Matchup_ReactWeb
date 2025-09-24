export const getKey = () => {
  const datingId = localStorage.getItem("userData");
  const dattingObj = datingId ? JSON.parse(datingId) : null;

  if (dattingObj?.data?.mode === "68d103ffaa4b176726e60424") {
    return "metrimonial";
  } else if (dattingObj?.data?.mode === "68d103d5aa4b176726e60421") {
    return "dating";
  } else {
    return "dating";
  }
};

export const Mode = () => {
  const user = localStorage.getItem("userData");
  const users = user ? JSON.parse(user) : null;
  const mode = users?.data?.mode || "68d103d5aa4b176726e60421";
  return mode;
};

// export mode
export const modeId = Mode();
export const MODE_METRI = "68d103ffaa4b176726e60424";
export const MODE_DATING = "68d103d5aa4b176726e60421";

// EXPORT USER FROM LOCAL STORAGE
export const LOCAL_USER_GENDER = () => {
  const user = localStorage.getItem("userData");
  const users = user ? JSON.parse(user) : null;
  return users?.data?.iAm;
};
export const LOCAL_USER_GENDER_METRI = () => {
  const user = localStorage.getItem("userData");
  const users = user ? JSON.parse(user) : null;
  return users?.data?.iAm;
};

// export curuent user
export const CURRENT_LOGIN_USER = () => {
  const user = localStorage.getItem("userData");
  const users = user ? JSON.parse(user) : null;
  return users?.data?._id;
};

export const USER_ID_LOGGEDIN = CURRENT_LOGIN_USER();
