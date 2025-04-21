import Cookies from "js-cookie";

export function getSession() {
  const session = Cookies.get("session-token");
  if (!session) {
    return null;
  }
  return { session };
}

export function storeSession(session: string) {
  Cookies.set("session-token", session, {
    path: "/",
    sameSite: "strict",
    expires: 7, // Set an expiration date for better security
  });
}
