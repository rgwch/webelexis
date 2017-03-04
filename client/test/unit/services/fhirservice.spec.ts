import {FhirService} from 'src/services/fhirservice'
import {Container} from 'aurelia-framework'
import {FHIRobject} from "src/models/fhirobj";
import {FHIR_Resource, FHIR_Patient} from "../../../../common/models/fhir";

describe('FhirService', () => {
  let container;
  let fhirs:FhirService

  beforeEach(() => {
    container = Container.instance
    fhirs = container.get(FhirService)
  })

  describe('get', () => {
    it('loads an Object', (done)=> {
      fhirs.getById("Patient", "detail").then(result => {
        expect(result.resourceType).toBe("Patient")
        done()
      })
    })
  })

  describe('update', () => {
    it('loads and modifies an object', (done)=> {
      fhirs.getById("Patient", "7ba4632caba62c5b3a366").then(res => {
        let result=res as FHIR_Patient
        expect(result.birthDate).not.toBe("2000-01-01")
        result.birthDate = "2000-01-01"
        fhirs.update(result).then(updateResult=> {
          fhirs.getById("Patient","7ba4632caba62c5b3a366").then(endResult =>{
            expect((<FHIR_Patient>endResult).birthDate).toBe("2000-01-01")
            done()
          })
        })
      })
    })
  })

  describe('create',() =>{
    it('creates an object',(done)=>{
      fhirs.create("Patient").then(result =>{
        let id=result.id
        fhirs.getById("Patient",id).then(created =>{
          expect(created.resourceType).toBe("Patient")
          expect(created.id).toBeDefined()
          done()
        })
      })
    })
  })
})