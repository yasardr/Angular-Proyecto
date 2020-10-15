import { Injectable } from '@angular/core';
import { Corporativo } from '../models/corporativo.model';
import { DetalleCorporativo } from '../models/detalle-corporativo.model';

@Injectable({
  providedIn: 'root'
})
export class TransformDataCorporativosService {

  constructor() { }

   /**
   * Transforma el corporativo-detalle en un objeto
   * para poder realizar el PUT correcto
   */
  getDetalleCorporativo(id: number, data: any) {
    const corporativo = {
      id: id,
      S_NombreCorto: data.nombreCorto,
      S_NombreCompleto: data.nombreCompleto,
      S_LogoURL: 'https://devschoolcloud.com/api/public/logos/Ps1n80pFAphZ2bgEKdWtXE32qviJUixvgxc2RbB8.jpeg',
      S_Activo: parseInt(data.status, 10),
      FK_Asignado_id: 2,
      D_FechaIncorporacion: this.getFechaIncorporacionJSON(data.fechaIncorporacion)
    }

    return corporativo;
  }

  /**
   * Transforma la data que recibe en un objeto con
   * la información que se requiere para corporativos-list
   */
  getDataCorporativos(data: any[]): Corporativo[] {
    const corporativos = [];

    if ( !data || data.length < 0) {
      return corporativos;
    }

    let aux: Corporativo = null;

    data.forEach(corporativo => {
      aux = {
        Id: corporativo.id,
        Logo: corporativo.S_LogoURL,
        NombreCorto: corporativo.S_NombreCorto,
        NombreCompleto: corporativo.S_NombreCompleto,
        Url: `devschoolcloud.com/sa/#/${corporativo.S_SystemUrl}`,
        FechaIncorporacion: corporativo.D_FechaIncorporacion,
        FechaCreacion: corporativo.created_at,
        UsrCreador: corporativo['user_created'].S_Nombre,
        UsrAsignado: corporativo['asignado'].S_Nombre,
        Status: this.getStatus(corporativo.S_Activo),
      }
      corporativos.push(aux);
    });

    return corporativos;
  }

  /**
   * Transforma la data que recibe en un objeto con
   * la información que se requiere para corporativos-detalle
   */
  getDataDetalleCorporativo(data: any): DetalleCorporativo {
    let corporativo: DetalleCorporativo = {
      Id: 0,
      Logo: '',
      NombreCorto: '',
      NombreCompleto: '',
      Url: '',
      FechaIncorporacion: '',
      Status: 0
    };

    if ( !data ) {
      return corporativo;
    }

    corporativo = {
      Id: data.id,
      Logo: data.S_LogoURL,
      NombreCorto: data.S_NombreCorto,
      NombreCompleto: data.S_NombreCompleto,
      Url: data.S_SystemUrl,
      FechaIncorporacion: this.getFechaIncorporacion(data.D_FechaIncorporacion),
      Status: data.S_Activo
    };

    return corporativo;
  }

  /**
   * Tranforma la fecha a un arreglo para manejarlo en corporativos-detalle
   * "2020-09-11 00:00:00" => {year: 2020, month: 09, day: 11}
   */
  private getFechaIncorporacion(fechaInc: string): any {
    const fecha = fechaInc.split(' ');
    const elementos = fecha[0].split('-');
    const obj = {
      year: parseInt(elementos[0], 10),
      month: parseInt(elementos[1], 10),
      day: parseInt(elementos[2], 10)
    }
    return obj;
  }

  /**
   * Tranforma la fecha en formato de arreglo a un string
   * {year: 2020, month: 09, day: 11} => "2020-09-11"
   */
  private getFechaIncorporacionJSON(fechaInc: any): any {
    const year = fechaInc.year;
    let month = fechaInc.month;
    let day = fechaInc.day;

    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  }

  /**
   * Tranforma el satus de tipo number al string correspondiente
   */
  private getStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Inactivo';
      case 1:
        return 'Activo';
      default:
        return 'Inactivo';
    }
  }

}
