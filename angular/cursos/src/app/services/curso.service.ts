import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { BASE_ENDPOINT } from '../config/app';
import { Alumno } from '../models/alumno';
import { Observable } from 'rxjs';
import {Examen} from "../models/examen";

@Injectable({
  providedIn: 'root'
})

export class CursoService extends CommonService<Curso>{

  protected baseEndPoint = BASE_ENDPOINT + '/cursos';

  constructor( httpClient: HttpClient) {
    super(httpClient)
  }

  asignarAlumnos(curso: Curso, alumnos: Alumno[]): Observable<Curso> {
    return this.httpClient.put<Curso>(`${this.baseEndPoint}/${curso.id}/asignar-alumnos`, alumnos, {headers: this.cabeceras});
  }

  eliminarAlumno(curso: Curso, alumno: Alumno): Observable<Curso> {
    return this.httpClient.put<Curso>(`${this.baseEndPoint}/${curso.id}/eliminar-alumno`, alumno, {headers: this.cabeceras});
  }

  asignarExamenes(curso: Curso, examenes: Examen[]): Observable<Curso> {
    return this.httpClient.put<Curso>(`${this.baseEndPoint}/${curso.id}/asignar-examenes`, examenes, {headers: this.cabeceras});
  }

  eliminarExamen(curso: Curso, examen: Examen): Observable<Curso> {
    return this.httpClient.put<Curso>(`${this.baseEndPoint}/${curso.id}/eliminar-examen`, examen, {headers: this.cabeceras});
  }

  obtenerCursoPorAlumnoId(alumno: Alumno): Observable<Curso> {
    return this.httpClient.get<Curso>(`${this.baseEndPoint}/alumno/${alumno.id}`);
  }

}
