import { Subject } from "rxjs";
import { ReactSession } from "react-client-session";

/** Single service that provides observable to session
 * The perpose of this class is to notify other components when user has logged in
 */
export class SessionService {
  static instance = null;

  constructor() {
    if (SessionService.instance) {
      return SessionService.instance;
    }
    SessionService.instance = this;
    this.sessionSubject = new Subject();
  }

  getSessionObservable() {
    return this.sessionSubject.asObservable();
  }

  updateSession() {
    // getting the session information from the backend
    fetch("/api/users/getsession")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        ReactSession.set("username", data[0]);
        ReactSession.set("is_admin", data[1]);
        this.sessionSubject.next(data);

        fetch("/api/users/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            username: data[0],
            is_admin: data[1],
          }),
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
}
