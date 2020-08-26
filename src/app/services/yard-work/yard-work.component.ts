import { Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from '../../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-yard-work',
  templateUrl: './yard-work.component.html',
  styleUrls: ['./yard-work.component.scss']
})
export class YardWorkComponent implements OnInit {
 
@ViewChild('closebutton', { read: ElementRef, static: true }) closebutton: ElementRef;
wpUrl = environment.wpUrl
currentRoute: string;
  constructor(
    private FormBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ) { }
  yardWorkForm: FormGroup;
  subServiceType: String;
  serviceType;
  check: boolean;
  private name: string;
   address: string;
  private email: string;
  private quoteData: any;
  imageSrc: string;
  previewUrl: any = [];
  fileData: File = null;
  subServices = ['Initial Cleanup','Shrubs', 'Fall Cleanup',
                  'Leaf Cleanup / Removal', 'Organic Weed Control',
                  'Other','Garden Beds'];
  selectedServices = [];
  ngOnInit() {
    this.yardWorkForm = this.FormBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required]],
      area: ['', [Validators.required]],
      extraOptions: ['', Validators.required],
      amount: ['']
    });
    window.scroll(0, 0);
    $(window).scroll(function() {
      var scrollDistance = $(window).scrollTop();
      // Assign active class to nav links while scolling
      $('.page-section').each(function(i: any) {
          if ($(this).position().top <= scrollDistance) {
              $('.navigation a.active').removeClass('active');
              $('.navigation a').eq(i).addClass('active');
          }
      });
  }).scroll();
  $(".myaccordion").on("hide.bs.collapse show.bs.collapse", (e: { target: any; }) => {
    $(e.target)
      .prev()
      .find("i:last-child")
      .toggleClass("fa-minus fa-plus");
  });
  this.currentRoute = this.router.url.split('#')[0];
  }
  get f() { return this.yardWorkForm.controls; }
  ngAfterViewInit() {
    (<any>window).googleMapsReady = this.onMapsReady.bind(this);
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleAPIKey + "&libraries=places&callback=googleMapsReady&libraries=geometry,drawing";

  }
  onFileChange(fileInput: any){
    this.fileData = <File>fileInput.target.files[0];
    var path = this.fileData.name;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (e) => { 
      this.previewUrl.push(reader.result); 
    }
  }
  async onMapsReady() {
   
    await this.api.selectedServices.subscribe(
      message => {
        if (message) {
          this.quoteData = message.split('|');
          this.address = this.quoteData[0];
          this.name = this.quoteData[1];
          this.email = this.quoteData[2];
          if (this.name!='') {
            var fullName = this.name.split(' '),
            firstName = fullName[0],
            lastName = fullName[fullName.length - 1];
            this.yardWorkForm.patchValue({ fname: firstName,lname:lastName, email: this.email });
          }
        }
      })
    var brussels = new google.maps.LatLng(0, 0);
    var map = new google.maps.Map(document.getElementById("address_map"), {
      zoom: 22,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      zoomControl: false
    });
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.address }, (results: { geometry: { location: any; }; }[], status: string) => {
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
  getData(e: { target: { value: String; checked: any; }; }){
    this.subServiceType = e.target.value;
    this.check = e.target.checked;
    if(this.check){
      this.selectedServices.push(this.subServiceType);
      document.getElementById('yardwork').style.display = 'block';
      document.getElementById('headingOne').style.display = 'block';
    }else{
      const index = this.selectedServices.indexOf(this.subServiceType, 0);
      if (index > -1) {
              this.selectedServices.splice(index, 1);
        }
    }
    
  }
  changeService(seviceType) {
    this.serviceType = this.address + '|' + this.name + '|' + this.email;
    this.api.addService(this.serviceType);
    this.closebutton.nativeElement.click();
    this.router.navigate(['/get-a-quote/'+seviceType]);
  }

}
