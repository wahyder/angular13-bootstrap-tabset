/* eslint-disable */
/* eslint-disable deprecation/deprecation */
import {
  AfterContentChecked,
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { VkTabsetConfig } from './tabset-config';

let nextId = 0;

@Directive({ selector: 'ng-template[ngbTabTitle]' })
export class NgbTabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({ selector: 'ng-template[ngbTabContent]' })
export class NgbTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({ selector: 'ngb-tab' })
export class NgbTab implements AfterContentChecked {
  /**
   * The tab identifier.
   *
   * Must be unique for the entire document for proper accessibility support.
   */
  @Input() id = `ngb-tab-${nextId++}`;

  @Input() title: string;

  /**
   * If `true`, the current tab is disabled and can't be toggled.
   */
  @Input() disabled = false;

  titleTpl: NgbTabTitle | null;
  contentTpl: NgbTabContent | null;

  @ContentChildren(NgbTabTitle, { descendants: false })
  titleTpls: QueryList<NgbTabTitle>;
  @ContentChildren(NgbTabContent, { descendants: false })
  contentTpls: QueryList<NgbTabContent>;

  ngAfterContentChecked() {
    this.titleTpl = this.titleTpls.first;
    this.contentTpl = this.contentTpls.first;
  }
}

export interface NgbTabChangeEvent {
  /**
   * The id of the currently active tab.
   */
  activeId: string;

  /**
   * The id of the newly selected tab.
   */
  nextId: string;

  /**
   * Calling this function will prevent tab switching.
   */
  preventDefault: () => void;
}

@Component({
  selector: 'ngb-tabset',
  exportAs: 'ngbTabset',
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- eslint-disable -->
    <ul [class]="'nav nav-' + type + (orientation == 'horizontal'?  ' ' + justifyClass : ' flex-column')" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs">
        <a [id]="tab.id" class="nav-link" [class.active]="tab.id === activeId" [class.disabled]="tab.disabled"
          href (click)="select(tab.id); $event.preventDefault()" role="tab" [attr.tabindex]="(tab.disabled ? '-1': undefined)"
          [attr.aria-controls]="(!destroyOnHide || tab.id === activeId ? tab.id + '-panel' : null)"
          [attr.aria-selected]="tab.id === activeId" [attr.aria-disabled]="tab.disabled">
          {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef || null"></ng-template>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div
          class="tab-pane {{tab.id === activeId ? 'active' : null}}"
          *ngIf="!destroyOnHide || tab.id === activeId"
          role="tabpanel"
          [attr.aria-labelledby]="tab.id" id="{{tab.id}}-panel">
          <ng-template [ngTemplateOutlet]="tab.contentTpl?.templateRef || null"></ng-template>
        </div>
      </ng-template>
    </div>
  `,
})
export class NgbTabset implements AfterContentChecked {
  static ngAcceptInputType_justify: string;
  static ngAcceptInputType_orientation: string;

  justifyClass: string;

  @ContentChildren(NgbTab) tabs: QueryList<NgbTab>;

  /**
   * The identifier of the tab that should be opened **initially**.
   *
   * For subsequent tab switches use the `.select()` method and the `(tabChange)` event.
   */
  @Input() activeId: string;

  /**
   * If `true`, non-visible tabs content will be removed from DOM. Otherwise it will just be hidden.
   */
  @Input() destroyOnHide = true;

  /**
   * The horizontal alignment of the tabs with flexbox utilities.
   */
  @Input()
  set justify(className: 'start' | 'center' | 'end' | 'fill' | 'justified') {
    if (className === 'fill' || className === 'justified') {
      this.justifyClass = `nav-${className}`;
    } else {
      this.justifyClass = `justify-content-${className}`;
    }
  }

  /**
   * The orientation of the tabset.
   */
  @Input() orientation: 'horizontal' | 'vertical';

  /**
   * Type of navigation to be used for tabs.
   *
   * Currently Bootstrap supports only `"tabs"` and `"pills"`.
   *
   * Since `3.0.0` can also be an arbitrary string (ex. for custom themes).
   */
  @Input() type: 'tabs' | 'pills' | string;

  @Output() tabChange = new EventEmitter<NgbTabChangeEvent>();

  constructor(config: VkTabsetConfig) {
    this.type = config.type;
    this.justify = config.justify;
    this.orientation = config.orientation;
  }

  /**
   * Selects the tab with the given id and shows its associated content panel.
   *
   * Any other tab that was previously selected becomes unselected and its associated pane is removed from DOM or
   * hidden depending on the `destroyOnHide` value.
   */
  select(tabId: string) {
    let selectedTab = this._getTabById(tabId);
    if (
      selectedTab &&
      !selectedTab.disabled &&
      this.activeId !== selectedTab.id
    ) {
      let defaultPrevented = false;

      this.tabChange.emit({
        activeId: this.activeId,
        nextId: selectedTab.id,
        preventDefault: () => {
          defaultPrevented = true;
        },
      });

      if (!defaultPrevented) {
        this.activeId = selectedTab.id;
      }
    }
  }

  ngAfterContentChecked() {
    // auto-correct activeId that might have been set incorrectly as input
    let activeTab = this._getTabById(this.activeId);
    this.activeId = activeTab
      ? activeTab.id
      : this.tabs.length
      ? this.tabs.first.id
      : <any>null;
  }

  private _getTabById(id: string): NgbTab {
    let tabsWithId: NgbTab[] = this.tabs.filter((tab) => tab.id === id);
    return tabsWithId.length ? tabsWithId[0] : <any>null;
  }
}
