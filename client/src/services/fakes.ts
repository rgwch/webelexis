import { DateTime } from './datetime';
import { UUID } from '../models/elexistype';
import { IKontakt } from '../models/kontakt-model';
import * as faker from 'faker/locale/de_CH'
faker.locale="de_CH"

export class Fakes{
  private dt: DateTime;
  async getKontakt(index: UUID){
    const ret=<IKontakt>{
      id: index,
      bezeichnung1: faker.name.lastName(),
      bezeichnung2: faker.name.firstName(),
      bezeichnung3: faker.name.jobDescriptor(),
      titel: faker.name.title(),
      geburtsdatum: this.dt.dateToElexisDate(faker.date.past()),
      istperson: "1",
      istanwedner: "0",
      geschlecht: (Math.random()>.5) ? "m": "f",
      strasse: faker.address.streetName(),
      plz: faker.address.zipCode(),
      ort: faker.address.city(),
      telefon1: faker.phone.phoneNumber(),
      telefon2: faker.phone.phoneNumber(),
      titelsuffix: faker.name.suffix(),
      natelnr: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      bemerkung: faker.lorem.sentence()
    }   
    return ret 
  }
}
