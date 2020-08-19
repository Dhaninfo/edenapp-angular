import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../_services/api.service";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quoteForm: FormGroup;
  submitted: boolean = false;
  serviceType;
  currSerice: string = 'grass-cut';

  address: Object;
  establishmentAddress: Object;

  formattedAddress: string;
  formattedEstablishmentAddress: string;

  phone: string;

  constructor(
    private FormBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    public zone: NgZone
  ) { }

  ngOnInit() {
    this.quoteForm = this.FormBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['']
    });
    window.scroll(0, 0);
  }
  get f() { return this.quoteForm.controls; }
  getServiceType(event) {
    this.currSerice = event.target.value;
  }
  onSubmit() {
    this.submitted = true
    if (this.quoteForm.invalid) {
      return;
    }
    this.serviceType =  this.address + '|' + this.quoteForm.controls.name.value + '|' + this.quoteForm.controls.email.value;
    this.apiService.addService(this.serviceType);
    this.router.navigate(['/get-a-quote/' + this.currSerice]);
  }


  getAddress(place: object) {
   
    this.address = place['formatted_address'];
  }

}
