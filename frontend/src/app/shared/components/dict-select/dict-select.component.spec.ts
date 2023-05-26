import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictSelectComponent } from './dict-select.component';

describe('DictSelectComponent', () => {
  let component: DictSelectComponent;
  let fixture: ComponentFixture<DictSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
