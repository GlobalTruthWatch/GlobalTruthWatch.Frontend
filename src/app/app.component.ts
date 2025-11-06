import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalFooterComponent } from './components/Widgets/global-footer/global-footer.component';
import { GlobalNavComponent } from "./components/Widgets/global-nav/global-nav.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule ,RouterOutlet, GlobalFooterComponent, RouterOutlet, GlobalNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GlobalTruthWatch';
}
