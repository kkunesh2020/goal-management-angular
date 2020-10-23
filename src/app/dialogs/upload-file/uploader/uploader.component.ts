import { Component } from '@angular/core';

@Component({
  selector: 'gms-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  isHovering :boolean;
  files: File[] = [];

  constructor() { }

  toggleHover(event: boolean){
    this.isHovering = event;
  }

  onDrop(files: FileList){
    for(let i = 0; i < files.length; i++){
      this.files.push(files.item(i));
    }
  }

}
