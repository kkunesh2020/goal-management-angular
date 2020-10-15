import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ClassService } from '../services/class.service';

@Injectable({
  providedIn: 'root'
})
export class ClassAuthGuard implements CanActivate {

  constructor(private classService: ClassService, private auth: AuthService, private route: ActivatedRoute){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.auth.user$.subscribe(async (userProfile) => {
        const classID = this.route.snapshot.paramMap.get('classID');
        this.classService.allowedInClass(userProfile.uid, classID);
      })
    return true;
  }

}
