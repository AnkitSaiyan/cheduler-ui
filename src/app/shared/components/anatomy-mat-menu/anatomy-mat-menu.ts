import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class AnatomyMatMenu<T> implements OnDestroy {
  protected destroy$$ = new Subject();
  private openedElement: { category: T; element: any }[] = [];
  private clearTimeout!: any;

  public onMouseLeave(element: any, category: T, isFromModal: boolean = false) {
    if (this.clearTimeout) clearTimeout(this.clearTimeout);
    this.openedElement.push({ category, element });

    this.clearTimeout = setTimeout(() => {
      this.openedElement = this.openedElement.filter((value) => {
        value.element.closeMenu();
        return false;
      });
    }, 100);
    if (isFromModal) {
      clearTimeout(this.clearTimeout);
      element.closeMenu();
    }
  }
  public onMouseEnter(element: any, category: T) {
    this.openedElement = this.openedElement.filter((value) => {
      if (value.category !== category) {
        value.element.closeMenu();
        return false;
      }
      if (value.category === category) return false;
      return true;
    });
  }

  private destroy() {
    this.destroy$$.next('');
    this.destroy$$.unsubscribe();
  }

  public ngOnDestroy() {
    this.destroy();
    clearTimeout(this.clearTimeout);
  }
}

