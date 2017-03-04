/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import {expect} from 'chai'
import {Patient} from '../models/patient'
import {DummySql} from "./dummy_sql";
import {FHIR_Resource,FHIR_Identifier} from '../../common/models/fhir'
import {FhirObject} from "../models/fhirobject";
import {DummyDB} from "./dummy_nosql"

@suite("patient")
class PatientTest {
  private _dummyPatient = {
    "resourceType": "Patient",
    "id": "7ba4632caba62c5b3a366",
    "identifier": <Array<FHIR_Identifier>>[
      {
        "use": "official",
        "system": "www.ahv.ch/xid",
        "value": "123.45.678"
      },
      {
        "use": "usual",
        "system": "www.elexis.ch/xid",
        "value": "7ba4632caba62c5b3a366"
      },
      {
        "use": "local",
        "system": "www.elexis.info/patnr",
        "value": "312"
      }
    ],
    "name": [
      {
        "use": "official",
        "family": [
          "Testperson"
        ],
        "given": [
          "Armeswesen"
        ]
      }
    ],
    "telecom": [
      {
        "system": "phone",
        "value": "555-122 34 56",
        "use": "home"
      },
      {
        "system": "phone",
        "value": "055 555 55 55",
        "use": "work"
      },
      {
        "system": "email",
        "value": "testperson@elexis.ch",
        "use": "all"
      }
    ],
    "gender": "female",
    "birthDate": "1950-02-01",
    "address": [
      {
        "use": "home",
        "type": "both",
        "line": [
          "Hintere Gasse 287"
        ],
        "city": "Webelexikon",
        "postalCode": "8999"
      },
      {
        "use": "work",
        "type": "postal",
        "line": ["Postfach", "Alte Grube 2"],
        "postalCode": "9999",
        "city": "Elexikon"
      }
    ]
  }


  @test("construct sql string")
  make_sql() {
    //console.log(FhirObject.makeSQLString("kontakt", Patient.concerned_fields))
  }

  @test("create insert sql query-string")
  create_insert(done) {
    let patient = new Patient(new DummySql(), new DummyDB(this._dummyPatient, []))
    patient.pushSQL(this._dummyPatient).then(result=> {
      patient.fetchSQL({"id": this._dummyPatient.id}).then(result=> {
        expect(result).to.be.an('Array')
        let pat = result[0]
        let id0 = pat.id
        let id1 = this._dummyPatient.id
        expect(id0).to.equal(id1)
        done()
      })
    }).catch(err=> {
      console.log(err)
    })
  }
}