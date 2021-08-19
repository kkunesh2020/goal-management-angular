import { Component, Inject, Optional } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import FileClass from 'src/app/shared/models/file';
import { GoalService } from 'src/app/shared/services/goal.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  isHovering: boolean;
  files: FileClass[] = [];
  goalData: any;
  email: string;
  loading: boolean;
  public data: any;

  constructor(
    @Optional() protected ref: NbDialogRef<UploaderComponent>,
    public storage: AngularFireStorage,
    private goalService: GoalService
  ) {
    if(this.data){
      this.goalData = this.data.goal;
      this.email = this.data.email;
    }
    
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  toggleDrag(event: boolean) {
    this.isHovering = event;
  }

  // upload file to FB storage
  async onDrop(files: FileList) {
    this.loading = true;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      console.log('selected file', file);
      const resultFile = await this.uploadFile(file);
      this.files.push(resultFile);
    }
    this.loading = false;
  }

  // upload file data to firebase storage and database field
  async uploadFile(file: File): Promise<FileClass> {
    let fileData;
    let downloadURL;
    const path = `files/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    const task = this.storage.upload(path, file);
    console.log('the task', task);
    return new Promise((resolve, reject) => {
      task.then(async () => {
        downloadURL = await ref.getDownloadURL().toPromise();
        fileData = new FileClass(file.name, downloadURL, path, this.email);
        console.log('got the file data', fileData, this.goalData);
        await this.goalService.uploadFile(this.goalData.id, fileData);
        resolve(fileData);
      });
      console.log('end of function');
    });
  }

  // pass back files data to dialog
  addFiles() {
    this.ref.close(this.files);
  }
}
