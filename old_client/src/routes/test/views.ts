import { PLATFORM } from "aurelia-pal";

export default{
  "edit":{
    "name": "Editor",
    "view": PLATFORM.moduleName("./editor")
  },
  "kons":{
    "name": "Konsultationen",
    "view": PLATFORM.moduleName("./encounters_")
  },
  "scroll":{
    "name": "Scroller",
    "view":PLATFORM.moduleName("./scroll_")
  },
  "findings":{
    "name": "Findings",
    "view": PLATFORM.moduleName("views/findings-view")
  },
  "grafik":{
    "name": "Grafik",
    "view": PLATFORM.moduleName("./grafik")
  },
  "dragdrop":{
    "name": "Drag&drop",
    "view": PLATFORM.moduleName("./dragdrop")
  },
  "smartlist":{
    "name": "Smartlist",
    "view": PLATFORM.moduleName("./smartlist_")
  },
  "medication":{
    "name":"Medikation",
    "view": PLATFORM.moduleName("./medi")
  },
  "brief":{
    "name": "Brief",
    "view": PLATFORM.moduleName("./brief_")
  }
}
