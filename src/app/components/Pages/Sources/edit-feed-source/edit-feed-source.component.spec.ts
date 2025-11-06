import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedSourceComponent } from './edit-feed-source.component';

describe('EditFeedSourceComponent', () => {
  let component: EditFeedSourceComponent;
  let fixture: ComponentFixture<EditFeedSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeedSourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFeedSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
