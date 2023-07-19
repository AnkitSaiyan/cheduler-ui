import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSelectedItem',
})
export class RemoveSelectedItemPipe implements PipeTransform {
  public transform(value: any, formValue: any, index: any): any {
    const filterFormValue = formValue.filter((_, i) => i !== index).map((val: any) => val.exam);
    return value.filter((val) => !filterFormValue.find((item) => item === val.value));
  }
}
