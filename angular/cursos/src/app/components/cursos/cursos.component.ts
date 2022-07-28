import { Component, OnInit } from '@angular/core';
import { CommonListarComponent } from '../common-listar.component';
import { Curso } from '../../models/curso';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})

export class CursosComponent extends CommonListarComponent<Curso, CursoService> implements OnInit {

  constructor( cursoService: CursoService) {
    super(cursoService);
    this.titulo = 'Listado De Cursos';
    this.nombreModel = Curso.name;
  }

}
