export interface Kontakt{
    id: string
    bezeichnung1: string
    bezeichnung2: string
    bezeichnung3: string
    geburtsdatum: string
    geschlecht: "m" | "f"
    titel: string
    strasse: string
    plz: string
    ort: string
    email: string
    anschrift: string
    bemerkung: string
    deleted: string
    lastupdate: number
    extinfo: Uint8Array

}
export interface Fall{
    id: string
    patientid: string
    garantid: string
    kostentrid: string
    versnummer: string
    fallnumme: string
    betriebsnummer: string
    diagnosen: string
    datumvon: string
    datumbis: string
    bezeichnuns: string
    grund: string
    gesetz: string
    extinfo: Uint8Array
    status: string
    deleted: string
    lastupdate: number

}
export interface Invoice{
    id?: string
    deleted?: string
    lastupdate?: number
    rnnummer: string
    fallid:string
    rndatum: string
    rnstatus: string
    rndatumvon: string
    rndatumbis: string
    statusdatum: string
    betrag: string
    extinfo?: Uint8Array
    fall?: Fall
    patient?: Kontakt
    mandant?: Kontakt
    garant?: Kontakt
    kostentraeger?: Kontakt
}

export enum InvoiceState{
    OPEN=4,
    OPEN_AND_PRINTED,
    DEMAND_NOTE,
    DEMAND_NOTE_PRINTED,
    DEMAND_NOTE_2,
    DEMAND_NOTE_2_PRINTED,
    DEMAND_NOTE_3,
    DEMAND_NOTE_3_PRINTED,
    IN_EXECUTION,
    PARTIAL_LOSS,
    TOTAL_LOSS,
    PARTIAL_PAYMENT,
    PAID,
    EXCESSIVE_PAYMENT,
    CANCELLED
}