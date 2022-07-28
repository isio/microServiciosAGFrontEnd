import { Component, OnInit } from '@angular/core';
import { Examen } from '../../models/examen';
import { ExamenService } from '../../services/examen.service';
import { CommonFormComponent } from '../common-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from '../../models/asignatura';
import { Pregunta } from '../../models/pregunta';
import Swal from "sweetalert2";

@Component({
  selector: 'app-examen-form',
  templateUrl: './examen-form.component.html',
  styleUrls: ['./examen-form.component.css']
})

export class ExamenFormComponent extends CommonFormComponent<Examen, ExamenService>  implements OnInit {

  asignaturasPadre: Asignatura[] = [];
  asignaturasHija: Asignatura[] = [];
  errorPreguntas: string;

  constructor(examenService: ExamenService,
              router: Router,
              activatedRoute: ActivatedRoute) {
    super(examenService, router, activatedRoute);
    this.titulo ='Crear Examen';
    this.model = new Examen();
    this.nombreModel = Examen.name;
    this.redirect = '/examenes';
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
    const id: number = +params.get('id')
    if( id ) {
      this.s.ver(id).subscribe(m => {
        this.model = m
        this.titulo ='Editar ' + this.nombreModel;
        this.cargarHijos();
        /*this.s.findAllAsignatura().subscribe(asignaturas =>
          this.asignaturasHija = asignaturas.filter( a => a.padre && a.padre.id === this.model.asignaturaPadre.id ))*/
      });
    }
    });

    this.s.findAllAsignatura().subscribe(asignaturas => this.asignaturasPadre = asignaturas.filter(a => !a.padre));

  }

  crear():void {
    if( this.model.preguntas.length === 0 ) {
      this.errorPreguntas = 'Examen Debe Tener Preguntas';
      //Swal.fire('Error Preguntas', 'Examen Debe Tener Preguntas', 'error');
      return;
    }
    this.errorPreguntas = undefined
    this.eliminarPreguntasVacias();
    super.crear();
  }

  editar():void {
    if( this.model.preguntas.length === 0 ) {
      this.errorPreguntas = 'Examen Debe Tener Preguntas';
      //Swal.fire('Error Preguntas', 'Examen Debe Tener Preguntas', 'error');
      return;
    }
    this.errorPreguntas = undefined
    this.eliminarPreguntasVacias();
    super.editar();
  }

  cargarHijos(): void {
    this.asignaturasHija = this.model.asignaturaPadre? this.model.asignaturaPadre.hijos: [];
  }

  compararAsignatura(a1: Asignatura, a2: Asignatura): boolean {
    if( a1 === undefined && a2 === undefined ) {
      return true;
    }
    return ( a1 === null || a2 === null || a1 === undefined || a2 === undefined ) ? false : a1.id === a2.id;
  }

  agregarPregunta(): void {
    this.model.preguntas.push(new Pregunta());
  }

  asignarTexto(pregunta: Pregunta, event: any): void {
    pregunta.texto = event.target.value as string;
    console.log('65 :: ', this.model);
  }

  eliminarPregunta(pregunta: Pregunta): void {
    this.model.preguntas = this.model.preguntas.filter(p => pregunta.texto !== p.texto);
  }

  eliminarPreguntasVacias(): void {
    this.model.preguntas = this.model.preguntas.filter(p => p.texto != null && p.texto.length > 0)
  }

}
