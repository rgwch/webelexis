import {InternalUser} from "../models/user";


export class Authenticator {
  private predefinedRoles

  constructor() {
    let roles = require('nconf').get('roles')
    if (!roles) {
      roles = {
        "mpa": ["patient-list", "patient-read", "encounter-list", "encounter-read", "flag-list", "flag-read", "appoinment-list",
          "appointment-write", "slot-list", "slot-read", "schedule-list", "schedule-read",
          "condition-read", "condition-list", "medication-order-list", "medicationorder-read"],

        "doctor": ["patient-write", "encounter-write", "flag-write",
          "appointment-write", "slot-list", "slot-read", "schedule-list", "schedule-read", "condition-write",
          "medication-order-write"],

        "manager": ["slot-write", "schedule-write"],

        "visitor": [],

        "patient": ["self-read", "appointment-read", "appointment-set"]
      }
    }
    this.predefinedRoles = roles
  }

  public authenticate(req, res, next) {
    let sid = req.get("X-sid")
    if (!sid) {
      res.sendStatus(400)
    } else {
      let user = InternalUser.isLoggedIn(sid)
      if (!user) {
        res.sendStatus(401)
      } else {
        req.user = user
        next()
      }
    }
  }

  public checkRole(roles, type, access) {

    return roles.some(role => {
      if (role === 'admin') {
        return true
      }
      let privileges = this.predefinedRoles[role]
      if (privileges) {
        let privname = type.toLowerCase() + "-"
        return privileges.some(priv => {
          if (access === "read") {
            return priv.startsWith(privname)
          } else if (access === "write") {
            return priv === privname + "write"
          } else if (access === "list") {
            return priv === privname + "list"
          } else {
            return false
          }
        })
      } else {
        return false
      }
    })
  }

}