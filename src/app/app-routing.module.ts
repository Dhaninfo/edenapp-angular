import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { GrassCutComponent } from './services/grass-cut/grass-cut.component';
import { SnowRemovalComponent } from './services/snow-removal/snow-removal.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'get-a-quote/grass-cut', component: GrassCutComponent },
      { path: 'get-a-quote/snow-removal', component: SnowRemovalComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
