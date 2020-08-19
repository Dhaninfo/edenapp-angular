import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable()
export class Updatenotification {
    @Output() fire: EventEmitter<any> = new EventEmitter();
    constructor() {}
 
    filter(filterBy: any) {
       this.fire.emit(filterBy);
    }
 
    getEmittedValue() {
       return this.fire;
    }

}