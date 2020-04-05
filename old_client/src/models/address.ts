/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

export interface AddressType {
  use: "home" | "work" | "other";
  street: string;
  zip: string;
  city: string;
}
