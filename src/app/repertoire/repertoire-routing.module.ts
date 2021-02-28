import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepertoirePage } from './repertoire.page';

const routes: Routes = [
  {
    path: '',
    component: RepertoirePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepertoirePageRoutingModule {}
