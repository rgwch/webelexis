import { element } from 'aurelia-protractor-plugin/protractor';
import { ChartDefinition } from '../components/graph';
import { FindingType, FindingsManager } from '../models/findings-model';
import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';

@autoinject
export class DisplayChart {
  finding: FindingType
  definition: ChartDefinition = {
    data: []
  }

  constructor(private dc: DialogController, private fm: FindingsManager) { }

  activate(finding: FindingType) {
    this.finding = finding
    const def = this.fm.getDefinitions()[finding.name]
    for (let i = 0; i < def.elements.length; i++) {
      const dt = def.elements[i]
      if (dt.chart && (dt.chart != "none")) {
        this.definition.data.push(
          {
            title: dt.title,
            axe: dt.chart,
            color: dt.color,
            values: this.finding.measurements
            .filter(f=>f['selected'])
            .map(m => [m.date, m.values[i]])
          }
        )
      }
    }
  }
}
