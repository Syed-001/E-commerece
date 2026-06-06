import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCatalogue } from './customer-catalogue';

describe('CustomerCatalogue', () => {
  let component: CustomerCatalogue;
  let fixture: ComponentFixture<CustomerCatalogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerCatalogue],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerCatalogue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
