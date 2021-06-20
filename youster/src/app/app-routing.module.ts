import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './guards/auth.guard';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path:  '', component:  HomeComponent},
  { path:  'home', component:  HomeComponent },
  { path:  'search', component:  SearchComponent, canActivate: [AuthGuard] },
  { path:  'user', component:  UserComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
