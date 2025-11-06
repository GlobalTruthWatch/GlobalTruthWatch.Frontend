import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResquestComponent } from './all-resquest.component';

describe('AllResquestComponent', () => {
  let component: AllResquestComponent;
  let fixture: ComponentFixture<AllResquestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllResquestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllResquestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
