import {Patient} from '../../models/patient';
import {Appointment} from '../../models/appointment';

export class Index {
  public message = { text: '' };
  public textareaValue = '';
  public selectedPatient: Patient;
  public selectedAppointment: Appointment;
  public selectedPatients: Array<Patient> = [];
  public richEditorValue = 'something already existent in ckeditor';
}
