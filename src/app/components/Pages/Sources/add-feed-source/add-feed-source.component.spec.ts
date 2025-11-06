import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeedSourceComponent } from './add-feed-source.component';

describe('AddFeedSourceComponent', () => {
  let component: AddFeedSourceComponent;
  let fixture: ComponentFixture<AddFeedSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFeedSourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFeedSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
