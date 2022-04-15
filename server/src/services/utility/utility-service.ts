/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
import { Utility } from './utility-service.class'

export default function (app) {
  const paginate = app.get('paginate');

  const options = {
    app,
    paginate
  };

  app.use("/utility", new Utility(options))
}
