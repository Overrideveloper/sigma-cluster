import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MenuModule } from '../menu/menu.module';
import { MainModule } from '../main/main.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MenuModule,
    MainModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent }
    ])
  ],
  exports: [RouterModule]
})
export class HomeModule { }
