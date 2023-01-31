import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-course';

  language: string = '';
  listofLanguage: string[] = ['Marathi', 'Hindi', 'English'];

  addLanguage() {
    console.log('addLanguage() is called');

    this.listofLanguage.push(this.language);
    console.log(this.listofLanguage);
  }

  deleteFirst() {
    this.listofLanguage.splice(0, 1);
  }
}
