import { Pipe, PipeTransform } from '@angular/core';
import { BodyPartService } from 'src/app/core/services/body-part.service';
import { BodyPartCategory } from '../utils/anatomy.enum';
import { BodyPart } from '../models/body-part.model';

@Pipe({
  name: 'idToBodyPart',
})
export class IdToBodyPartPipe implements PipeTransform {
  constructor(private bodyPartSvc: BodyPartService) {}
  transform(value: BodyPartCategory, key: keyof BodyPart = 'bodypartName'): any {
    return this.bodyPartSvc.getBodyPartById(+value)?.[key] ?? '';
  }
}


