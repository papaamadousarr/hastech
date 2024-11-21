import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AppRoutingModule, routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { HttpClient, HttpHandler, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

// Démarrer l'application avec AppComponent comme composant standalone
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(AppRoutingModule),
  provideProtractorTestingSupport(),
  provideRouter(routes),
               ]
  }).catch((err) => console.error(err));
