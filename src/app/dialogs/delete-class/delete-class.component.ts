import { Component, Inject, OnInit, Optional } from '@angular/core';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { ClassService } from 'src/app/shared/services/class.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-delete-class',
  templateUrl: './delete-class.component.html',
  styleUrls: ['./delete-class.component.scss']
})
export class DeleteClassComponent implements OnInit {
  loading: boolean = false;
  classData: DirectorClass;
  public dialogData: any;

  constructor(
  @Optional() protected dialogRef: NbDialogRef<DeleteClassComponent>, private classService: ClassService) { }

  ngOnInit() {
    this.classData = this.dialogData;
    console.log("opten", this.classData.id);
  }

  deleteClass(){
    console.log('deleting....');
    this.classService.deleteClassForDirector(this.classData).then((result) => {
      console.log("done deleting")
      this.dialogRef.close(this.classData.id);
    })
  }
}
