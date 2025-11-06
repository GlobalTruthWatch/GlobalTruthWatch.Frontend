import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritersListComponent } from './writers-list.component';

describe('WritersListComponent', () => {
  let component: WritersListComponent;
  let fixture: ComponentFixture<WritersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WritersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
