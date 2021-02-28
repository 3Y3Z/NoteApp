import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  dataUser = {
    email: '',
    password: '',
 };
 connected: boolean;
  constructor(
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    private route: Router,
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
        this.connected = false;
      } else {
        console.log('connecté: ' + auth.uid);
        this.connected = true;
        this.route.navigate(['home']);
      }
    });
   }

  ngOnInit() {
  }

  login() {
    this.afAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password);
     this.dataUser = {
       email: '',
       password: '',
     };
  }
  toSignUp(){
    this.route.navigate(['signup'])
  }
}
