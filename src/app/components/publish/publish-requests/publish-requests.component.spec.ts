import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishRequestsComponent } from './publish-requests.component';

describe('PublishRequestsComponent', () => {
  let component: PublishRequestsComponent;
  let fixture: ComponentFixture<PublishRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublishRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
