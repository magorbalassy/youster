import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: String;
  email: String;

  constructor(public afAuthServ: AuthService) { 
    this.user = String(this.afAuthServ.user.displayName);
    this.email = String(this.afAuthServ.user.email);
  }

  ngOnInit(): void {

  }

}
