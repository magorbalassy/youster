import { auth } from 'firebase/app';
import { Component } from '@angular/core';
import { MenuService } from '../menu.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  menuOpened : boolean = false;

  constructor(public afAuthServ: AuthService, private menuService: MenuService) {
    console.log('isloggedin', this.afAuthServ.user  !==  null)
   }

  clickMenu() { 
    this.menuService.toggle();
    this.menuOpened = !this.menuOpened;
  }

}
