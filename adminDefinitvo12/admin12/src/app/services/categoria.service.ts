import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  headers: HttpHeaders = new HttpHeaders;
  private apiUrl = `${environment.apiUrl}/categoria`;

  constructor(private http: HttpClient) { }

  getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoriaById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  // createCategoria(categoria: Categoria): Observable<Categoria> {
  //   return this.http.post<Categoria>(this.apiUrl, categoria);
  // }

  createCategoriaWithImage(formData: FormData): Observable<Categoria> {
    const nombre = formData.get('nombre') as string; 
    const imagen = formData.get('imagen') as File; 
  
    // Verificar que se haya obtenido el nombre y la imagen
    if (!nombre || !imagen) {
      throw new Error('El nombre y la imagen son requeridos para crear una categoría.');
    }
  
    
    const formDataClone = new FormData();
    formData.forEach((value, key) => {
      formDataClone.append(key, value);
    });
  
    // Realizar la solicitud POST al backend con el FormData clonado
    return this.http.post<Categoria>(this.apiUrl, formDataClone);
  }
  
  
  updateCategoriaWithImage(id: string, formData: FormData): Observable<Categoria> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Categoria>(url, formData);
  }
  updateCategoria(id: string, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
