import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './components/home/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { SearchToolsComponent } from './components/menu/Options/search-tools/SearchTools.component';
import { NewToolsComponent } from './components/menu/Options/NewTools/NewTools.component';
import { EditToolsComponent } from './components/menu/Options/EditTools/EditTools.component';
import { ConfirmacionDeEmailComponent } from './components/menu/Options/confirmacion-de-email/confirmacion-de-email.component';
import { SancionesComponent } from './components/menu/Options/sanciones/sanciones.component';
import { HttpClientModule } from '@angular/common/http';
import { PersonalisadoComponent } from './components/menu/Options/ReportePersonalisado/personalisados.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './components/home/error/error.component';
import { RegistroUsuariosModule } from './components/menu/Options/RegistroUsuarios/usuarios.component';
import { DevolucionDeToolsComponent } from './components/menu/Options/devolucion-de-tools/devolucion-de-tools.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PublicacionComponent } from './components/menuStudent/publicacion/publicacion.component';
import { MenuStudentComponent } from './components/menuStudent/menu-student/menu-student.component';
import { PerfilComponent } from './components/menuStudent/perfil/perfil.component';
import { MaterialesComponent } from './components/menuStudent/materiales/materiales.component';
import { IntercambiosComponent } from './components/menuStudent/intercambios/intercambios.component';
import { AyudaComponent } from './components/menuStudent/ayuda/ayuda.component';
import { NoticiasComponent } from './components/menuStudent/noticias/noticias.component';
import { MatchComponent } from './components/menuStudent/match/match.component';
import { MensajeComponent } from './components/menuStudent/mensaje/mensaje.component';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginStudentComponent } from './components/menuStudent/loginStudent/loginStudent.component';
import { RegistroEstudianteComponent } from './components/menu/Options/Estudiantes/estudiantes.component';
import { RegisterStudentModule } from './components/menuStudent/register-student/register-student.component';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    SearchToolsComponent,
    NewToolsComponent,
    EditToolsComponent,
    ConfirmacionDeEmailComponent,
    SancionesComponent,
    PersonalisadoComponent,
    ErrorComponent,
    DevolucionDeToolsComponent,
    PublicacionComponent,
    MenuStudentComponent,
    PerfilComponent,
    MaterialesComponent,
    IntercambiosComponent,
    AyudaComponent,
    NoticiasComponent,
    MatchComponent,
    MensajeComponent,
    LoginStudentComponent,
    RegistroEstudianteComponent,
    NoticiasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RegistroUsuariosModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
    HttpClientModule,
    NgbModule, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterStudentModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
