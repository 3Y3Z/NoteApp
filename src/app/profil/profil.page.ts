import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
userId: string;
users= [];
email;
  constructor(
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
  ) { 
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
      } else {
        this.userId = auth.uid;
        this.getUser();
      }
    });
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.afDB.list('Users/' + this.userId).snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.users = [];
      actions.forEach(action => {
        this.users.push({
          key: action.key,
          email: action.payload.exportVal().email,
          pseudo: action.payload.exportVal().pseudo,
        });
      });
    });
  }
}
