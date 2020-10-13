import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DescOptions } from '~/models/desc-options';
import { ReverseOptions } from '~/models/reverse-options';
import { Observable } from 'rxjs';
import { OptionService } from './option.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsResolveService implements Resolve<{ desc: DescOptions[], reverse: ReverseOptions[] }> {

  constructor(private optionsService: OptionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { desc: DescOptions[]; reverse: ReverseOptions[]; } | Observable<{ desc: DescOptions[]; reverse: ReverseOptions[]; }> | Promise<{ desc: DescOptions[]; reverse: ReverseOptions[]; }> {
    return this.optionsService.getOptions()
  }



}
