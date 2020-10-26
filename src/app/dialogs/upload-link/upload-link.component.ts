import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-upload-link',
  templateUrl: './upload-link.component.html',
  styleUrls: ['./upload-link.component.scss']
})
export class UploadLinkComponent  {
  loading: boolean;
  link: string;
  goalID: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UploadLinkComponent>, private goalService: GoalService) { }

  addLink() {
    this.loading = true;
    //add link
    this.goalService.addLinkToGoal(this.goalID, this.link).then(() => {
      this.loading = false;
      this.dialogRef.close(this.link);
    });
  }
}
