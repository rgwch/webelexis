/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const assert = require('assert');
const app = require('../../dist/app');
const path=require('path')
const fs=require('fs')

xdescribe('\'createpdf\' service', () => {
  const service = app.service('createpdf');
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  it('converts a simple html',async ()=>{
    const filename=path.join(__dirname,"../sample_html.html")
    const file=fs.readFileSync(filename)
    const pdf=await service.create({id: "1", html: file.toString("utf-8")})
    fs.writeFileSync(path.join(__dirname,"../sample_html.pdf"),pdf)
    pdf.should.be.ok
  })
});
