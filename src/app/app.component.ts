import { Component } from '@angular/core';
declare var $: any;
@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'project';
  ngOnInit(): void {
  }
}
