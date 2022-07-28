import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Examen } from '../models/examen';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asignatura } from '../models/asignatura';

@Injectable({
  providedIn: 'root'
})

export class ExamenService extends CommonService<Examen> {

  protected baseEndPoint = BASE_ENDPOINT + '/examenes';

  constructor( httpClient: HttpClient) {
    super(httpClient);
  }

  findAllAsignatura(): Observable<Asignatura[]> {
    return this.httpClient.get<Asignatura[]>( `${this.baseEndPoint}/asignaturas`);
  }

  filtrarPorNombre(nombre: string): Observable<Examen[]> {
    return this.httpClient.get<Examen[]>(`${this.baseEndPoint}/filtrar/${nombre}`);
  }

}
