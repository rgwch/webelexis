import { UserManager } from "models/user-model";

export class DummyUserManager{
    public hasRole(usr,role){
        return true;
    }
    public async hasACE(user,ace){
        return true
    }
    public async getElexisKontakt(user){
        user._Kontakt={
            titel: "Prof. Dr.",
            bezeichnung1: "Dummbald",
            bezeichnungs2: "Dummyuser",
            bezeichnung3: "dummyuser",
            strasse: "Hintergasse 77",
            plz: "7777",
            ort: "Webelexikon",
            extjson: {
                EAN: "007",
                KSK: "X123456",
                NIF: "9876",
                TarmedSpezialität: "Facharzt für Webelexik",
                Kanton: "XY",
                Mandant: "dummyuser"
            }
        }
        return user._Kontakt
    }

    public async getActiveMandatorFor(user){
        user._Mandator=await this.getElexisKontakt(user)
        return user._Mandator
    }

}