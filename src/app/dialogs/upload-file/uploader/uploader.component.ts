import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'gms-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  isHovering :boolean;
  files: File[] = [];
  goalData: any;
  loading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UploaderComponent>) {
    this.goalData = data;
  }

  toggleHover(event: boolean){
    this.isHovering = event;
  }

  onDrop(files: FileList){
    this.loading = true;
    for(let i = 0; i < files.length; i++){
      this.files.push(files.item(i));
    }
    this.loading = false;
  }

  addFiles(){
    this.dialogRef.close(this.files);
  }

}
