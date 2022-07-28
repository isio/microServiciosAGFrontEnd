import {Component, OnInit, ViewChild} from '@angular/core';
import { Curso } from '../../models/curso';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {

  curso: Curso
  alumnosAsignar: Alumno[] = [];
  alumnos: Alumno[] = [];
  dataSource: MatTableDataSource<Alumno>;
  @ViewChild(MatPaginator, {static: true}) matPaginator: MatPaginator
  pageSizeOptions: number[] = [3, 5, 10, 20, 50];
  tabIndex = 0;
  mostrarColumnas: string[] = ['nombre', 'apellido', 'seleccion'];
  mostrarColumnasAlumnos: string[] = ['id', 'nombre', 'apellido', 'email', 'eliminar'];

  selectionModel = new SelectionModel<Alumno>(true, []);

  constructor( private activateRoute: ActivatedRoute,
               private cursoService: CursoService,
               private alumnoService: AlumnoService ) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c
        this.alumnos = this.curso.alumnos;
        this.iniciarPaginador();
      });
    });
  }

  private iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator = this.matPaginator;
    this.matPaginator._intl.itemsPerPageLabel = 'Registros Por Página';
  }

  filtrar(nombre: string): void {
    nombre = nombre !== undefined? nombre.trim(): '';
    if( nombre !== '' ){
      this.alumnoService.filtrarPorNombre(nombre).subscribe(alumnos => this.alumnosAsignar = alumnos.filter(a => {
        let filtrar = true;
        this.alumnos.forEach(ca => {
          if ( a.id === ca.id ) {
            filtrar = false;
          }
        });
        return filtrar;
      }));
    }
  }

  estanTodosSeleccionados(): boolean {
    const seleccionados = this.selectionModel.selected.length;
    const numAlumnos = this.alumnosAsignar.length;
    return (seleccionados === numAlumnos);
  }

  seleccionarDeseleccionarTodos(): void {
    this.estanTodosSeleccionados()? this.selectionModel.clear(): this.alumnosAsignar.forEach(a => this.selectionModel.select(a));
  }

  asignar(): void {
    console.log('51 :: ', this.selectionModel.selected);
    this.cursoService.asignarAlumnos(this.curso, this.selectionModel.selected).subscribe(c => {
      this.tabIndex = 2;
      Swal.fire('Asignados', `Alumnos Asignados Con Éxito Al Curso ${this.curso.nombre}`, 'success');
      this.alumnos = this.alumnos.concat(this.selectionModel.selected);
      this.iniciarPaginador();
      this.alumnosAsignar = [];
      this.selectionModel.clear();
    },
      e => {
      if ( e.status === 500 ) {
        const mensaje = e.error.message as string;
        if ( mensaje.indexOf('ConstraintViolationException') > -1 ) {
          Swal.fire('Cuidado : ', 'No Se Puede Asociar El Alumno Ya Está Asociado A Otro Curso.', 'error');
        };
      };
      }
    );
  }

  eliminarAlumno(alumno: Alumno): void {
    Swal.fire({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar a ${alumno.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursoService.eliminarAlumno(this.curso, alumno).subscribe(curso => {
          this.alumnos = this.alumnos.filter( a => a.id !==  alumno.id );
          this.iniciarPaginador();
          Swal.fire('Eliminado:', `Alumno ${alumno.nombre} Eliminado Del Curso ${curso.nombre} Con Exito.`, 'success');
        });
      }
    });
  }

}
