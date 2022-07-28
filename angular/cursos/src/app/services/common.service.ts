import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Generic } from '../models/generic';

export abstract class CommonService<E extends Generic> {

  protected baseEndPoint: string;

  protected cabeceras: HttpHeaders =  new HttpHeaders({'Content-Type': 'application/json'});

  constructor( protected httpClient: HttpClient) { }

  public listar(): Observable<E[]> {
    return this.httpClient.get<E[]>(this.baseEndPoint);
  }

  public listarPaginas(page: string, size:string): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size)
    return this.httpClient.get<any>( `${this.baseEndPoint}/pagina`, {params: params} );
  }

  public ver(id: number): Observable<E> {
    return this.httpClient.get<E>(`${this.baseEndPoint}/${id}`);
  }

  public crear(e: E): Observable<E> {
    return this.httpClient.post<E>(this.baseEndPoint, e, { headers: this.cabeceras});
  }

  public editar(e: E): Observable<E> {
    return this.httpClient.put<E>(`${this.baseEndPoint}/${e.id}`, e, { headers: this.cabeceras});
  }

  public eliminar(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseEndPoint}/${id}`)
  }

}
