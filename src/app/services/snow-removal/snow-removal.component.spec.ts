import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnowRemovalComponent } from './snow-removal.component';

describe('SnowRemovalComponent', () => {
  let component: SnowRemovalComponent;
  let fixture: ComponentFixture<SnowRemovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnowRemovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnowRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
