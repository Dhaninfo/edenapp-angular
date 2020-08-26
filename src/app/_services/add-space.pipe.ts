import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addSpace'
})
export class AddSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
        if(value){
          // return value? value.replace(/_/g, " ") : value;
          return value? value.split('_').map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' '):value
        }
       
      }

}
