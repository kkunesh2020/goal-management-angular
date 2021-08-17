import { Component, OnInit, Optional } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-warning-pending',
  templateUrl: './warning-pending.component.html',
  styleUrls: ['./warning-pending.component.scss']
})
export class WarningPendingComponent implements OnInit {

  constructor(@Optional() protected ref: NbDialogRef<WarningPendingComponent>) { }

  ngOnInit() {
  }

  closeDialog(){
    this.ref.close();
  }

}
