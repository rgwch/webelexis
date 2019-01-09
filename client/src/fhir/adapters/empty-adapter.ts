import { IFhirAdapter } from "fhir/fhir-api";

export class EmptyAdapter implements IFhirAdapter{
  toElexisObject(fhir: any) {
    throw new Error("Method not implemented.");
  }  
  toFhirObject(obj: import("/media/gerry/ext/dev/webelexis/webelexis/client/src/models/elexistype").ElexisType) {
    throw new Error("Method not implemented.");
  }
  toQueryResult(bundle: import("/media/gerry/ext/dev/webelexis/webelexis/client/src/fhir/model/fhir").FhirBundle) {
    throw new Error("Method not implemented.");
  }


}
