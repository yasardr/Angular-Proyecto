import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleCorporativo } from '../models/detalle-corporativo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CorporativosService } from '../services/corporativos.service';
import { TransformDataCorporativosService } from '../services/transform-data-corporativos.service';
import { Contacto } from '../models/contacto.model';
import Swal from 'sweetalert2';

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

  formdetalle: FormGroup;
  formcontacto: FormGroup;
  editar = false;
  mensaje = false;
  actualizar = false;
  limpiar = true;
  idContacto = 0;
  indexContacto = -1;
  fecha = {year: 2020, month: 10, day: 9};
  contactos: Contacto[] = [];
  corporativo: DetalleCorporativo = {
    Id: 0,
    Logo: '',
    NombreCorto: '',
    NombreCompleto: '',
    Url: '',
    FechaIncorporacion: {},
    Status: 0,
    Contactos: []
  };

  constructor(  private activatedRoute: ActivatedRoute, private fb: FormBuilder,
                private corporativoService: CorporativosService, private transform: TransformDataCorporativosService ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {corporativos: DetalleCorporativo}) => {
      this.corporativo = data.corporativos;
      this.contactos = data.corporativos.Contactos;
      this.cargarFormulario();
    });
  }

  // Validaciones de los campos del detalle corporativo
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

  // Validaciones de los campos de contacto

  get nombreValido() {
    return this.formcontacto.get('nombre').invalid && this.formcontacto.get('nombre').touched;
  }

  get puestoValido() {
    return this.formcontacto.get('puesto').invalid && this.formcontacto.get('puesto').touched;
  }

  get comentariosValido() {
    return this.formcontacto.get('comentarios').invalid && this.formcontacto.get('comentarios').touched;
  }

  get telefonoFijoValido() {
    return this.formcontacto.get('telefonoFijo').invalid && this.formcontacto.get('telefonoFijo').touched;
  }

  get telefonoMovilValido() {
    return this.formcontacto.get('telefonoMovil').invalid && this.formcontacto.get('telefonoMovil').touched;
  }

  get emailValido() {
    return this.formcontacto.get('email').invalid && this.formcontacto.get('email').touched;
  }


  crearFormulario() {
    this.formdetalle = this.fb.group({
      nombreCorto: [{value: '', disabled: true}, Validators.required ],
      fechaIncorporacion: [{value: '', disabled: true}, Validators.required ],
      nombreCompleto: [{value: '', disabled: true}, Validators.required ],
      url: [{value: '', disabled: true}, Validators.required ],
      status: [{value: '', disabled: true}, Validators.required ]
    });

    this.formcontacto = this.fb.group({
      nombre: ['' , Validators.required ],
      puesto: ['' , Validators.required ],
      comentarios: [''],
      telefonoFijo: ['' , Validators.pattern('^[0-9]{10}$') ],
      telefonoMovil: ['' , Validators.pattern('^[0-9]{10}$') ],
      email: ['' , [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ]
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
      this.corporativo.NombreCorto = this.formdetalle.value.nombreCorto;
      this.formdetalle.disable();
    }
  }

  accionContacto() {
    if (this.formcontacto.invalid) {
      return this.formcontacto.markAllAsTouched();
    }

    Swal.fire({
      title: 'Un momento',
      text: 'Guardando información.',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    if (this.actualizar) {
      //  Actualizar contacto
      const contacto = this.transform.getContacto(this.corporativo.Id, this.formcontacto.value);
      this.corporativoService.actualizaContacto(this.idContacto, contacto)
        .subscribe(res => {
          const aux = this.transform.getAgregaContacto(res.data);
          this.contactos.splice(this.indexContacto, 1, aux);
          this.idContacto = 0;
          this.indexContacto = -1;
          this.limpiar = true;
          this.actualizar = false;
          Swal.fire({
            title: 'Contacto editado',
            text: 'Se actualizó correctamente',
            icon: 'success'
          });
        });
    } else {
      // Crear contacto
      const contacto = this.transform.getContacto(this.corporativo.Id, this.formcontacto.value);
      this.corporativoService.crearContacto(contacto)
          .subscribe(resp => {
            const aux = this.transform.getAgregaContacto(resp.data);
            this.contactos.splice(this.contactos.length, 0, aux);
            this.limpiar = true;
            Swal.fire({
              title: 'Nuevo contacto',
              text: 'Se guardó correctamente',
              icon: 'success'
            });
          }, err => {
            console.log('No se pudo crear', err);
            this.limpiar = false;
          });
    }

    if (this.limpiar) {
      this.limpiarFormContacto();
    }

  }

  eliminarContacto(id: number, i: number) {
    this.actualizar = false;
    this.limpiarFormContacto();
    Swal.fire({
      title: 'Eliminación',
      text: '¿Estas seguro de eliminarlo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.contactos.splice(i, 1);
        this.corporativoService.eliminaContacto(id)
            .subscribe();
        Swal.fire(
          'Eliminado!',
          'Tu contacto ha sido eliminado',
          'success'
        )
      }
    });
  }

  // Llena los campos con infotmación del contacto seleccionado
  llenarCampos(i: number) {
    this.actualizar = true;

    const aux = this.contactos[i];

    this.idContacto = aux.Id;
    this.indexContacto = i;

    this.formcontacto.setValue({
      nombre: aux.Nombre,
      puesto: aux.Puesto,
      comentarios: aux.Comentarios,
      telefonoFijo: aux.TelefonoFijo,
      telefonoMovil: aux.TelefonoMovil,
      email: aux.Email
    });
  }

  private limpiarFormContacto() {
    this.formcontacto.reset({
      nombre: '',
      puesto: '',
      comentarios: '',
      telefonoFijo: '',
      telefonoMovil: '',
      email: ''
    });
  }

}

