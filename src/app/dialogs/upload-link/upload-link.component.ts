import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import LinkClass from 'src/app/shared/models/link';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-upload-link',
  templateUrl: './upload-link.component.html',
  styleUrls: ['./upload-link.component.scss']
})
export class UploadLinkComponent  {
  loading: boolean;
  url: string = '';
  uid: string;
  link: LinkClass;
  goalID: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UploadLinkComponent>, private goalService: GoalService) {
        this.goalID = data.goal.id;
        this.uid = data.uid;
  }

  //add link to goal object
  addLink() {
    this.loading = true;
    //add link
    let newLink = {url: this.url, uid: this.uid} as LinkClass;
    console.log("new link", newLink)
    this.goalService.addLinkToGoal(this.goalID, newLink).then(() => {
      this.loading = false;
      this.dialogRef.close(newLink);
    });
  }
}
