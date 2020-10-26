import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'gms-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  isHovering :boolean;
  files: File[] = [];
  goalData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.goalData = data;
  }

  toggleHover(event: boolean){
    this.isHovering = event;
  }

  onDrop(files: FileList){
    for(let i = 0; i < files.length; i++){
      this.files.push(files.item(i));
    }
  }

}
