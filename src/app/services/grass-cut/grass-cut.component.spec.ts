import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassCutComponent } from './grass-cut.component';

describe('GrassCutComponent', () => {
  let component: GrassCutComponent;
  let fixture: ComponentFixture<GrassCutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrassCutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrassCutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
