import {Component, OnInit, ViewChild} from '@angular/core';
import {Alumno} from "../../models/alumno";
import {Curso} from "../../models/curso";
import {Examen} from "../../models/examen";
import {ActivatedRoute} from "@angular/router";
import {AlumnoService} from "../../services/alumno.service";
import {CursoService} from "../../services/curso.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ResponderExamenModalComponent} from "./responder-examen-modal.component";
import {RespuestaService} from "../../services/respuesta.service";
import {Respuesta} from "../../models/respuesta";
import Swal from "sweetalert2";
import {VerExamenModalComponent} from "./ver-examen-modal.component";

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {

  alumno: Alumno;
  curso: Curso;
  examenes: Examen[] = [];

  mostrarColumnasExamenes = ['id', 'nombre', 'asignaturas', 'preguntas', 'responder', 'ver'];

  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static: true}) matPaginator: MatPaginator;

  pageSizeOptions = [3, 5, 10, 20, 30, 50];

  constructor( private activatedRoute: ActivatedRoute,
               private alumnoService: AlumnoService,
               private cursoService: CursoService,
               private respuestaService: RespuestaService,
               public matDialog: MatDialog ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.alumnoService.ver(id).subscribe( alumno => {
        this.alumno = alumno;
        this.cursoService.obtenerCursoPorAlumnoId(this.alumno).subscribe(curso => {
          this.curso = curso;
          this.examenes = ( this.curso && this.curso.examenes ) ? this.curso.examenes : [];
          this.dataSource = new MatTableDataSource<Examen>(this.examenes);
          this.dataSource.paginator = this.matPaginator;
          this.matPaginator._intl.itemsPerPageLabel = 'Registros Por Página:';
        });
      });
    });
  }

  responderExamen(examen: Examen): void {
    const modalRef = this.matDialog.open(ResponderExamenModalComponent, {
      width: '750px',
      data: { curso: this.curso, alumno: this.alumno, examen: examen }
    });

    modalRef.afterClosed().subscribe( (respuestasMap: Map<number, Respuesta>) => {
      console.log('Model Responder Examen Ha Sido Enviado Y Cerrado');
      console.log('60 :: ', respuestasMap);
      if ( respuestasMap ) {
        const respuestas: Respuesta[] = Array.from(respuestasMap.values());
        this.respuestaService.crear(respuestas).subscribe(rs => {
          examen.respondido = true;
          Swal.fire('Enviadas : ', 'Preguntas Enviadas Con Éxito', 'success');
          console.log('79 :: ', rs);
        });
      }

    });
  }

  verExamen(examen: Examen): void {
    this.respuestaService.obtenerRespuestasPorAlumnoPorExamen(this.alumno, examen).subscribe(rs => {
      const modalRef = this.matDialog.open(VerExamenModalComponent, {
        width: '750px',
        data: {
          curso: this.curso,
          examen: examen,
          respuestas: rs
        }
      });
      modalRef.afterClosed().subscribe(() => {
        console.log('89 :: Modal Ver Exámen Cerrado');
      });
    });

  }

}
