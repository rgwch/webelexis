import {FhirObject} from "./fhirobject";
import {Refiner} from "./fhirsync";
import {FHIR_Resource} from "../common/models/fhir";
import {NoSQL} from "../services/mongo";
import {SQL} from "../services/mysql";
import {LucindaService} from "../services/lucinda-service";


export class DocumentReference extends FhirObject implements Refiner {
  dataType: string;
  lucindaService: LucindaService

  constructor(sql: SQL, nosql: NoSQL) {
    super(sql, nosql)
    this.lucindaService = new LucindaService()
  }

  compare(a: FHIR_Resource, b: FHIR_Resource): number {
    return 0;
  }

  async fetchSQL(params: {}): Promise<Array<FHIR_Resource>> {
    return [];
  }

  async fetchNoSQL(params: any): Promise<Array<FHIR_Resource>> {
    if (params.id) {
      let doc: Buffer = await this.lucindaService.getDocument(params.id)
      if (doc) {
        return [{
          resourceType: "DocumentReference",
          id: params.id,
          content: [{
            attachment: {
              contentType: "application/pdf",
              data: doc.toString('base64'),
              size: doc.length
            }
          }]
        }]
      } else {
        return []
      }
    } else {
      let searchTerm = ""
      if (params.query) {
        searchTerm = "+" + params.query
      }
      if (params.patient) {
        searchTerm = "+" + params.patient
      }
      if (searchTerm.length > 0) {
        try {
          let docs = await this.lucindaService.searchDocuments(params.query)
          if (docs && docs.result && docs.status == "ok") {
            return docs.result.map(doc => this.makeFhir(doc))
          } else {
            return []
          }
        }catch(err){
          console.log(JSON.stringify(err))
          return []
        }
      } else {
        return []
      }
    }
  }

  private makeFhir(doc) {
    return {
      resourceType: "DocumentReference",
      id: doc._id || doc.id || doc.uuid,
      masterIdentifier: doc.title,
      status: "current",
      content: [
        {
          attachment: {
            contentType: "application/pdf",
            url: doc.path
          }
        }
      ]
    }
  }

  async pushSQL(fhir: FHIR_Resource): Promise<void> {
  }

  async deleteObject(id: string) {
  }

}