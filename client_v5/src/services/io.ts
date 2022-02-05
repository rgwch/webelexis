import cfg from '../services/properties'
import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import auth from '@feathersjs/authentication-client';

const socket = io(cfg.server)
const app = feathers()
app.configure(feathers.socketio(socket))
app.configure(auth({ storage: window.localStorage }))

export type ServiceType = "patient" | "termin" | "fall" | "stickers" | "user" | "kontakt"
  | "admin" | "konsultation" | "invoice" | "billing" | "billable"
export const getService = (name: ServiceType) => app.service(name)

export const login = async (username?: string, password?: string) => {
  try {
    let jwt
    if (username && password) {
      jwt = await app.authenticate({
        id: username, password,
        strategy: "local"
      })
    } else {
      jwt = await app.authenticate()
    }
    const verified = await app["passport"].verifyJWT(jwt?.accessToken)
    const user = await app.service("user").get(verified.userId)
  } catch (err) {
    return undefined
  }
}

if (true) {
  login("gerry", "pxgerry")
}
