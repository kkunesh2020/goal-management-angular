import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  goalID: string;

  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<number>;
  downloadURL;

  constructor(private storage: AngularFireStorage, private goalService: GoalService) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload(){
    const path = `file/${Date.now()}_${this.file.name}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.goalService.uploadFile(this.goalID, {downloadURL: this.downloadURL, path});
      })
    )
  }

  isActive(snapshot){
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
