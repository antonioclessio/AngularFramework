import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSwitchComponent } from './content-switch.component';

describe('ContentSwitchComponent', () => {
  let component: ContentSwitchComponent;
  let fixture: ComponentFixture<ContentSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
