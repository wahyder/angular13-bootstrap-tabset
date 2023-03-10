import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetModule } from './tabset/tabset.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, NgbModule, NgbTabsetModule],
  providers: [],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
