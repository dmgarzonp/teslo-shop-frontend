import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/form-util';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
})
export class FormErrorLabel {
  control = input<AbstractControl>();

  get errorMessage(){
    const errors: ValidationErrors = this.control()?.errors || {};

    return this.control()?.touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)
      : null;

  }
 }
