/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const validators = new Map()

export const initialize = (name, fields) => {
  validators[name] = fields
}

export const validate = (object, name, doThrow) => {
  const template = validators[name]
  if (!template) {
    throw new Error('Validator: invalid template ')
  }
  for (const prop in object) {
    if (!template[prop]) {
      delete object[prop]
      if (doThrow) {
        throw new Error('invalid object ' + object)
      }
    }
  }
  return object
}
