import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ComponentLibrary } from './../../../../common/library/component.library';
import { ModalService } from './../../../../components/modal/modal.service';
import { DataFormBaseComponent } from '../data-form-base.component';

declare let $: any;

@Component({
  selector: 'cl-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss'],
  providers: [ComponentLibrary, ModalService]
})
export class DataFormComponent extends DataFormBaseComponent implements OnChanges {

  @Input() fieldName: string = null;

  ngOnChanges(e: SimpleChanges): void {
  }

}
