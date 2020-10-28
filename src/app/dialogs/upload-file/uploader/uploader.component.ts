import { Component, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import FileClass from 'src/app/shared/models/file';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  isHovering :boolean;
  files: FileClass[] = [];
  goalData: any;
  loading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UploaderComponent>, public storage: AngularFireStorage, private goalService: GoalService) {
    this.goalData = data;
  }

  toggleHover(event: boolean){
    this.isHovering = event;
  }

  toggleDrag(event: boolean){
    this.isHovering = event;
  }

  async onDrop(files: FileList){
    this.loading = true;
    for(let i = 0; i < files.length; i++){
      let file = files.item(i);
      console.log("selected file", file);
      let resultFile = await this.uploadFile(file);
      this.files.push(resultFile);
    }
    this.loading = false;
  }

 async uploadFile(file: File): Promise<FileClass>{
    let fileData;
    let downloadURL;
    const path = `files/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    let task = this.storage.upload(path, file);
    console.log("the task", task);
    return new Promise((resolve, reject) => {
      task.then(async() => {
        downloadURL = await ref.getDownloadURL().toPromise();
        fileData = new FileClass(file.name, downloadURL, path);
        console.log("got the file data", fileData);
        await this.goalService.uploadFile(this.goalData.id, fileData);
        resolve(fileData);
      });
      console.log("end of function");
    });
  }

  addFiles(){
    this.dialogRef.close(this.files);
  }

}
