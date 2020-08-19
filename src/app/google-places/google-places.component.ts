import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
// import { } from "googlemaps";
import { environment } from 'src/environments/environment';
// import { environment } from '../../environments/environment';
declare var google: any;
@Component({
    selector: 'AutocompleteComponent',
    template: `
      <input class="input"
        type="text"  class="form-control p-4 border-0 rounded-0 bg-transparent"
        [(ngModel)]="autocompleteInput"
        #addresstext >
    `,
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext', { read: ElementRef, static: true }) addresstext: any;

    autocompleteInput: string;
    queryWait: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // var script = document.createElement("script");
        // script.type = "text/javascript";
        // document.getElementsByTagName("head")[0].appendChild(script);
        // script.src = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleAPIKey + "&libraries=places";
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
            {
                // componentRestrictions: { country: 'US' },
                types: [this.adressType]
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

}
