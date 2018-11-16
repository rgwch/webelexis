module.exports = {
  "mandator":{
    
  },
  "fall": {
    "fallgesetz": "KVG",
    "fallgrund": "Krankheit",
    "fallbezeichnung": "Allg.",
  },
  agenda: {
    resources: ["Arzt", "MPA"],
    daydefaults: `FS1~#<ASa=A0000-0900
1200-2359~#<ADo=A0000-0800
1200-1300
1700-2359~#<AFr=A0000-0800
1200-1300
1700-2359~#<AMi=A0000-0800
1300-2359~#<ADi=A0000-0900
1300-1400
1800-2359~#<AMo=A0000-0800
1200-1300
1700-2359~#<ASo=A0000-2359`,
    termintypdefaults: ["Frei","Reserviert","Normal"],
    terminstatedefaults: ["-", "geplant", "eingetroffen", "fertig", "abgesagt"],
    typcolordefaults: {
      Reserviert: "000000",
      Frei: "80ff80",
      Normal: "ff8040"
    },
    statecolordefaults: {
      geplant: "ff8000",
      eingetroffen: "ff0000",
      fertig: "008000",
      abgeagt: "e5e5e5"
    },
    timedefaults: {
      Reserviert: 30,
      Frei: 30,
      Normal: 30
    }
  }
}
