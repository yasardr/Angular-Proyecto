import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Corporativo } from './models/corporativo.model';
import { CorporativosService } from './services/corporativos.service';

@Injectable({
  providedIn: 'root'
})
export class CorporativosResolverGuard implements Resolve<any> {
  constructor( private corporativosService: CorporativosService,
               private router: Router ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Corporativo | Observable<Corporativo> | Promise<Corporativo> {
    if (route.paramMap.has('id')) {
      return this.corporativosService.getDetalleCorporativo(parseInt(route.paramMap.get('id'), 10)).pipe(catchError(err => {
        this.router.navigate(['/dashboard']);
        return EMPTY;
      }));
    } else {
      return this.corporativosService.getCorporativos();
    }
  }
}
