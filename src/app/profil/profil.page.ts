import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
userId: string;
users= [];
email;
avatars = [];
pathtest = 'https://picsum.photos/200'
  croppedImagePath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
};

  constructor(
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File,
    public afSG: AngularFireStorage,
    private route: Router,
    
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

  logout() {
    this.afAuth.signOut();
    this.route.navigate(['login']);
  }
  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.croppedImagePath = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
  
   
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Choisissez dans votre gallerie',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Prendre une photo',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Annuler',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }




}
