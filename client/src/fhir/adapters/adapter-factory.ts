import { PatientAdapter } from "./patient-adapter";

export class AdapterFactory{
  public static create(datatype: string){
    switch(datatype){
      case "Patient": return new PatientAdapter()
    }
  }
}

