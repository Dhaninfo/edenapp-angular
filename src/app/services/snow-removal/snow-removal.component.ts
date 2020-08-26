import { Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { StripeService, Element as StripeElement, ElementOptions, ElementsOptions } from "@nomadreservations/ngx-stripe";
import { Stripe } from '../../_models/stripe.model';
import { ApiService } from '../../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { requireCheckboxesToBeCheckedValidator } from '../../_services/validator.service'
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-snow-removal',
  templateUrl: './snow-removal.component.html',
  styleUrls: ['./snow-removal.component.scss']
})

export class SnowRemovalComponent implements OnInit {
  @ViewChild('mapRef', { read: ElementRef, static: true }) mapElement: ElementRef;
  @ViewChild('myModal', { static: true }) myModal: ElementRef;
  @ViewChild('closebutton', { read: ElementRef, static: true }) closebutton: ElementRef;
  @ViewChild('cancel', { read: ElementRef, static: true }) cancel: ElementRef;
  wpUrl = environment.wpUrl
  snowRemovalForm: FormGroup;
  private name: string;
  address: string;
  private email: string;
  private selectedShape: any;
  private quoteData: any;
  private shapeSize: any
  private driveway_size;
  element: StripeElement;
  stripeKey;
  error: any;
  complete = false;
  extraOption = '';
  packageType;
  price;
  serviceType = '';
  submitted: boolean = false;
  activeTab;
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
    this.snowRemovalForm = this.FormBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      driveway: ['', [Validators.required]],
      snowRemovalFor: new FormGroup({
        driveway: new FormControl(false),
        sidewalk: new FormControl(false),
      }, requireCheckboxesToBeCheckedValidator()),
      extraOptions: new FormGroup({
        frontDoorWalkway: new FormControl(false),
        stairsFrontLanding: new FormControl(false),
        sideDoorWalkway: new FormControl(false),
      }),
      citySideWalk: new FormControl(false),
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
  get f() { return this.snowRemovalForm.controls; }
  async onMapsReady() {
    this.spinner.show();
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
            this.snowRemovalForm.patchValue({ fname: firstName, lname: lastName, email: this.email });
          }
        }
      })
    var minZoomLevel = 22;
    var brussels = new google.maps.LatLng(0, 0);
    var map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: minZoomLevel,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      zoomControl: false
    });
    var map1 = new google.maps.Map(document.getElementById("address_map"), {
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
        map1.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: map1,
          icon: '../../../../assets/images/map50x50.png',
          position: results[0].geometry.location
        });
      } else {

      }
    });
    this.spinner.hide();
    var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true,
      position: google.maps.ControlPosition.BOTTOM_CENTER
    };

    let drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControlOptions: {
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON
        ]
      },
      polygonOptions: polyOptions,
      drawingControl: false,
      map: map
    });
    var marker = new google.maps.Marker({
      position: brussels,
      icon: '../../../../assets/images/map50x50.png',
    });
    var marker1 = new google.maps.Marker({
      position: brussels,
      icon: '../../../../assets/images/map50x50.png',
    });
    marker.setMap(map);
    marker1.setMap(map1);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {

      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);

        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        var newShape = e.overlay;
        newShape.type = e.type;

        google.maps.event.addListener(newShape, 'click', () => {

          this.setSelection(newShape);

        });
        this.shapeSize = newShape;
        var area = google.maps.geometry.spherical.computeArea(newShape.getPath());
        () => { this.setSelection(newShape); }
      }
    });
    // drawingManager.setDrawingMode(null);
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', () => { this.clearSelection; });
    google.maps.event.addListener(map, 'click', () => { this.clearSelection; });
    google.maps.event.addDomListener(document.getElementById('draw'), 'click', () => {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    });
    google.maps.event.addDomListener(document.getElementById('stop'), 'click', () => {
      //drawingManager.setDrawingMode(null);
      if (this.shapeSize) {
        this.shapeSize.setMap(null);
        document.getElementById("area").innerHTML = '';
        this.driveway_size = '';
        this.snowRemovalForm.patchValue({ driveway: this.driveway_size });
        this.price = null;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      }
    });
  }
  setSelection = (shape): void => {
    this.clearSelection();
    this.selectedShape = shape;
    shape.setEditable(true);
    google.maps.event.addListener(this.selectedShape.getPath(), 'set_at', this.calcar);
    google.maps.event.addListener(this.selectedShape.getPath(), 'insert_at', this.calcar);
  }
  clearSelection = (): void => {
    if (this.selectedShape) {
      this.selectedShape.setEditable(false);
      this.selectedShape = null;
    }
  }
  deleteSelectedShape() {
    if (this.shapeSize) {
      this.shapeSize.setMap(null);
      document.getElementById("area").innerHTML = '';
      this.driveway_size = '';
      this.snowRemovalForm.patchValue({ driveway: this.driveway_size });
      this.price = null;
    }
  }

  calcar() {
    if (!this.shapeSize) {
      return
    }
    var area = google.maps.geometry.spherical.computeArea(this.shapeSize.getPath());
    this.getAutometedDrivawayPrice(area);
    document.getElementById("area").innerHTML = 'Area is :' + area.toFixed(2) + ' sqft';
  }

  getAutometedDrivawayPrice(area) {
    if (area > 0 && area < 600) {
      this.driveway_size = 2;
    } else if (area >= 600 && area < 1200) {
      this.driveway_size = 4;
    } else if (area >= 1200 && area < 1800) {
      this.driveway_size = 6;
    } else if (area >= 1800 && area < 2400) {
      this.driveway_size = 8;
    } else if (area > 2400) {
      this.driveway_size = 10;
    }
    this.snowRemovalForm.patchValue({ driveway: this.driveway_size })
    this.resetExtraOptions();
    this.packageType = '';
    this.price = this.getDriveWayPrices()[this.driveway_size];
  }


  changeServiceType(value) {
    if (this.serviceType.indexOf(value) != -1) {
      var values = this.serviceType.split(',');
      for (var i = 0; i < values.length; i++) {
        if (values[i] == value) {
          values.splice(i, 1);
          this.serviceType = values.join(',');
        }
      }
    } else {
      this.serviceType = this.serviceType + ',' + value;
    }
    // this.serviceType = value;
    this.packageType = '';
    this.resetExtraOptions();
    this.driveway_size = '';
    this.activeTab = '';
    this.price = ''
  }

  changeActiveTab(type) {
    this.activeTab = type;
    setTimeout(() => {
      if ((this.serviceType.indexOf('driveway') != -1) && this.activeTab == 'mark_area' && !this.price) {
        this.myModal.nativeElement.click();
      }
    }, 15000);
  }

  enterDetailsManuly() {
    this.activeTab = 'enter_manually';
    this.cancel.nativeElement.click();
  }

  changeDriveWaySize(event) {
    this.driveway_size = event.target.value;
    this.resetExtraOptions();
    this.calculatePrice();
  }
  getPackage(type) {
    this.packageType = type;
    this.extraOption = '';
    this.resetExtraOptions();
    this.price = +this.getDriveWayPrices()[this.driveway_size];
  }
  resetExtraOptions() {
    this.extraOption = ''
    Object.keys(this.snowRemovalForm.controls.extraOptions['controls']).forEach(key => {
      this.snowRemovalForm.controls.extraOptions['controls'][key].setValue(false);
    });
    this.snowRemovalForm.controls.citySideWalk.setValue(false);
  }
  calculatePrice() {
    this.price = this.getDriveWayPrices()[this.driveway_size];
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
    if (this.packageType == '') {
      return;
    }

    if (this.snowRemovalForm.invalid) {
      return;
    }
    console.log(this.snowRemovalForm.value);
  }
  changeService(seviceType) {
    this.serviceType = this.address + '|' + this.name + '|' + this.email;
    this.api.addService(this.serviceType);
    this.closebutton.nativeElement.click();
    this.router.navigate(['/get-a-quote/' + seviceType]);
  }
  changeExtraOptions(option) {
    if (this.extraOption.indexOf(option) != -1) {
      var values = this.extraOption.split(',')
      for (var i = 0; i < values.length; i++) {
        if (values[i] == option) {
          values.splice(i, 1);
          this.extraOption = values.join(',');
        }
      }
      if (!this.snowRemovalForm.controls.citySideWalk.value && values.length == 0) {
        this.price = +this.getDriveWayPrices()[this.driveway_size];
      }
      if (this.snowRemovalForm.controls.citySideWalk.value && values.length == 0) {
        this.price = +this.price - 10;
      }
    } else {
      this.extraOption = (this.extraOption + ',' + option).replace(/^,/, '');
      var values = this.extraOption.split(',')
      if (!this.snowRemovalForm.controls.citySideWalk.value && values.length == 1) {
        this.price = +this.price + +this.getExtraOptionsPrices()[this.driveway_size];
      }
      if (this.snowRemovalForm.controls.citySideWalk.value && values.length == 1) {
        this.price = +this.price + 10;
      }
    }
  }
  changecitySideWalk() {
    if (this.snowRemovalForm.controls.citySideWalk.value && this.extraOption == '') {
      this.price = +this.price + +this.getExtraOptionsPrices()[this.driveway_size];
    }

    if (this.snowRemovalForm.controls.citySideWalk.value && this.extraOption != '') {
      this.price = +this.price + 10;
    }

    if (!this.snowRemovalForm.controls.citySideWalk.value && this.extraOption == '') {
      this.price = +this.getDriveWayPrices()[this.driveway_size];
    }

    if (!this.snowRemovalForm.controls.citySideWalk.value && this.extraOption != '') {
      this.price = +this.price - 10;
    }

  }
  getDriveWayPrices() {
    return {
      '2': '50',
      '4': '55',
      '5': '60',
      '8': '80',
      '10': '110'
    }
  }
  getSideWalkPrices() {
    return {
      'less_10': '40',
      '10_30': '50',
      'above_30': '60'
    }
  }
  getExtraOptionsPrices() {
    return {
      '2': '20',
      '4': '25',
      '5': '25',
      '8': '30',
      '10': '35'
    }
  }
}
