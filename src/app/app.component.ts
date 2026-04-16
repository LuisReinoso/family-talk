import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { FtToastContainerComponent } from 'src/app/ft-ui/toast/ft-toast-container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, FtToastContainerComponent],
  standalone: true,
})
export class AppComponent {
  constructor(private languageService: LanguageService) {
    this.languageService.loadLanguage();
  }
}
