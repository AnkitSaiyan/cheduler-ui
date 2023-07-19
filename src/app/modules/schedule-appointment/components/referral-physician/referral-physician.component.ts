import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter, takeUntil, map } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { QrModalComponent } from 'src/app/shared/components/qr-modal/qr-modal.component';
import { NameValue } from 'src/app/shared/models/name-value.model';

@Component({
  selector: 'dfm-referral-physician',
  templateUrl: './referral-physician.component.html',
  styleUrls: ['./referral-physician.component.scss']
})
export class ReferralPhysicianComponent extends DestroyableComponent implements OnInit, OnDestroy {
    public examForm!: FormGroup;
  
    public filteredPhysicians$$ = new BehaviorSubject<NameValue[] | null>(null);
  
    public filteredExams$$ = new BehaviorSubject<NameValue[] | null>(null);
  
    public siteDetails$$: BehaviorSubject<any>;
  
    
  
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private scheduleAppointmentSvc: ScheduleAppointmentService,
      public loaderSvc: LoaderService,
      private landingService: LandingService,
      private modalSvc: ModalService,
      
    ) {
      super();
      this.siteDetails$$ = new BehaviorSubject<any[]>([]);
      this.router.events
      .pipe(
        filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd),
        takeUntil(this.destroy$$))
      .subscribe((event) => {
        if (event.id === 1 && event.url === event.urlAfterRedirects) 
          this.landingService.siteDetails$.pipe(takeUntil(this.destroy$$)).subscribe((res) => 
            this.siteDetails$$.next(res?.data)            
          )
      });
    }
  
    public ngOnInit(): void {  
      this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}')?.data);
  
      this.scheduleAppointmentSvc.physicians$
        .pipe(
          map((staff) => staff.map(({ firstname, id }) => ({ name: firstname, value: id }))),
          takeUntil(this.destroy$$),
        )
        .subscribe({
          next: (staffs) => this.filteredPhysicians$$.next(staffs),
        });
      
        this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe({
          next: (examDetails) => {
            if (localStorage.getItem('appointmentDetails')) {
              this.createForm(examDetails);
            } else {
              this.createForm(examDetails);
            }
          },
        });
      }
  
    override ngOnDestroy() {
      super.ngOnDestroy();
    }
  
    private createForm(examDetails?) {
      this.examForm = this.fb.group({
        physician: [examDetails?.physician ? examDetails.physician : '', []],
      })
    }
  
    public saveExamDetails() {
      if (this.examForm.invalid) {
        this.examForm.markAllAsTouched();
        return;
      }
      this.router.navigate(['../exam'], { relativeTo: this.route, replaceUrl: true });

    }
  
  
    
  
    public uploadDocumentFromMobile(){
      const modalRef = this.modalSvc.open(QrModalComponent, {});
  
      // modalRef.closed
      //   .pipe(
      //     filter((res) => !!res),
      //     take(1),
      //   )
      //   .subscribe({
      //     next: () => 
      //   });
    }
  }
