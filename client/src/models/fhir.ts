// see https://www.hl7.org/fhir/

/* some formal definitions
 * id:  [A-Za-z0-9\-\.]{1,64}
 * code: [^\s]+([\s]+[^\s]+)*
 * oid: urn:oid:[0-2](\.[1-9]\d*)+
 * unsignedInt: [0-9+]
 * positiveInt: [1-9][0-9]*
 * markdown: Any markdown string
 * instant: xs:timedate, e.g 2017-01-18T08:00:10Z
 * date: -?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?
 * dateTime: datetime: -?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?
 * uri: xs:anyURI
 */
export type date= string
export type time=string
export type dateTime=string
export type uri=string
export type id=string
export type code=string
export type instant= string
export type xhtml=string
export type positiveInt= number
export type GENDER="male"|"female"|"other"|"unknown"
export type comparator="<"|"<="|">="|">"
export type unitOfTime="s"|"min"|"h"|"d"|"wk"|"mo"|"a"
export type decimal=number
export type ENCOUNTER_STATUS = "planned" | "arrived" | "in-progress" | "onleave" | "finished" | "cancelled"
export type ENCOUNTER_CLASS = "inpatient" | "outpatient" | "ambulatory" | "emergency"
export type EPISODE_STATUS="planned"|"waitlist"|"active"|"active"|"onhold"|"finished"|"cancelled"

export interface FHIR_Address {
  use?: "home"|"work"|"old"|"temp"|"other"
  type?: "postal"|"physical"|"both"
  text?: string // textual representation
  line?: Array<string> // street, Number, PO Box etc
  city?: string
  district?: string
  state?: string
  postalCode?: string
  country?: string
  period?: FHIR_Period
}
export interface FHIR_Attachment {
  contentType: string
  language: string
  data: Array<number>
  url: uri
  size: number
  hash: Array<number>
  title: string
  creation: string
}
export interface FHIR_ResourceEntry {
  fullUrl: uri
  resource: FHIR_Resource
}
export interface FhirBundle {
  resourceType: string    // must be "Bundle"
  id: id
  type: string          // "searchset"
  total: number
  link: Array<{
    relation: string
    url: string
  }>
  entry: Array<FHIR_ResourceEntry>
}
export interface FHIR_CodeableConcept {
  coding: Array<FHIR_Coding>
  text: string
}
export interface FHIR_Coding {
  system: uri
  version: string
  code: code
  display: string
  userSelected: boolean
}
export interface FHIR_ContactPoint {
  system?: "phone" | "fax" | "email" | "pager" | "other"
  value?: string       // e.g. "555-55-55"
  use?: "home" | "work" | "temp" | "old" | "mobile"
  rank?: positiveInt
  period?: FHIR_Period
}
export interface FHIR_Element {
  id?: id
  extension?: Array<{
    url: uri
    valueX: any
  }>

}
export interface FHIR_HumanName extends FHIR_Element {
  use?:"usual" | "official" | "temp" | "nickname" | "anonymous" | "old" | "maiden"
  text?: string
  family?: Array<string>
  given?: Array<string>
  prefix?: Array<string>
  suffix?: Array<string>
  period?: FHIR_Period
}
export interface FHIR_Identifier {
  use?: string
  type?: FHIR_CodeableConcept
  system?: string
  value?: string
  period?: FHIR_Period
  assigner?: string
}
export interface FHIR_Meta {
  versionId?: id
  lastUpdated?: instant
  profile?: uri
  security?: FHIR_Coding
  tag?: FHIR_Coding
}

export interface FHIR_Narrative{
  status: "generated"|"extensions"|"additional"|"empty"
  div: xhtml
}
export interface FHIR_Period {
  start: dateTime
  end: dateTime
}
export interface FHIR_Quantity {
  value: number
  comparator: comparator
  unit: string
  system: uri
  code: code
}
export interface FHIR_Range {
  low: FHIR_Quantity
  high: FHIR_Quantity
}
export interface FHIR_Ratio {
  numerator: FHIR_Quantity
  denominator: FHIR_Quantity
}
export interface FHIR_Reference {
  reference: uri
  display: string
}
export interface FHIR_Resource {
  resourceType:string
  id:id
  text?: FHIR_Narrative
  meta?: FHIR_Meta
  implicitRules?: uri
  language?: code
  identifier?: Array<FHIR_Identifier>
}
export interface FHIR_SampledData{
  origin: FHIR_Quantity
  period: number
  factor: number
  lowerLimit: number
  upperLimit: number
  dimensions: number
  data: string
}
export interface FHIR_Timing extends FHIR_Element {
  event: Array<dateTime>
  repeat: {
    boundsQuantity: FHIR_Quantity
    boundsRange: FHIR_Range
    boundsPeriod: FHIR_Period
    count: number
    duration: number
    durationMax: number
    durationUnits: unitOfTime
    frequency: number
    frequencyMax: number
    period: number
    periodMax: number
    periodUnits: unitOfTime
    when: code
  }
  code: FHIR_CodeableConcept
}

