import Cookies from "js-cookie";

export const storeSession = (token: string, userType: "user" | "pharmacy") => {
  const sessionData = {
    session: token,
    userType,
  };
  Cookies.set("session-token", JSON.stringify(sessionData));
};

export const getSession = () => {
  const session = Cookies.get("session-token");
  if (session) {
    return JSON.parse(session);
  }
  return null;
};
