import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardWorkComponent } from './yard-work.component';

describe('YardWorkComponent', () => {
  let component: YardWorkComponent;
  let fixture: ComponentFixture<YardWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
