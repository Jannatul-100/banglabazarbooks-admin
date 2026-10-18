import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChatComponent } from './bar-chat.component';

describe('BarChatComponent', () => {
  let component: BarChatComponent;
  let fixture: ComponentFixture<BarChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
