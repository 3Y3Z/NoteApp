import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  dataNewUser = {
    email: '',
    password: '',
 };
 
 dataUser = {
  email: '',
  password: '',
};

email = '';

pseudo;

tamere;

pseudos: [];

userId: string

connected: boolean;

signed: boolean;

taken: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    private route: Router,
    public alertController: AlertController,
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
      } else {
        this.connected = true;
        this.route.navigate(['home']);
      }
    });
   }

  ngOnInit() {
  }
 ionViewDidLeave(){
  this.email = null;
   this.pseudo = null;
 }

//   signUp() {
//     if(this.taken == false){
//     this.afAuth.createUserWithEmailAndPassword(this.dataNewUser.email, this.dataNewUser.password).then((userCredential) => {
//     this.dataNewUser = {
//       email: '',
//       password: '',
//     };
//     this.setUserData();
//     this.setPseudos();
//   })
//   .catch((error) => {
//     this.presentAlert();
//   })
//     }else{
//       this.presentAlertPseudo();
//     }

//  }


signUp(){
  
  this.afDB.list('Pseudos/' + this.pseudo).valueChanges(['child_removed']).subscribe((data) => {
    this.tamere = data;
    console.log(this.tamere);
    if(this.tamere.length == 1){
      this.taken == true;
      this.presentAlertPseudo();
      this.pseudo = '';
    }else{
      this.taken == false;
      this.afAuth.createUserWithEmailAndPassword(this.dataNewUser.email, this.dataNewUser.password).then((userCredential) => {
        this.dataNewUser = {
          email: '',
          password: '',
        };
        this.setUserData();
        this.setPseudos();
      })
      .catch((error) => {
        this.presentAlert();
      })
    }
  })}





 setUserData(){
  this.afAuth.authState.subscribe(auth => {
    if (!auth) {
    } else {
      this.afDB.list('Users/' + auth.uid).push({
        email: this.email,
        pseudo: this.pseudo
      });
    }
  });
 }



 setPseudos(){
  this.afAuth.authState.subscribe(auth => {
    if (!auth) {
    } else {
      this.afDB.list('Pseudos/' + this.pseudo).push({
        pseudo: this.pseudo,
        ukey: auth.uid
      });
    }
  });
 }


 async presentAlert() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'NON',
    message: 'Cet email est déja pris',
    buttons: ['Je suis infiniment désolé']
  });

  await alert.present();
}
async presentAlertPseudo() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'NON',
    message: 'Ce pseudo est déja pris',
    buttons: ['Je suis infiniment désolé']
  });

  await alert.present();
}


}
