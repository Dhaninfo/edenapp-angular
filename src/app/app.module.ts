import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/include/header/header.component';
import { FooterComponent } from './layout/include/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { GrassCutComponent } from './services/grass-cut/grass-cut.component';
import { SnowRemovalComponent } from './services/snow-removal/snow-removal.component';
import { NgxStripeModule } from '@nomadreservations/ngx-stripe';
import { environment } from '../environments/environment';
import { AutocompleteComponent } from './google-places/google-places.component';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GrassCutComponent,
    SnowRemovalComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxStripeModule.forRoot(environment.stripe_key),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
