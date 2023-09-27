import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { BaseResponse } from 'src/app/shared/models/base-response.model';
import { BodyPart } from 'src/app/shared/models/body-part.model';
import { BodyType } from 'src/app/shared/utils/const';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class BodyPartService {
  private httpWithOutInterceptor: HttpClient;
  private SubDomain: string = '';
  constructor(private httpBackend: HttpBackend, private loaderSvc: LoaderService) {
    this.httpWithOutInterceptor = new HttpClient(this.httpBackend);
    this.SubDomain = window.location.host.split('.')[0];
  }

  private bodyPart = new Map<number | BodyType, BodyPart | BodyPart[]>();

  public allBodyPart$(): Observable<BodyPart[]> {
    return this.httpWithOutInterceptor
      .get<BaseResponse<BodyPart[]>>(`${environment.serverBaseUrl}/common/getbodyparts`, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(
        map((response) => response.data),
        tap(this.setBodyPart.bind(this)),
      );
  }

  public get maleBodyPart(): BodyPart[] {
    return this.bodyPart.get(BodyType.Male) as BodyPart[];
  }

  public get femaleBodyPart(): BodyPart[] {
    return this.bodyPart.get(BodyType.Female) as BodyPart[];
  }

  public get commonBodyPart(): BodyPart[] {
    return this.bodyPart.get(BodyType.Common) as BodyPart[];
  }

  public getBodyPartById(id: number): BodyPart {
    return this.bodyPart.get(id) as BodyPart;
  }

  public getBodyPartByType(type: BodyType): BodyPart[] {
    return this.bodyPart.get(type) as BodyPart[];
  }

  private setBodyPart(bodyParts: BodyPart[]) {
    this.bodyPart.set(BodyType.Common, bodyParts),
      this.bodyPart.set(BodyType.Male, []),
      this.bodyPart.set(BodyType.Female, []),
      bodyParts.forEach((bodyPart) => {
        this.bodyPart.set(bodyPart.id, bodyPart);
        if (bodyPart.isMale) {
          this.bodyPart.set(BodyType.Male, [...(this.bodyPart.get(BodyType.Male) as BodyPart[]), bodyPart]);
        }
        if (bodyPart.isFemale) {
          this.bodyPart.set(BodyType.Female, [...(this.bodyPart.get(BodyType.Female) as BodyPart[]), bodyPart]);
        }
      });
  }
}


