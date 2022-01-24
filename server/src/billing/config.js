// rename this to config.js and set correct values
module.exports= {
    mysql: {
        client: 'mysql2',
        connection: {
            host: "localhost",
            user: "elexisuser",
            password: "elexis",
            database: "elexiscopy",
            port: 3312
        }
    } ,
    creditor:{
        name: "Dr. med. A. Eisenbart",
        address: "Hintergasse 27",
        zip: 9999,
        city: "Elexikon",
        account: "CH6330808004140084701",
        // account: "CH6209000000401223331",
        country: "CH"
    },
    billing:{
        output: "/Users/gerry/elexisdata"
    }  
}
