import { ComponentRef } from '@angular/core';

import { StringLibrary } from './../../common/library/string.library';

export class TabStripItem {
    id: string = null;
    label: string = null;
    componentName: string = null;
    componentInstance: ComponentRef<any> = null;
    dataItemKey: any;
    multiple: boolean = false;

    constructor(label: string, componentName: string, multiple: boolean = true) {
        const stringLibrary = new StringLibrary();

        if (multiple) {
            const now: Date = new Date();
            this.id = stringLibrary.cleanText(label) + '_' + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
        } else {
            this.id = stringLibrary.cleanText(label);
        }
        this.label = label;
        this.componentName = componentName;

        this.multiple = multiple;
    }
}
