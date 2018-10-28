module.exports = {
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
    termintypdefaults: ["Reserviert", "Frei","Normal"],
    terminstatedefaults: ["geplant", "eingetroffen", "fertig", "abgesagt"],
    typcolordefaults: {
      Reserviert: "black",
      Frei: "green",
      Normal: "yellow"
    },
    statecolordefaults: {
      geplant: "green",
      eingetroffen: "red",
      fertig: "blue",
      abgeagt: "grey"
    },
    timedefaults: {
      Reserviert: 30,
      Frei: 30,
      Normal: 30
    }
  }
}
