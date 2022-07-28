import { Injectable } from '@angular/core';
import { Alumno } from '../models/alumno';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';

@Injectable({
  providedIn: 'root'
})

export class AlumnoService extends CommonService<Alumno>{

  protected baseEndPoint = BASE_ENDPOINT + '/alumnos';

  constructor( httpClient: HttpClient) {
    super(httpClient)
  }

  crearConFoto(alumno: Alumno, archivo: File): Observable<Alumno> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    return this.httpClient.post<Alumno>(this.baseEndPoint + '/crear-con-foto', formData);
  }

  editarConFoto(alumno: Alumno, archivo: File): Observable<Alumno> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    return this.httpClient.put<Alumno>(`${this.baseEndPoint}/editar-con-foto/${alumno.id}`, formData);
  }

  filtrarPorNombre(nombre: string): Observable<Alumno[]> {
    return this.httpClient.get<Alumno[]>(`${this.baseEndPoint}/filtrar/${nombre}`);
  }

}
