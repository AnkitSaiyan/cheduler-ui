import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSelectedItemFormAnatomy',
  pure: false,
})
export class RemoveSelectedItemFormAnatomyPipe implements PipeTransform {
  public transform(items: any[], selectedValue: any): any {
    return items?.filter((value) => !selectedValue?.[`${value.bodyPart} [${value.bodyType}]`]?.find((val) => val.value === value.value));
  }
}


