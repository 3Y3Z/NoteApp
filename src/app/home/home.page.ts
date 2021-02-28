import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentDate: string;
  myRep = '';
  addRep: boolean;
  reps = [];
  users = [];
  userId: string;
  mail: string;
  connected: boolean;
  usermail;
  repKey;
  apiData;
  passingData;
  nom;
  pseudo;


  constructor(
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private route: Router,
    private dataService: DataService,
  ) 
  {
    const date = new Date();
    const options = { month: 'numeric', day: 'numeric', year:'numeric' };
    this.currentDate = date.toLocaleDateString('fr-FR', options);
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
      } else {
        this.userId = auth.uid;
        this.mail = auth.email;
        this.getUser();
        this.getReps();
        this.toRep();
      }
    });
  }
  
  ngOnInit() {
    this.getUser();
  }

  addRepToFirebase() {
    this.afDB.list('Reps/' + this.userId).push({
      ukey: this.userId +  Math.floor(Math.random() * Math.floor(10000000000000000)),
      nom: this.myRep,
      date: new Date().toISOString(),
      createur: this.users[0].pseudo
    });
    this.showForm();
  }

  showForm() {
    this.addRep = !this.addRep;
    this.myRep = '';
  }

  getReps() {
    this.afDB.list('Reps/' + this.userId ).snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.reps = [];
      actions.forEach(action => {
        this.reps.push({
          key: action.key,
          ukey: action.payload.exportVal().ukey,
          nom: action.payload.exportVal().nom,
          date: action.payload.exportVal().date.substring(0, 10),
          createur: action.payload.exportVal().createur,
        });
      
      });
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

  changeCheckState(ev: any) {
    console.log('checked: ' + ev.checked);
    this.afDB.object('Reps/' + ev.key + '/checked/').set(ev.checked);
  }
  
  deleteRep(rep: any) {
    this.afDB.list('Reps/' + this.userId).remove(rep.key);
    this.afDB.list('Reps/').remove(rep.key);
  }
  
  logout() {
    this.afAuth.signOut();
    this.route.navigate(['login']);
  }

  
 toRep() {
    this.afDB.list('Reps/' + this.userId ).valueChanges(['child_added', 'child_removed']).subscribe((data) => {
      this.apiData = data;
    })
  
  }

  openDetails(id) {
      if (this.apiData.find((item) => item.ukey === id)) {
        this.passingData = this.apiData.find((item) => item.ukey === id);
        this.dataService.setData(id, this.passingData);
        this.route.navigateByUrl('/repertoire/' + id);
      }

        }
      
   toProfil(){
     this.route.navigateByUrl('profil');
     console.log("ok");
   } 
  

 }
  
