/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2016-2018 by G. Weirich.
 * All rights reserved.
 ***************************************/

/**
 * Access control system:
 * - Every resource is protected by a number of Access Control Elements (ACE). There are distinct ACEs for
 * reading, writing, updating and deleting such a resource.
 *
 * - Every ACE has a parent ACE or ist the root Element.
 *
 * - Every user has one or more roles. At least they have the role `roles.guest`.
 *
 * - Every role has zero or more ACEs.
 *
 * - If a user wants to access a resource method, they must have the corresponding ACE (e.g. konktakt.find).
 *  They have an ACE, if one of their roles has this ACE or a parent (or grandparent and so on) of this ACE.
 *
 * - A user who is member of the group `roles.admin` implicitely has all ACEs (i,e, has the ACE "root"
 *  which is by convention ancestor of all other ACEs).
 *
 * Roles are installation specific and therefore are defined in config/roles.js
 */

const acls = new Map()
const roles = require('../../config/roles')
const logger = require('../logger')
const mapper = require('../../config/aclmapper')

class ACE {
  constructor(name, parent) {
    this.name = name
    this.parent = parent
    if (this.parent) {
      this.fullname = this.parent.fullname + "." + this.name
    } else {
      this.fullname = name
    }
  }
}

const declareACE = (ace) => {
  if (Array.isArray(ace)) {
    for (const a of ace) {
      declareACE(a)
    }
  } else {
    acls.set(ace.name, ace)
  }
}

const hasRight = (usr, acename) => {
  if (!usr) {
    usr = {
      roles: [roles.guest]
    }
  }
  if (!acename) {
    return true
  }
  if (usr.roles.find(r => r == roles.admin)) {
    return true
  }
  const ace = acls.get(acename)
  if (!ace) {
    return true
  }
  for (const role of usr.roles) {
    const acl = mapper[role]
    if (acl && acl.find(r => r == ace.name)) {
      return true
    }
    if (ace.parent && hasRight(usr, ace.parent.name)){
      return true;
    }
  }
  return false
}
const needsRight = (usr, ace) => {
  if (!hasRight(usr, ace)) {
    logger.warn("%s has insufficient rights for %s", usr, ace)
    throw new Error("insufficient rights")
  }
}

module.exports = {
  ACE,
  declareACE,
  hasRight,
  needsRight
}
