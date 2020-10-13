import { Injectable } from '@angular/core';
import { Anchor } from '~/models/anchor';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AnchorService } from './anchor.service';

@Injectable({
  providedIn: 'root'
})
export class AnchorAllResolveService implements Resolve<Anchor[]> {

  constructor(private anchorService: AnchorService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Anchor[] | Observable<Anchor[]> | Promise<Anchor[]> {
    return this.anchorService.getAnchorsFull()
  }
}
