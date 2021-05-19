import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { ClassService } from 'src/app/shared/services/class.service';

@Component({
  selector: 'gms-delete-class',
  templateUrl: './delete-class.component.html',
  styleUrls: ['./delete-class.component.scss']
})
export class DeleteClassComponent implements OnInit {
  loading: boolean = false;
  classData: DirectorClass;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  public dialogRef: MatDialogRef<DeleteClassComponent>, private classService: ClassService) { }

  ngOnInit() {
    this.classData = this.dialogData;
    console.log("opten", this.classData.id);
  }

  deleteClass(){
    this.classService.deleteClassForDirector(this.classData.id).then(() => {
      this.dialogRef.close(this.classData.id);
    })
  }
}
