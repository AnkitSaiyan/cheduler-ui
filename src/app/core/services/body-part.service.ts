import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, filter, map, takeUntil, tap } from 'rxjs';
import { BaseResponse } from 'src/app/shared/models/base-response.model';
import { BodyPart } from 'src/app/shared/models/body-part.model';
import { BodyType, ENG_BE } from 'src/app/shared/utils/const';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { ShareDataService } from 'src/app/services/share-data.service';

@Injectable({
  providedIn: 'root',
})
export class BodyPartService extends DestroyableComponent implements OnDestroy {
  private httpWithOutInterceptor: HttpClient;
  private SubDomain: string = '';
  private bodyPart$$ = new BehaviorSubject<BodyPart[]>([]);
  constructor(private httpBackend: HttpBackend, private sharedDataSvc: ShareDataService) {
    super();
    this.httpWithOutInterceptor = new HttpClient(this.httpBackend);
    this.SubDomain = window.location.host.split('.')[0];
    combineLatest([this.bodyPart$$, this.sharedDataSvc.getLanguage$()])
      .pipe(
        filter(([bodyPart]) => !!bodyPart.length),
        takeUntil(this.destroy$$),
      )
      .subscribe(([bodyPart, lang]) => this.setBodyPart(bodyPart, lang));
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private bodyPart = new Map<number | BodyType, BodyPart | BodyPart[]>();

  public allBodyPart$(): Observable<BodyPart[]> {
    return this.httpWithOutInterceptor
      .get<BaseResponse<BodyPart[]>>(`${environment.serverBaseUrl}/common/getbodyparts`, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(
        map((response) => response.data),
        tap((data) => this.bodyPart$$.next(data)),
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

  private setBodyPart(bodyParts: BodyPart[], lang: string) {
    const modifiedBodyPart = bodyParts.map((data) => ({ ...data, bodypartName: lang === ENG_BE ? data.bodypartName : data.bodypartNameNl }));
    this.bodyPart.set(BodyType.Common, modifiedBodyPart),
      this.bodyPart.set(BodyType.Male, []),
      this.bodyPart.set(BodyType.Female, []),
      modifiedBodyPart.forEach((bodyPart) => {
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



