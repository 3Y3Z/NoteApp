import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepertoirePageRoutingModule } from './repertoire-routing.module';

import { RepertoirePage } from './repertoire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepertoirePageRoutingModule
  ],
  declarations: [RepertoirePage]
})
export class RepertoirePageModule {}
