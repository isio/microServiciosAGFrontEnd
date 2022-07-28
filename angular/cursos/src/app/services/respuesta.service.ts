import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Respuesta} from "../models/respuesta";
import {Observable} from "rxjs";
import {BASE_ENDPOINT} from "../config/app";
import {Examen} from "../models/examen";
import {Alumno} from "../models/alumno";

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private baseEndPoint = BASE_ENDPOINT + '/respuestas'

  constructor( private httpClient: HttpClient ) { }

  crear(respuestas: Respuesta[]): Observable<Respuesta[]> {
    return this.httpClient.post<Respuesta[]>(this.baseEndPoint, respuestas, {headers: this.cabeceras})
  }

  obtenerRespuestasPorAlumnoPorExamen(alumno: Alumno, examen: Examen): Observable<Respuesta[]>{
    return this.httpClient.get<Respuesta[]>(`${this.baseEndPoint}/alumno/${alumno.id}/examen/${examen.id}`);
  }

}
