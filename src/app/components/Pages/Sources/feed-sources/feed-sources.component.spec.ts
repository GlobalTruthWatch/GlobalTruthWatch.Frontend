import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedSourcesComponent } from './feed-sources.component';

describe('FeedSourcesComponent', () => {
  let component: FeedSourcesComponent;
  let fixture: ComponentFixture<FeedSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedSourcesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
