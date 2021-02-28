import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
  data: any;
  newUser;
  newUserPseudo;
  newUserId
  ukey;
  nom;
  date;
  createur;
  tamere;
  lacle;
  mail;
  constructor(
    public popover: PopoverController,
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
  ) { 
    
  }

  ngOnInit() {
  }

  closePopover()
   {
     this.popover.dismiss();
   }

  //  addUserToRep() {
  //   this.afDB.list('Reps/' +  this.newUserId).push({
  //     ukey: this.ukey,
  //     nom: this.nom,
  //     date: this.date
  //   });
  //   console.log(this.newUserId);
  // }


  getData(){
    console.log(this.newUserId)
  }
    
    getUserByPseudo(){
      this.afDB.list('Pseudos/' + this.newUserPseudo).valueChanges(['child_added', 'child_removed']).subscribe((data) => {
        this.tamere = data;
       this.lacle = this.tamere.find((item) => item.ukey);
       this.newUserId = this.lacle.ukey;
       console.log(this.newUserId);
       this.afDB.list('Reps/' +  this.newUserId).push({
        ukey: this.ukey,
        nom: this.nom,
        date: this.date,
        createur: this.createur
      });
      })
    
      
      }

  addUserAndClose(){
    this.getUserByPseudo();
    this.closePopover();
  }
}
