import {FHIRobject, FhirObjectFactory} from "./fhirobj";
import {FHIR_Resource} from "./fhir";

export class DocumentReferenceFactory implements FhirObjectFactory{
  entities=["query","title"]
  subtype="DocumentReference"

  createObject(fhir): FHIRobject {
    return new DocumentReference(fhir);
  }

}
export class DocumentReference extends FHIRobject{

  constructor(data:FHIR_Resource){
    super(data,"DocumentReference")
  }

}