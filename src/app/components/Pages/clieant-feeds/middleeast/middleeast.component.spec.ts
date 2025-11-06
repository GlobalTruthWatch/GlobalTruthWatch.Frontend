import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddleeastComponent } from './middleeast.component';

describe('MiddleeastComponent', () => {
  let component: MiddleeastComponent;
  let fixture: ComponentFixture<MiddleeastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiddleeastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiddleeastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
