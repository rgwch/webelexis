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
  }
}
