// services/comentarioService.js
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  headers: HttpHeaders = new HttpHeaders;
  private apiUrl = `${environment.apiUrl}/comentario`;

  constructor(private http: HttpClient) { }

  getAllComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.apiUrl);
  }

  getComentarioById(id: string): Observable<Comentario> {
    return this.http.get<Comentario>(`${this.apiUrl}/${id}`);
  }



  deleteComentario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
