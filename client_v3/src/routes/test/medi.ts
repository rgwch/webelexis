import { PrescriptionManager } from '../../models/prescription-model';
import { DataService, DataSource } from 'services/datasource';
import { WebelexisEvents } from '../../webelexisevents';
import { autoinject } from 'aurelia-framework';

@autoinject
export class MediTest{
  current
  
  constructor(private we:WebelexisEvents, private pm:PrescriptionManager){
    
  }
  
  attached(){
    const act=this.we.getSelectedItem('patient')
    this.pm.fetchCurrent(act.id).then(res=>{
      this.current=res
    })
  }
}
