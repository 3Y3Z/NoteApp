import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
data:any;
selectedService: null;
currentDate: string;
myNote = '';
myTitre = '';
addNote: boolean;
notes = [];
users = [];
userId: string;
mail: string;
connected: boolean;
usermail;
repKey;
apiData;
passingData;
auteur;
ided : boolean;
crUser;
crAu;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private dataService: DataService,
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
      } else {
        this.userId = auth.uid;
        this.mail = auth.email;
        this.getUser();
      }
  
    });
   }
  ngOnInit() {
    if (this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
  }

  }
  toProfil(){
    this.router.navigateByUrl('profil');
  } 
  addNoteToFirebase() {
    
    this.afDB.list('Notes/' + this.data.ukey).push({
      unkey: this.userId + Math.floor(Math.random() * Math.floor(10000000000000000)),
      texte: this.myNote,
      date: new Date().toLocaleDateString('fr-FR',{ month: 'numeric', day: 'numeric', year:'numeric' }),
      titre: this.myTitre,
      repkey: this.data.ukey,
      auteur: this.users[0].pseudo
    });
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
