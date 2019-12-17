import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';

export interface Profile { 
  id: string;
  role: string; 
  name: string; 
  username: string 
}

@Injectable()
export class AuthService {
  profile: Observable<Profile>;
  user: Observable<firebase.User>;
  isLoggedIn = false;
  redirectUrl = 'home';

  constructor(
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore, private router: Router) {
    firebaseAuth.authState.subscribe(data => {
      if (!data) {
        // redirect to login 
        this.router.navigate(['']);
      } else {
        this.user = data;
        this.isLoggedIn = true;
        this.profile = this.afs.doc<Profile>('users/'+this.user.uid);
        this.profile.valueChanges()
        .subscribe(data => {
          this.profile = data;
          this.router.navigate([this.redirectUrl]);
        });
      }
    	
    });
    
  }

  signup(email: string, password: string, type: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
      	this.profile = this.afs.doc<Profile>('users/'+value.user.uid);
      	this.profile.set(
          {id:value.user.uid, nombre:'', username:value.user.email , role:type});
      	this.profile.valueChanges()
      	.subscribe(data => {
      		this.profile = data;
          this.router.navigate([this.redirectUrl]);
      	});
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.isLoggedIn = false;
    this.user = null;
    this.profile = null;
    this.firebaseAuth
      .auth
      .signOut();
  }
}
