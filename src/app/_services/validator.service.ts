import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  constructor() { }
  customCheckValidator(control: FormControl){
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'customCheck': true }
  }
}
