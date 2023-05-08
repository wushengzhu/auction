import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidRecordComponent } from './bid-record.component';

describe('BidRecordComponent', () => {
  let component: BidRecordComponent;
  let fixture: ComponentFixture<BidRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
