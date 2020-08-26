import { Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { StripeService, Element as StripeElement, ElementOptions, ElementsOptions } from "@nomadreservations/ngx-stripe";
import { Stripe } from '../../_models/stripe.model';
import { ApiService } from '../../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-grass-cut',
  templateUrl: './grass-cut.component.html',
  styleUrls: ['./grass-cut.component.scss']
})
export class GrassCutComponent implements OnInit {
  @ViewChild('mapRef', { read: ElementRef, static: true }) mapElement: ElementRef;
  @ViewChild('closebutton', { read: ElementRef, static: true }) closebutton: ElementRef;
  wpUrl = environment.wpUrl
  grassCutForm: FormGroup;
  private name: string;
  address: string;
  private email: string;
  private quoteData: any;
  element: StripeElement;
  stripeKey;
  error: any;
  complete = false;
  propertyObj;
  automatedPrice: boolean = false;
  tokenObj
  extraOption: string = ''
  property_size;
  packageType;
  price;
  subPackageType;
  submitted: boolean = false
  serviceType;
  currentRoute: string;
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#276fd3',
        lineHeight: '40px',
        fontWeight: 400,
        fontFamily: '"Work Sans", sans-serif',
        fontSize: '16px'
      }
    },
    hidePostalCode: true
  };

  //Set locale
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  constructor(
    private FormBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private _stripe: StripeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.grassCutForm = this.FormBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      area: ['', [Validators.required]],
      extraOptions: new FormGroup({
        initial: new FormControl(false),
        fallCleanup: new FormControl(false),
        gardenBeds: new FormControl(false),
        shrubs: new FormControl(false),
        leafCleanup: new FormControl(false)
      }),
      amount: ['']
    });
    window.scroll(0, 0);
    $(window).scroll(function () {
      var scrollDistance = $(window).scrollTop();
      // Assign active class to nav links while scolling
      $('.page-section').each(function (i) {
        if ($(this).position().top <= scrollDistance) {
          $('.navigation a.active').removeClass('active');
          $('.navigation a').eq(i).addClass('active');
        }
      });
    }).scroll();
    this.currentRoute = this.router.url.split('#')[0];
  }
  ngAfterViewInit() {
    (<any>window).googleMapsReady = this.onMapsReady.bind(this);
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleAPIKey + "&libraries=places&callback=googleMapsReady&libraries=geometry,drawing";

  }

  async onMapsReady() {
    await this.api.selectedServices.subscribe(
      message => {
        if (message) {
          this.quoteData = message.split('|');
          this.address = this.quoteData[0];
          this.name = this.quoteData[1];
          this.email = this.quoteData[2];
          if (this.name != '') {
            var fullName = this.name.split(' '),
              firstName = fullName[0],
              lastName = fullName[fullName.length - 1];
            this.grassCutForm.patchValue({ fname: firstName, lname: lastName, email: this.email });
          }
        }
      })
    this.getPropertyDetails(this.address);
    var brussels = new google.maps.LatLng(0, 0);
    var map = new google.maps.Map(document.getElementById("address_map"), {
      zoom: 22,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      zoomControl: false
    });
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: this.address }, (results, status) => {
      if (status === "OK") {
        map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: map,
          icon: '../../../../assets/images/map50x50.png',
          position: results[0].geometry.location
        });
      }
    });
    var marker = new google.maps.Marker({
      position: brussels,
      icon: '../../../../assets/images/map50x50.png',
    });
    marker.setMap(map);

  }
  get f() { return this.grassCutForm.controls; }
  getPropertyDetails(address) {
    this.spinner.show();
    this.api.getPropertyDetails(address).subscribe((data: any) => {

      this.propertyObj = data;
      if (this.propertyObj['data']['property_size'] != undefined) {
        if (this.propertyObj['data']['property_size'] > 0 && this.propertyObj['data']['property_size'] <= 2500) {
          this.property_size = 2500;
        }
        if (this.propertyObj['data']['property_size'] > 2500 && this.propertyObj['data']['property_size'] <= 5000) {
          this.property_size = 5000;
        }
        if (this.propertyObj['data']['property_size'] > 5000 && this.propertyObj['data']['property_size'] <= 7500) {
          this.property_size = 7500;
        }
        if (this.propertyObj['data']['property_size'] > 7500) {
          this.property_size = 10000;
        }
        this.automatedPrice = true;
        this.grassCutForm.patchValue({ area: this.property_size });
        this.packageType = 'weekly';
        this.getPackageType('basic',true);
        this.spinner.hide();
      } else {
        this.grassCutForm.patchValue({ area: '' });
        this.spinner.hide();
      }
    })
  }
  changePropertySize(event) {
    this.property_size = event.target.value;
    this.packageType = '';
    this.subPackageType = '';
    this.extraOption = '';
    Object.keys(this.grassCutForm.controls.extraOptions['controls']).forEach(key => {
      this.grassCutForm.controls.extraOptions['controls'][key].setValue(false)
    });
    this.price = '';
  }

  getPackage(type) {
    this.automatedPrice = false
    this.packageType = type;
    this.extraOption = '';
    Object.keys(this.grassCutForm.controls.extraOptions['controls']).forEach(key => {
      this.grassCutForm.controls.extraOptions['controls'][key].setValue(false)
    });
    this.subPackageType = '';
    this.price = '';
  }
  selectExtraOptions(option) {
    if (this.extraOption.indexOf(option) != -1) {
      var values = this.extraOption.split(',');
      for (var i = 0; i < values.length; i++) {
        if (values[i] == option) {
          values.splice(i, 1);
          this.extraOption = values.join(',');
        }
      }
    } else {
      this.extraOption = this.extraOption + ',' + option;
    }
  }
  cardUpdated(result) {
    this.element = result.element;
    this.complete = result.card.complete;
    this.error = undefined;
  }

  keyUpdated() {
    this._stripe.changeKey(this.stripeKey);
  }
  async getCardToken() {
    this.submitted = true;

    //prevent to submit form if any error occurs.
    if (this.packageType == '' || this.subPackageType == '') {
      return;
    }

    if (this.grassCutForm.invalid) {
      return;
    }
    console.log(this.grassCutForm.value);
    return;
  }
  getPackageType(package_type,isAutomated=false) {
    if(!isAutomated){
      this.automatedPrice = false
    }
    this.subPackageType = package_type;
    this.price = (this.packageType != undefined && this.property_size != undefined) ? this.getPrices()[this.property_size][this.packageType][package_type] : '';
  }

  changeService(seviceType) {
    this.serviceType = this.address + '|' + this.name + '|' + this.email;
    this.api.addService(this.serviceType);
    this.closebutton.nativeElement.click();
    this.router.navigate(['/get-a-quote/' + seviceType]);
  }

  getPrices() {
    return {
      2500: {
        weekly: {
          basic: "45",
          premium: "55",
        },
        bi_weekly: {
          basic: "60",
          premium: "75",
        },
        one_time: {
          under_6: "45",
          six_to_10: "90",
          over_10: '135'
        }
      },
      5000: {
        weekly: {
          basic: "50",
          premium: "60",
        },
        bi_weekly: {
          basic: "65",
          premium: "80",
        },
        one_time: {
          under_6: "50",
          six_to_10: "100",
          over_10: '150'
        }
      },
      7500: {
        weekly: {
          basic: "55",
          premium: "65",
        },
        bi_weekly: {
          basic: "70",
          premium: "85",
        },
        one_time: {
          under_6: "55",
          six_to_10: "110",
          over_10: '165'
        }
      },
      10000: {
        weekly: {
          basic: "60",
          premium: "70",
        },
        bi_weekly: {
          basic: "75",
          premium: "90",
        },
        one_time: {
          under_6: "60",
          six_to_10: "120",
          over_10: '180'
        }
      }
    }
  }
}
