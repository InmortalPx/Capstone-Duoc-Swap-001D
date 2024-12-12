
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/home/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { MaterialModule } from './material/material.module';
import { PersonalisadoComponent } from './components/menu/Options/ReportePersonalisado/personalisados.component';
import { AuthGuard } from './auth.guard';
import { ErrorComponent } from './components/home/error/error.component';
import { RegistroUsuariosComponent } from './components/menu/Options/RegistroUsuarios/usuarios.component';
import { SearchToolsComponent } from './components/menu/Options/search-tools/SearchTools.component';
import { NewToolsComponent } from './components/menu/Options/NewTools/newtools.component';
import { EditToolsComponent } from './components/menu/Options/EditTools/EditTools.component';
import { RegistroEstudianteComponent } from './components/menu/Options/Estudiantes/estudiantes.component';
import { MatchComponent } from './components/menuStudent/match/match.component';
import { MensajeComponent } from './components/menuStudent/mensaje/mensaje.component';
import { PublicacionComponent } from './components/menuStudent/publicacion/publicacion.component';
import { MenuStudentComponent } from './components/menuStudent/menu-student/menu-student.component';
import { RegisterStudentComponent } from './components/menuStudent/register-student/register-student.component';
import { LoginStudentComponent } from './components/menuStudent/loginStudent/loginStudent.component';
import { NoticiasComponent } from './components/menuStudent/foro/noticias.component';
import { ChatsComponent } from './components/menu/Options/chats/chats.component';
import { MisPublicacionesComponent } from './components/menuStudent/mis-publicaciones/mis-publicaciones.component';



const routes: Routes = [
  {
    path : '',
    redirectTo : 'home',
    pathMatch : 'full'
  },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent}, 
  { path: 'error', component: ErrorComponent },
  {path:'login',component:LoginComponent},
  {path:'loginStudent',component:LoginStudentComponent},
  {path: 'search-tools', component: SearchToolsComponent, canActivate: [AuthGuard] },
  {path: 'NewTool', component: NewToolsComponent, canActivate: [AuthGuard] },
  { path: 'new-tool', component: NewToolsComponent, canActivate: [AuthGuard]  },
  {path: 'EditTool', component:EditToolsComponent, canActivate: [AuthGuard] },
  {path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] },
  {path: 'registro', component: RegistroUsuariosComponent, canActivate: [AuthGuard] },
  {path: 'estudiante', component: RegistroEstudianteComponent},
  {path: 'personalizado', component: PersonalisadoComponent, canActivate: [AuthGuard] },
  { path: 'matches', component: MatchComponent,canActivate: [AuthGuard] },
  { path: 'mensaje', component: MensajeComponent,canActivate: [AuthGuard] },
  { path: 'publicacion', component: PublicacionComponent,canActivate: [AuthGuard] },
  { path: 'register-student', component: RegisterStudentComponent ,canActivate: [AuthGuard] },
  {path: 'menuStudent', component: MenuStudentComponent,canActivate: [AuthGuard] },
  {path: 'noticias', component: NoticiasComponent,canActivate: [AuthGuard] },
  {path: 'mis-publicaciones', component: MisPublicacionesComponent,canActivate: [AuthGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes),
            MaterialModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }