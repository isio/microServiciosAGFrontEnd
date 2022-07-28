import {Component, OnInit, ViewChild} from '@angular/core';
import {Curso} from "../../models/curso";
import {ActivatedRoute, Router} from "@angular/router";
import {CursoService} from "../../services/curso.service";
import {ExamenService} from "../../services/examen.service";
import {FormControl} from "@angular/forms";
import {Examen} from "../../models/examen";
import {map} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import Swal from "sweetalert2";
import {ExamenesComponent} from "../examenes/examenes.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css']
})
export class AsignarExamenesComponent implements OnInit {

  curso: Curso;

  autocompleteControl = new FormControl();
  examenesFiltrados: Examen[] = [];

  examenesAsignar: Examen[] = [];
  examenes: Examen[]= [];
  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static: true}) matPaginator: MatPaginator;
  pageSizeOptions =  [3, 5, 10, 20, 50];

  mostrarColumnas = ['nombre', 'asignatura', 'eliminar'];
  mostrarColumnasExamenes = ['id', 'nombre', 'asignaturas', 'eliminar'];
  tabIndex: number = 0;

  constructor( private activatedRoute: ActivatedRoute,
               private router: Router,
               private cursoService: CursoService,
               private examenService: ExamenService ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c
        this.examenes = this.curso.examenes;
        this.iniciarPaginador();
      });
    });
    this.autocompleteControl.valueChanges.pipe(
      map(valor => typeof valor === 'string'? valor: valor.nombre ),
      flatMap(valor => valor? this.examenService.filtrarPorNombre(valor): [])
    ).subscribe(examenes => this.examenesFiltrados = examenes);
  }

  private iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Examen>(this.examenes);
    this.dataSource.paginator =  this.matPaginator;
    this.matPaginator._intl.itemsPerPageLabel = 'Registros Por Página';
  }

  mostrarNombre(examen?: Examen): string {
    return examen? examen.nombre: '';
  }

  seleccionarExamen(event: MatAutocompleteSelectedEvent): void {
    const examen = event.option.value as Examen;
    if ( !this.existe( examen.id )) {
      this.examenesAsignar = this.examenesAsignar.concat(examen);
      console.log('49 :: ', this.examenesAsignar);
    } else {
      Swal.fire('Error', `El Examen ${examen.nombre} Ya Está Asignado Al Curso`, 'error');
    }
    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  private existe( id: number ):boolean {
    let existe = false;
    this.examenesAsignar.concat(this.examenes).forEach(e => {
      if ( id === e.id ) {
        existe = true;
      };
    });
    return existe;
  }


  eliminarDelAsignar(examen: Examen): void {
    this.examenesAsignar = this.examenesAsignar.filter(e => examen.id !== e.id);
  }

  asignar(): void {
    console.log('79 :: ', this.examenesAsignar);
    this.cursoService.asignarExamenes(this.curso, this.examenesAsignar).subscribe(curso => {
      this.examenes = this.examenes.concat(this.examenesAsignar);
      this.iniciarPaginador();
      this.examenesAsignar = [];
      Swal.fire('Asignados', `Examenes Asignados Con Éxito Al Curso ${curso.nombre}`, 'success');
      this.tabIndex = 2;
    });
  }

  eliminarExamenDelCurso(examen: Examen): void {
    Swal.fire({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar a ${examen.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursoService.eliminarExamen(this.curso, examen).subscribe(curso => {
          this.examenes = this.examenes.filter( e => e.id !==  examen.id );
          this.iniciarPaginador();
          Swal.fire('Eliminado:', `Exámen ${examen.nombre} Eliminado Del Curso ${curso.nombre} Con Exito.`, 'success');
        });
      }
    });
  }

}
