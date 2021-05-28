import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from '../services/data.service';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from '../popover/popover.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@Component({
  selector: 'app-repertoire',
  templateUrl: './repertoire.page.html',
  styleUrls: ['./repertoire.page.scss'],
})
export class RepertoirePage implements OnInit {
  data: any;
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
  pseudo;
  current;
  filterTerm: string;
  constructor(
    private route: ActivatedRoute,
    private  router: Router,
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private dataService: DataService,
    public popover: PopoverController,

  ) { 
  
    const date = new Date();

    this.currentDate = date.toLocaleDateString('fr-FR',{ month: 'numeric', day: 'numeric', year:'numeric' });
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
      } else {
        this.userId = auth.uid;
        this.mail = auth.email;
        this.getUser();
        this.getNotes();
        this.toNote();
      }
    });
   
  }

  ngOnInit() {
    if (this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
 
    }  
   
  }
  
  closeSB(){
    this.filterTerm = '';
   this.current = 'display';

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
    this.showForm();
  } 
  
  search(){
    this.current = "searching";
  }

  showForm() {
    this.addNote = !this.addNote;
    this.myNote = '';
    this.myTitre = '';
  }


  getNotes() {
    this.afDB.list('Notes/' + this.data.ukey ).snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.notes = [];
      actions.forEach(action => {
        this.notes.push({
          key: action.key,
          unkey: action.payload.exportVal().unkey,
          titre: action.payload.exportVal().titre,
          date: action.payload.exportVal().date.substring(0, 10),
          texte: action.payload.exportVal().texte,
          repkey: action.payload.exportVal().repkey,
          auteur: action.payload.exportVal().auteur,
        });
      
      });
      this.notes.reverse();
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

  
  deleteNote(note: any) {
    this.afDB.list('Notes/' + this.data.ukey ).remove(note.key);
    this.afDB.list('Notes/').remove(note.key);
  }
  
  logout() {
    this.afAuth.signOut();
    this.router.navigate(['login']);
  }

  
 toNote() {
    this.afDB.list('Notes/' + this.data.ukey).valueChanges(['child_added', 'child_removed']).subscribe((data) => {
      this.apiData = data;
   
    })
  
  }

  openDetails(id) {
      if (this.apiData.find((item) => item.unkey === id)) {
        this.passingData = this.apiData.find((item) => item.unkey === id);
        this.dataService.setData(id, this.passingData);
        this.router.navigateByUrl('/note/' + id);
      }
  

        }

 createPopover()
  {
    this.popover.create({
    component:PopoverPage,
    showBackdrop:false,
    componentProps:{ukey:this.data.ukey, nom:this.data.nom, date:this.data.date, createur: this.data.createur}
  
  }).then((popoverElement)=>{
      popoverElement.present();
    })
  }
  toProfil(){
    this.router.navigateByUrl('profil');
  
  } 
 }
  

