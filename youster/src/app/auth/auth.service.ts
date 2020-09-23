import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';

@Injectable({
  providedIn: 'root'
})
export  class  AuthService {

  user:  User;

  constructor(public  afAuth:  AngularFireAuth, public  router:  Router) { 
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })    
  }

  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    //console.log('user',user);
    return  user  !==  null;
  }

  async login(){
    await  this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
    console.log('Logged in.');
    this.router.navigate(['search']);
  }

  async logout() {
    await this.afAuth.signOut();
    console.log('Logged out.');
    this.router.navigate(['home']);
  }

}