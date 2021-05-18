import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepertoirePageRoutingModule } from './repertoire-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RepertoirePage } from './repertoire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepertoirePageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [RepertoirePage]
})
export class RepertoirePageModule {}
