import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleCorporativo } from '../models/detalle-corporativo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CorporativosService } from '../services/corporativos.service';
import { TransformDataCorporativosService } from '../services/transform-data-corporativos.service';

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

  formdetalle: FormGroup
  editar = false;
  mensaje = false;
  fecha = {year: 2020, month: 10, day: 9};
  corporativo: DetalleCorporativo = {
    Id: 0,
    Logo: '',
    NombreCorto: '',
    NombreCompleto: '',
    Url: '',
    FechaIncorporacion: {},
    Status: 0
  };

  constructor(  private activatedRoute: ActivatedRoute, private fb: FormBuilder,
                private corporativoService: CorporativosService, private transform: TransformDataCorporativosService ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {corporativos: DetalleCorporativo}) => {
      this.corporativo = data.corporativos;
      this.cargarFormulario();
    });
  }

  // Validaciones de los campos
  get nombreCortoValido() {
    return this.formdetalle.get('nombreCorto').invalid && this.formdetalle.get('nombreCorto').touched;
  }

  get nombreCompletoValido() {
    return this.formdetalle.get('nombreCompleto').invalid && this.formdetalle.get('nombreCompleto').touched;
  }

  get fechaIncorporacionValido() {
    return this.formdetalle.get('fechaIncorporacion').invalid && this.formdetalle.get('fechaIncorporacion').touched;
  }

  get statusValido() {
    return this.formdetalle.get('status').invalid && this.formdetalle.get('status').touched;
  }

  crearFormulario() {
    this.formdetalle = this.fb.group({
      nombreCorto: [{value: '', disabled: true}, Validators.required ],
      fechaIncorporacion: [{value: '', disabled: true}, Validators.required ],
      nombreCompleto: [{value: '', disabled: true}, Validators.required ],
      url: [{value: '', disabled: true}, Validators.required ],
      status: [{value: '', disabled: true}, Validators.required ]
    });
  }

  cargarFormulario() {
    this.formdetalle.setValue({
      nombreCorto: this.corporativo.NombreCorto,
      fechaIncorporacion: this.corporativo.FechaIncorporacion,
      nombreCompleto: this.corporativo.NombreCompleto,
      url: this.corporativo.Url,
      status: this.corporativo.Status
    })
  }

  permitirEditar(ban?: Boolean) {
    this.editar = !this.editar;
    if ( this.editar ) {
      this.formdetalle.enable();
      this.formdetalle.get('url').disable();
    } else {
      this.formdetalle.disable();
      if (!ban) {
        this.cargarFormulario();
      }
    }
  }

  actualizarCorporativo() {
    if (this.formdetalle.invalid) {
      return;
    }

    const corporativo = this.transform.getDetalleCorporativo(this.corporativo.Id, this.formdetalle.value);

    this.corporativoService.setDetalleCorporativo(this.corporativo.Id, corporativo)
        .subscribe(resp => {
          this.mensaje = false;
        }, err => {
          console.log('No se pudo actualizar', err);
          this.mensaje = true;
        });

    if (!this.mensaje) {
      this.editar = !this.editar;
      this.formdetalle.disable();
    }
  }

}

