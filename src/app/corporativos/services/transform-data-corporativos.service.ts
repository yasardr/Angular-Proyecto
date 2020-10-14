import { Injectable } from '@angular/core';
import { Corporativo } from '../models/corporativo.model';
import { DetalleCorporativo } from '../models/detalle-corporativo.model';

@Injectable({
  providedIn: 'root'
})
export class TransformDataCorporativosService {

  constructor() { }

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
      FechaIncorporacion: data.D_FechaIncorporacion,
      Status: data.S_Activo
    };

    return corporativo;
  }

  /**
   * Tranforma el satus de tipo number al string correspondiente 
   */
  private getStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Activo';
      case 2:
        return 'Inactivo';
      default:
        return 'Inactivo';
    }
  }

}
