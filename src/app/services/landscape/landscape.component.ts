import { Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-landscape',
  templateUrl: './landscape.component.html',
  styleUrls: ['./landscape.component.scss']
})
export class LandscapeComponent implements OnInit {
  @ViewChild('closebutton', { read: ElementRef, static: true }) closebutton: ElementRef;
  wpUrl = environment.wpUrl
  currentRoute;
  serviceType;
  private name: string;
  address: string;
  private email: string;
  landImprovementCheckedVal: Array<string> = [];
  hardScapingCheckedVal: Array<string> = [];
  imgURL = {};
  tempImg: any = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
) { }
  lawnImrovements = ['aeration', 'artificial_grass', 'dethatching', 'fertilizer', 'organic_weed_control', 'sodding', 'top_dressing', 'other']
  hardScaping = ['aspalt', 'concrete', 'fireplace_install', 'flagstone', 'outdoor_kitchens', 'paving_and_sealing', 'retaining_walls', 'rockery', 'other']
  ngOnInit() {
    this.currentRoute = this.router.url.split('#')[0];
  }
  getlawnImprovementItems(item) {
    const index: number = this.landImprovementCheckedVal.indexOf(item);
    if (index != -1) {
      this.landImprovementCheckedVal.splice(index, 1);
    } else {
      this.landImprovementCheckedVal.push(item);
    }

  }
  gethardScapingItems(item) {
    const index: number = this.hardScapingCheckedVal.indexOf(item);
    if (index != -1) {
      this.hardScapingCheckedVal.splice(index, 1);
    } else {
      this.hardScapingCheckedVal.push(item);
    }
  }
  uploadImage(event, item) {
    this.tempImg = [];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e) => {
      if (item in this.imgURL) {
        this.tempImg = this.imgURL[item];
        this.tempImg.push(reader.result)
        this.imgURL[item] = this.tempImg
      } else {
        this.tempImg.push(reader.result)
        this.imgURL[item] = this.tempImg
      }
    }
  }
  removeImage(item,i){
    this.imgURL[item].splice(i,1)
  }
  changeService(seviceType) {
    this.serviceType = this.address + '|' + this.name + '|' + this.email;
    this.api.addService(this.serviceType);
     this.closebutton.nativeElement.click();
    this.router.navigate(['/get-a-quote/' + seviceType]);
  }
}
