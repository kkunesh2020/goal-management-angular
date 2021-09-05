import { Component, Inject, OnInit, Optional } from '@angular/core';
import LinkClass from 'src/app/shared/models/link';
import { GoalService } from 'src/app/shared/services/goal.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-upload-link',
  templateUrl: './upload-link.component.html',
  styleUrls: ['./upload-link.component.scss']
})
export class UploadLinkComponent implements OnInit{
  loading: boolean;
  url = '';
  email: string;
  link: LinkClass;
  public data: any;
  goalID: string;

  constructor(
        @Optional() protected dialogRef: NbDialogRef<UploadLinkComponent>, private goalService: GoalService) {
  }

  ngOnInit(){
    this.goalID = this.data.goal.id;
    this.email = this.data.email;
  }

  validLink(): boolean{
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(this.url);
  }

  // add link to goal object
  addLink() {
    this.loading = true;
    // add link
    const newLink = {url: this.url, email: this.email} as LinkClass;
    console.log('new link', newLink);
    this.goalService.addLinkToGoal(this.goalID, newLink).then(() => {
      this.loading = false;
      this.dialogRef.close(newLink);
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
