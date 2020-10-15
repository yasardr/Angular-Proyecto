import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorporativosListComponent } from './corporativos-list/corporativos-list.component';
import { CorporativosDetalleComponent } from './corporativos-detalle/corporativos-detalle.component';
import { CorporativosResolverGuard } from './corporativos-resolver.guard';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CorporativosListComponent,
        data: {
          title: 'Corporativos'
        },
        resolve: {corporativos: CorporativosResolverGuard}
      },
      {
        path: 'detalle/:id',
        component: CorporativosDetalleComponent,
        data: {
          title: 'Detalle Corporativo'
        },
        resolve: {corporativos: CorporativosResolverGuard}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporativosRoutingModule { }
