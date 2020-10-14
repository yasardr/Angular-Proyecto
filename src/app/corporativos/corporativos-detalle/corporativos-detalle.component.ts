import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CorporativosService } from '../services/corporativos.service';
import { DetalleCorporativo } from '../models/detalle-corporativo.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-corporativos-detalle',
  templateUrl: './corporativos-detalle.component.html',
  styleUrls: [
    './corporativos-detalle.component.scss',
    '../../../assets/sass/libs/select.scss',
    '../../../assets/sass/libs/datepicker.scss'
  ]
})
export class CorporativosDetalleComponent implements OnInit {

  editar = false;
  fecha = {year: 2020, month: 10, day: 9};
  corporativo: DetalleCorporativo = {
    Id: 0,
    Logo: '',
    NombreCorto: '',
    NombreCompleto: '',
    Url: '',
    FechaIncorporacion: '',
    Status: 0
  };

  constructor(  private activatedRoute: ActivatedRoute,
                private corporativoService: CorporativosService ) {

    this.activatedRoute.params.subscribe(params => {
      this.corporativoService.getDetalleCorporativo(params['id'])
        .subscribe(data => {
          this.corporativo = data;
        });
    });
  }

  ngOnInit(): void {
  }

  actualizarCorporativo( formdetalle: NgForm) {
    console.log(formdetalle.value);
  }

}
