import { Component } from '@angular/core';
import { GlobalNavComponent } from "../../Widgets/global-nav/global-nav.component";
import { RouterOutlet } from "@angular/router";
import { GlobalFooterComponent } from "../../Widgets/global-footer/global-footer.component";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [GlobalNavComponent, RouterOutlet, GlobalFooterComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {

}
