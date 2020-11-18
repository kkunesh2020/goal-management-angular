import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Class } from 'src/app/shared/models/class.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from '../../shared/services/class.service';

@Component({
  selector: 'gms-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent  {
  classes: Class[];
  loading: boolean = true;
  constructor(private afs: AngularFirestore, private classService: ClassService, private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(async (userProfile) => {
      if(!userProfile) return;
      this.getClasses(userProfile.uid);
    })
  }



  goToCard(classID: string){
    this.router.navigate([`/classes/${classID}`]);
  }

  getClasses(userId: string){
    this.classes = this.classService.getClasses(userId);
    this.loading = false;
  }

}
