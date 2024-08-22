import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/producto`;

  constructor(private http: HttpClient) { }

  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // createProducto(producto: Producto): Observable<Producto> {
  //   return this.http.post<Producto>(this.apiUrl, producto);
  // }

  createProductoWithImage(formData: FormData): Observable<Producto> {
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const imagen = formData.get('imagen') as File;
    const precioString = formData.get('precio');
    const descuentoString = formData.get('descuento');
    const precioFinalString = formData.get('precioFinal');
    const precioDistribuidorString= formData.get('precioDistribuidor');
    const etiquetaString= formData.get('etiqueta');

    if (!nombre || !imagen || precioString === null || descuentoString === null || precioFinalString === null) {
      throw new Error('El nombre, la imagen, el precio, el descuento y el precio final son requeridos para crear un producto.');
    }

    const precio = +precioString;
    const descuento = +descuentoString;
    const precioFinal = +precioFinalString;

    // Verificar que los valores numéricos sean válidos
    if (isNaN(precio) || isNaN(descuento) || isNaN(precioFinal)) {
      throw new Error('Los valores de precio, descuento y precio final deben ser numéricos.');
    }

    const formDataClone = new FormData();
    formData.forEach((value, key) => {
      formDataClone.append(key, value);
    });



    // Realizar la solicitud POST al backend con el FormData clonado
    return this.http.post<Producto>(this.apiUrl, formDataClone);
  }



editarProducto(id: string, data: any): Observable<any> {
  return this.http.put<Producto>(`${this.apiUrl}/${id}`, data);
}




  deleteProducto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }



}
