import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


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
  images=[];
  filterTerm: string;
  current;
  createur;
  x;
  constructor(
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private route: Router,
    private dataService: DataService,
  ) 
  {
    const date = new Date();
    this.currentDate = date.toLocaleDateString("en-GB", { month: 'numeric', day: 'numeric', year:'numeric' });
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

  }

  addRepToFirebase() {
    this.afDB.list('Reps/' + this.userId).push({
      ukey: this.userId +  Math.floor(Math.random() * Math.floor(10000000000000000)),
      nom: this.myRep,
      date: new Date().toLocaleDateString("en-GB", { month: 'numeric', day: 'numeric', year:'numeric' }),
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
      this.reps.reverse();
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

       this.pseudo = this.users[0].pseudo;
      
      });
    });
  }

  changeCheckState(ev: any) {
   
    this.afDB.object('Reps/' + ev.key + '/checked/').set(ev.checked);
  }
  
  deleteRep(rep: any) {
    this.afDB.list('Reps/' + this.userId).remove(rep.key);
    this.afDB.list('Reps/').remove(rep.key);
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
     
   } 
   
   search(){
     this.current = "searching";
   }
 
   closeSB(){
     this.filterTerm = '';
    this.current = 'display';

  }

  testClass(){
    
    this.current = 'searching';
  }
  
 }
  
