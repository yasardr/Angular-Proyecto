import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorporativosListComponent } from './corporativos-list/corporativos-list.component';
import { CorporativosDetalleComponent } from './corporativos-detalle/corporativos-detalle.component';


const routes: Routes = [
  /*{
    path: '',
    component: CorporativosListComponent,
    data: {
      title: 'Corporativos'
    }
  }*/
  {
    path: '',
    children: [
      {
        path: '',
        component: CorporativosListComponent,
        data: {
          title: 'Corporativos'
        }
      },
      {
        path: 'detalle/:id',
        component: CorporativosDetalleComponent,
        data: {
          title: 'Detalle Corporativo'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporativosRoutingModule { }
