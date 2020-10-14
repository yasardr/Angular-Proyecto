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
    const url = `/api/public/${ query }`;

    const headers = new HttpHeaders({
      Authorization: this.auth_token
    });

    return this.http.get(url, { headers });
    // return this.http.get(`${this.apiURL}/corporativos/`, { headers });
  }

  /**
   * Realiza petición para retornar la lista de corporativos
   */
  getCorporativos(): Observable<any> {
    return this.getQuery(`corporativos/`)
                  .pipe( map( data => {
                    return this.transform.getDataCorporativos(data[`data`]);
                  }));
  }

  /**
   * Realiza petición para retornar detalles del corporativo seleccionado
   */
  getDetalleCorporativo(id: number): Observable<any> {
    return this.getQuery(`corporativos/${ id }`)
                  .pipe( map( data => {
                    return this.transform.getDataDetalleCorporativo(data[`data`].corporativo);
                  }));
  }

}
