import { Component } from '@angular/core';
import { BackEndService } from '../back-end.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private backEndService: BackEndService) {}

  ngOnInit(): void {
    this.onFetch();
  }

  onSave() {
    console.log('onSave called');
    this.backEndService.saveData();
  }

  onFetch() {
    console.log('onFetch called');
    this.backEndService.fetchData();
  }
}