/* ------------------
 FHIR Resources
 --------------------*/

export interface FHIR_Appointment extends FHIR_Resource {
  status: "proposed"|"pending"|"booked"|"arrived"|"fulfilled"|"cancelled"|"noshow"
  type: FHIR_CodeableConcept
  reason: FHIR_CodeableConcept
  priority: number
  description: string
  start: instant
  end: instant
  minutesDuration: number
  slot: FHIR_Reference
  comment: string
  participant: Array<{
    type: Array<FHIR_CodeableConcept>
    actor: FHIR_Reference
    required: "required"|"optional"|"information-only"
    status: "accepted"|"declined"|"tentative"|"needs-action"
  }>
}
export interface FHIR_Condition extends FHIR_Resource {
  patient: FHIR_Reference
  encounter: FHIR_Reference
  asserter: FHIR_Reference
  dateRecorded: date
  code: FHIR_CodeableConcept
  category: FHIR_CodeableConcept
  clinicalStatus: string // active | relapse | remission | resolved
  verificationStatus: string // provisional | differential | confirmed | refuted | error | unknown
  severity: FHIR_CodeableConcept
  onsetDateTime: dateTime
  abatementDateTime: dateTime
  stage:{
    summary: FHIR_CodeableConcept
    assessment: FHIR_Reference
  }
  evidence: Array<{
    code: FHIR_CodeableConcept
    detail: FHIR_Reference
  }>
  bodySite: Array<FHIR_CodeableConcept>
  notes: string
}
export interface FHIR_DocumentReference extends FHIR_Resource {
  masterIdentifier: FHIR_Identifier
  subject: FHIR_Reference
  type: FHIR_CodeableConcept
  class: FHIR_CodeableConcept
  author: Array<FHIR_Reference>
  custodian: FHIR_Reference
  authenticator: FHIR_Reference
  created: dateTime
  indexed: instant
  status: "current"|"superseded"|"entered-in-error"
  docStatus: FHIR_CodeableConcept
  relatesTo: Array<{
    code: "replaces"|"transforms"|"signs"|"appends"
    target: FHIR_Reference
  }>
  description: string
  securityLabel: Array<FHIR_CodeableConcept>
  content: Array<{
    attachment: FHIR_Attachment
    format: Array<FHIR_Coding>
  }>
  context:{
    encounter: FHIR_Reference
    event: Array<FHIR_CodeableConcept>
    period: FHIR_Period
    facilityType: FHIR_CodeableConcept
    practiceSetting: FHIR_CodeableConcept
    sourcePatientInfo: FHIR_Reference
    related: Array<{
      identifier: FHIR_Identifier
      ref: FHIR_Reference
    }>
  }

}
export interface FHIR_Encounter extends FHIR_Resource {
  status: ENCOUNTER_STATUS
  statusHistory: Array<{
    status: ENCOUNTER_STATUS
    period: FHIR_Period
  }>
  class: ENCOUNTER_CLASS
  type: Array<FHIR_CodeableConcept>
  priority: FHIR_CodeableConcept
  patient: FHIR_Reference
  episodeOfCare: Array<FHIR_Reference>
  incomingReferral: Array<FHIR_Reference>
  participant: Array<{
    type: Array<FHIR_CodeableConcept>
    period: FHIR_Period
    individual: FHIR_Reference
  }>
  appointment: FHIR_Reference
  period: FHIR_Period
  length: FHIR_Quantity
  reason: Array<FHIR_CodeableConcept>
  indication: Array<FHIR_Reference>    // reference to Condition/Procedure
  // hospitalization related properties omitted
  location: Array<{
    location: FHIR_Reference
    status: "planned"|"active"|"reserved"|"completed"
    period: FHIR_Period
  }>
  serviceProvider: FHIR_Reference
  partOf: FHIR_Reference

}
export interface FHIR_EpisodeOfCare extends FHIR_Resource {
  status: EPISODE_STATUS
  statusHistory: Array<{
    status: EPISODE_STATUS
    period: FHIR_Period
  }>
  type: Array<FHIR_CodeableConcept>
  condition: Array<FHIR_Reference>
  patient: FHIR_Reference
  managingOrganization: FHIR_Reference
  period: FHIR_Period
  referralRequest: FHIR_Reference
  careManager: FHIR_Reference
  careTeam: Array<{
    role: Array<FHIR_CodeableConcept>
    period: FHIR_Period
    member: FHIR_Reference
  }>
}
export interface FHIR_Flag extends FHIR_Resource {
  category?: FHIR_CodeableConcept
  status: "active"|"inactive"|"entered-in-error"
  period?: FHIR_Period
  subject: FHIR_Reference
  encounter?: FHIR_Reference
  author?: FHIR_Reference
  code: FHIR_CodeableConcept
}
export interface FHIR_Medication extends FHIR_Resource {
  code: Array<FHIR_CodeableConcept>
  isBrand?: boolean
  manufacturer?: FHIR_Reference
  product?: {
    form: FHIR_CodeableConcept
    ingredient: Array<{
      item: FHIR_Reference
      amount: FHIR_Ratio
    }>
  }
  batch?: Array<{
    lotNumber: string
    expirationDate: dateTime
  }>
  package?:{
    container: FHIR_CodeableConcept
    content: Array<{
      item: FHIR_Reference
      amount: FHIR_Quantity
    }>
  }
}
export interface FHIR_MedicationAdministration extends FHIR_Resource {
  status: "in-progress"|"on-hold"|"completed"|"entered-in-error"|"stopped"
  patient: FHIR_Reference
  practitioner: FHIR_Reference
  encounter: FHIR_Reference
  prescription: FHIR_Reference
  wasNotGiven: boolean
  reasonNotGiven: Array<FHIR_CodeableConcept>
  reasonGiven: Array<FHIR_CodeableConcept>
  effectiveTimeDateTime: dateTime
  medicationCodeableConcept: FHIR_CodeableConcept
  medicationReference: FHIR_Reference
  device: FHIR_Reference
  note: string
  dosage: {
    text: string
    siteReference: FHIR_Reference
    route: FHIR_CodeableConcept
    method: FHIR_CodeableConcept
    quantity: FHIR_Quantity
    rateRatio: FHIR_Ratio
    rateRange: FHIR_Range
  }

}
export interface FHIR_MedicationOrder extends FHIR_Resource {
  dateWritten: dateTime
  status: "active"|"on-hold"|"completed"|"entered-in-error"|"stopped"|"draft"
  dateEnded: dateTime
  reasonEnded: FHIR_CodeableConcept
  patient: FHIR_Reference
  prescriber: FHIR_Reference
  encounter: FHIR_Reference
  reasonCodeableConcept: FHIR_CodeableConcept
  reasonReference: FHIR_Reference
  note: string
  medicationCodeableConcept: FHIR_CodeableConcept
  medicationReference: FHIR_Reference
  dosageInstruction: Array<{
    text: string
    addidionalInstructions: FHIR_CodeableConcept
    timing: FHIR_Timing
    asNeededBoolean: boolean
    asNeededCodeableConcept: FHIR_CodeableConcept
    siteReference: FHIR_Reference
    route: FHIR_CodeableConcept
    method: FHIR_CodeableConcept
    doseRange: FHIR_Range
    doseQuantity: FHIR_Quantity
    rateRatio: FHIR_Ratio
    rateRange: FHIR_Range
    maxDosePerPeriod: FHIR_Ratio
  }>
  dispenseRequest:{
    medicationReference: FHIR_Reference
    validityPeriod: FHIR_Period
    numberOfRepeatsAllowed: number
    quantity: FHIR_Quantity
    expectedSupplyDuration: FHIR_Quantity
  }
  substitution:{
    type: FHIR_CodeableConcept
    reson: FHIR_CodeableConcept
  }
  priorPrescription: FHIR_Reference
}
export interface FHIR_Observation extends FHIR_Resource{
  status:"registered"|"preliminary"|"final"|"amended"|string
  category: FHIR_CodeableConcept
  code: FHIR_CodeableConcept
  subject: FHIR_Reference
  encounter: FHIR_Encounter
  effectiveDateTime: dateTime
  effectivePeriod: FHIR_Period
  issued: instant
  performer: FHIR_Reference
  valueQuantity?: FHIR_Quantity
  valueCodeableConcept?: FHIR_CodeableConcept
  valueString?:string
  valueRange?: FHIR_Range
  valueRatio?: FHIR_Ratio
  valueSampledData?:FHIR_SampledData
  valueAttachment?: FHIR_Attachment
  valueTime?:time
  valueDateDime?:dateTime
  valuePeriod?:FHIR_Period
  dataAbsentReason:FHIR_CodeableConcept
  interpretation:FHIR_CodeableConcept
  comments: string
  bodySite: FHIR_CodeableConcept
  method:FHIR_CodeableConcept
  specimen: FHIR_Reference
  referenceRange: Array<{
    low: FHIR_Quantity
    high:FHIR_Quantity
    meaning: FHIR_CodeableConcept
    age: FHIR_Range
    text: string
  }>
  related: Array<{
    type: "has-member"|"derived-from"|"sequel-to"|"replaces"|"qualified-by"|"interfered-by"
    target: FHIR_Reference
  }>
  component:Array<{
    code: FHIR_CodeableConcept
    valueQuantity?: FHIR_Quantity
    valueCodeableConcept?: FHIR_CodeableConcept
    valueString?:string
    valueRange?: FHIR_Range
    valueRatio?: FHIR_Ratio
    valueSampledData?:FHIR_SampledData
    valueAttachment?: FHIR_Attachment
    valueTime?:time
    valueDateDime?:dateTime
    valuePeriod?:FHIR_Period
    dataAbsentReason:FHIR_CodeableConcept
    referenceRange: Array<{
      low: FHIR_Quantity
      high:FHIR_Quantity
      meaning: FHIR_CodeableConcept
      age: FHIR_Range
      text: string
    }>
  }>

}
export interface FHIR_Organization extends FHIR_Resource {
  active: boolean
  type: FHIR_CodeableConcept
  name: string
  telecom: Array<FHIR_ContactPoint>
  address: Array<FHIR_Address>
  partOf: FHIR_Reference
  contact: Array<{
    purpose: FHIR_CodeableConcept
    name: FHIR_HumanName
    telecom: Array<FHIR_ContactPoint>
    address: FHIR_Address
  }>
}
export interface FHIR_Patient extends FHIR_Resource {
  active?: boolean
  name?:Array<FHIR_HumanName>
  telecom?: Array<FHIR_ContactPoint>
  gender?: GENDER
  birthDate?: date
  deceasedBoolean? : boolean
  deceasedDateTime?: dateTime
  address?: Array<FHIR_Address>
  maritalStatus?: FHIR_CodeableConcept
  multipleBirthBoolean?: boolean
  multipleBirthInteger?: number
  photo?: Array<FHIR_Attachment>
  contact?: Array<{
    relationship: Array<FHIR_CodeableConcept>
    name: FHIR_HumanName
    telecom: FHIR_ContactPoint
    address: FHIR_Address
    gender: string
    organization: any
    period: FHIR_Period
  }>
  communication?: Array<{
    language: FHIR_CodeableConcept
    preferred: boolean
  }>
  careProvider?: Array<any>
  managingOrganization?: any
  link?: Array<{
    other: any
    type: string
  }>
}
export interface FHIR_Practitioner extends FHIR_Resource {
  active: boolean
  name: FHIR_HumanName
  telecom: Array<FHIR_ContactPoint>
  address: Array<FHIR_Address>
  gender: GENDER
  birthDate: date
  photo: Array<FHIR_Attachment>
  practitionerRole: Array<{
    managingOrganization: FHIR_Reference
    role: FHIR_CodeableConcept
    specialty: Array<FHIR_CodeableConcept>
    period: FHIR_Period
    location: FHIR_Reference
    healthcareService: Array<FHIR_Reference>
  }>
  qualification: Array<{
    identifier: Array<FHIR_Identifier>
    code: FHIR_CodeableConcept
    period: FHIR_Period
    issuer: FHIR_Reference
  }>
  communication: Array<FHIR_CodeableConcept>
}
export interface FHIR_Schedule extends FHIR_Resource{
  type?: FHIR_CodeableConcept
  actor: FHIR_Reference
  planningHorizon?:FHIR_Period
  comment?: string
}
export interface FHIR_Slot extends FHIR_Resource{
  type?: FHIR_CodeableConcept
  schedule: FHIR_Reference
  freeBusyType: "busy"|"free"|"busy-unavailable"|"busy-tentative"
  start: instant
  end: instant
  overbooked?: boolean
  comment?: string
}

