
import { Injectable } from '@angular/core';  
  
@Injectable()  
export class Paymentdata {  
  
  private data = {};  
  
  setOption(value) { 
    this.data = value;  
  }  
  
  getOption() {  
    return this.data;  
  }  
}
