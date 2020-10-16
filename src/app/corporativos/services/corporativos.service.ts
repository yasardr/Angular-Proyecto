import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { TransformDataCorporativosService } from './transform-data-corporativos.service';

@Injectable({
  providedIn: 'root'
})
export class CorporativosService {
  public apiURL = environment.apiURL;
  public auth_token = 'Bearer ' + localStorage.getItem('tokenscloud');

  constructor( private http: HttpClient,
               private transform: TransformDataCorporativosService ) { }

  getQuery( query: string ): any {
    const headers = new HttpHeaders({
      Authorization: this.auth_token
    });

    return this.http.get(`${this.apiURL}${query}`, { headers });
  }

  /**
   * Realiza petición para retornar la lista de corporativos
   */
  getCorporativos(): Observable<any> {
    return this.getQuery(`/corporativos`)
                  .pipe( map( data => {
                    return this.transform.getDataCorporativos(data[`data`]);
                  }));
  }

  /**
   * Realiza petición para retornar detalles del corporativo seleccionado
   */
  getDetalleCorporativo(id: number): Observable<any> {
    return this.getQuery(`/corporativos/${ id }`)
                  .pipe( map( data => {
                    return this.transform.getDataDetalleCorporativo(data[`data`].corporativo);
                  }));
  }

  /**
   * Realiza una actualización del corporativo-detalle
   */
  setDetalleCorporativo(id: number, corporativo: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.auth_token
    });

    return this.http.put(`${this.apiURL}/corporativos/${ id }`, corporativo, { headers });
  }

  /**
   * Crea un contacto nuevo en el corporativo
   */
  crearContacto(contacto: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.auth_token
    });

    return this.http.post(`${this.apiURL}/contactos`, contacto, { headers });
  }

  /**
   * Actualiza un contacto seleccionado en el corporativo
   */
  actualizaContacto(id: number, contacto: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.auth_token
    });

    return this.http.put(`${this.apiURL}/contactos/${id}`, contacto, { headers });
  }

  /**
   * Elimina un contacto en el corporativo
   */
  eliminaContacto(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.auth_token
    });

    return this.http.delete(`${this.apiURL}/contactos/${id}`, { headers });
  }

}
