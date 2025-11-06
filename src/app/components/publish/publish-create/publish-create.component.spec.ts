import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishCreateComponent } from './publish-create.component';

describe('PublishCreateComponent', () => {
  let component: PublishCreateComponent;
  let fixture: ComponentFixture<PublishCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublishCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
