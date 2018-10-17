export type FindingDef = {
    // a unique name, e.g "circulation"
  name: string    
    // a translatable title, e.g. "Kreislauf"
  title: string
    // list of elements, e.g. ["systolic:mmHg","diastolic:mmHg","Pulse:1/min"]
  elements: Array<string> 
    // a function to create a new entry from a string
  create: (value: string) => Array<string | number>
    // a function to display an entry in verbose form
  verbose: (row: Array<string | number>) => string
    // a function to display an entry in compact form
  compact: (row: Array<string | number>) => string
}


