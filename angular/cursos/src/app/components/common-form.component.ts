import { OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Generic } from '../models/generic';
import { Directive } from '@angular/core';

@Directive()
export abstract class CommonFormComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string;
  model: E;
  error: any;
  protected redirect: string;
  protected nombreModel: string;

  constructor( protected s: S,
               protected router: Router,
               protected activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get('id')
      if( id ) {
        this.s.ver(id).subscribe(m => {
          this.model = m
          this.titulo ='Editar ' + this.nombreModel;
        });
      }
    });
  }

  crear():void {
    this.s.crear(this.model).subscribe(m => {
      console.log('22 :: ', m);
      Swal.fire('Nuevo:', `${this.nombreModel} ${m.nombre} Creado Con Éxito`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if( err.status === 400 ) {
        this.error = err.error;
        console.log('31 :: ', this.error);
      }
    });
  }

  editar():void {
    this.s.editar(this.model).subscribe(m => {
      console.log('45 :: ', m);
      Swal.fire('Modificado:',`${this.nombreModel} ${m.nombre} Actualizado Con Éxito`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if( err.status === 400 ) {
        this.error = err.error;
        console.log('51 :: ', this.error);
      }
    });
  }



}
