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
    "view": PLATFORM.moduleName("components/workflow/findings-view")
  },
  "grafik":{
    "name": "Grafik",
    "view": PLATFORM.moduleName("./grafik")
  }
}
