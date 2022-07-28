import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFormComponent } from '../common-form.component';
import Swal from "sweetalert2";

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})

export class AlumnosFormComponent extends CommonFormComponent<Alumno, AlumnoService> implements OnInit {

  private fotoSeleccionada: File;

  constructor( alumnoService: AlumnoService,
               router: Router,
               activatedRoute: ActivatedRoute) {
    super(alumnoService, router, activatedRoute);
    this.titulo = 'Crear Alumnos';
    this.model = new Alumno();
    this.redirect = '/alumnos';
    this.nombreModel = Alumno.name;
  }

  seleccionarFoto(event): void {
    this.fotoSeleccionada = event.target.files[0];
    console.info('30 :: ', this.fotoSeleccionada);

    if( this.fotoSeleccionada.type.indexOf('image') < 0 ) {
      this.fotoSeleccionada = null;
      Swal.fire('Error Al Seleccionar La Foto:', 'El Archivo Debe Ser Del Tipo Imagen', 'error' );
    }
  }

  crear(): void {
    if ( !this.fotoSeleccionada ) {
      super.crear();
    } else {
      this.s.crearConFoto(this.model, this.fotoSeleccionada).subscribe(alumno => {
        console.log('38 :: ', alumno);
        Swal.fire('Nuevo:', `${this.nombreModel} ${alumno.nombre} Creado Con Éxito`, 'success');
        this.router.navigate([this.redirect]);
      }, err => {
        if( err.status === 400 ) {
          this.error = err.error;
          console.log('44 :: ', this.error);
        }
      });
    }
  }

  editar(): void {
    if ( !this.fotoSeleccionada ) {
      super.editar();
    } else {
      this.s.editarConFoto(this.model, this.fotoSeleccionada).subscribe(alumno => {
        console.log('55 :: ', alumno);
        Swal.fire('Modificado:', `${this.nombreModel} ${alumno.nombre} Actualizado Con Éxito`, 'success');
        this.router.navigate([this.redirect]);
      }, err => {
        if( err.status === 400 ) {
          this.error = err.error;
          console.log('61 :: ', this.error);
        }
      });
    }
  }

}
