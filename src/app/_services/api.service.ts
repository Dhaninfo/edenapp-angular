import { Injectable, Inject, ɵConsole } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Stripe } from '../_models/stripe.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { share } from 'rxjs/operators';
// import { LOCAL_STORAGE } from '@ng-toolkit/universal'
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;
  token = '';
  private services = new BehaviorSubject('');
  selectedServices = this.services.asObservable();
  constructor(  private http: HttpClient) { }

  addService(service: string) {
    this.services.next(service)
  }
  insertPayment(Stripe: Stripe) {
    return this.http.post(this.baseUrl + 'add_payment', Stripe);
  }
  getPropertyDetails(address){
    // return this.http.get(this.baseUrl + 'getPropertyDetails/' + encodeURI(address));
    return this.http.get('http://demodhaninfo.com/melissa.php?address=' + encodeURI(address));
  }
}
