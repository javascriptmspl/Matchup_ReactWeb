export const getKey = () => {
  const datingId = localStorage.getItem("userData");
  const dattingObj = JSON.parse(datingId);
 
  if (dattingObj?.data?.mode=== "68ad61f71130f0d24d4aff04") {
    return "metrimonial";
  } else if (dattingObj?.data?.mode=== "68ad621a1130f0d24d4aff06") {
    return "dating";
  } else {
    return "dating";
  }
};

export const Mode = () => {
  const user = localStorage.getItem("userData");
  const users = JSON.parse(user);
  const mode = users?.data?.mode || "68ad621a1130f0d24d4aff06";
  return mode;
};

// export mode
export const modeId = Mode();
export const MODE_METRI = "68ad61f71130f0d24d4aff04";
export const MODE_DATING = "68ad621a1130f0d24d4aff06";

// EXPORT USER FROM LOCAL STORAGE
export const LOCAL_USER_GENDER = () => {
  const user = localStorage.getItem("userData");
  const users = JSON.parse(user);
  return users?.data?.iAm;
};
export const LOCAL_USER_GENDER_METRI = () => {
  const user = localStorage.getItem("userData");
  const users = JSON.parse(user);
  return users?.data?.iAm;
};

// export curuent user
export const CURRENT_LOGIN_USER = () => {
  const user = localStorage.getItem("userData");
  const users = JSON.parse(user);
  return users?.data?._id;
};

export const USER_ID_LOGGEDIN = CURRENT_LOGIN_USER();
