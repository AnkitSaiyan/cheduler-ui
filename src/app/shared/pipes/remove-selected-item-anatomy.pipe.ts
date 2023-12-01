import { Pipe, PipeTransform } from '@angular/core';
import { BodyPartService } from 'src/app/core/services/body-part.service';
import { SELECTED_EXAM } from '../utils/const';

@Pipe({
  name: 'removeSelectedItemFormAnatomy',
  pure: false,
})
export class RemoveSelectedItemFormAnatomyPipe implements PipeTransform {
  constructor(private bodyPartSvc: BodyPartService) {}
  public transform(items: any[], selectedValue: any): any {
    return items?.filter(
      (value) =>
        !selectedValue?.[
          this.bodyPartSvc.getBodyPartById(+value?.bodyPart)?.bodypartName
            ? `${this.bodyPartSvc.getBodyPartById(+value?.bodyPart)?.bodypartName} [${value.bodyType}]`
            : SELECTED_EXAM
        ]?.find((val) => val.value === value.value),
    );
  }
}











