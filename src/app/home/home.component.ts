import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../_services/api.service";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
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
  newadd: string
  name: string
  email: string
  formattedAddress: string;
  formattedEstablishmentAddress: string;

  phone: string;

  constructor(
    private FormBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public zone: NgZone,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit() {
    this.spinner.show();
    this.quoteForm = this.FormBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['']
    });
    window.scroll(0, 0);
    await this.activatedRoute.queryParams.subscribe(params => {
      this.newadd = params['address'];
      this.name = params['name'];
      this.email = params['email'];
    });
    this.submitForm();
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
    this.serviceType = this.address + '|' + this.quoteForm.controls.name.value + '|' + this.quoteForm.controls.email.value;
    this.apiService.addService(this.serviceType);
    this.router.navigate(['/get-a-quote/' + this.currSerice]);
  }
  submitForm() {
    this.serviceType = this.newadd + '|' + this.name + '|' + this.email;
    this.apiService.addService(this.serviceType);
    this.router.navigate(['/get-a-quote/grass-cut']);
  }

  // getAddress(place: object) {

  //   this.address = place['formatted_address'];
  // }

}
