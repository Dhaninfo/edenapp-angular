import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { YardWorkComponent } from './services/yard-work/yard-work.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { LandscapeComponent } from './services/landscape/landscape.component';
import { AddSpacePipe } from './_services/add-space.pipe';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GrassCutComponent,
    SnowRemovalComponent,
    AutocompleteComponent,
    YardWorkComponent,
    LandscapeComponent,
    AddSpacePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgxStripeModule.forRoot(environment.stripe_key),
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
