import { Component, OnInit } from '@angular/core';
import { CommonListarComponent } from '../common-listar.component';
import { Examen } from '../../models/examen';
import { ExamenService } from '../../services/examen.service';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})

export class ExamenesComponent extends CommonListarComponent<Examen, ExamenService> implements OnInit {

  constructor( examenService: ExamenService ) {
    super(examenService);
    this.titulo = 'Listado De Examenes';
    this.nombreModel = Examen.name;
  }

}
