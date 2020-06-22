import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { TimeAgoPipe } from './main.pipes';

@NgModule({
  declarations: [MainComponent, TimeAgoPipe],
  imports: [CommonModule],
  exports: [MainComponent]
})
export class MainModule { }
