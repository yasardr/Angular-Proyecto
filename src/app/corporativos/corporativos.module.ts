import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CorporativosRoutingModule } from './corporativos-routing.module';

import { CorporativosListComponent } from './corporativos-list/corporativos-list.component';
import { CorporativosDetalleComponent } from './corporativos-detalle/corporativos-detalle.component';

import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    CorporativosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    NgxDatatableModule,
    HttpClientModule
  ],
  exports: [],
  declarations: [
    CorporativosListComponent,
    CorporativosDetalleComponent
  ],
  providers: [],
})
export class CorporativosModule { }
