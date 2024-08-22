// nuevo-producto.model.ts

export interface NuevoProducto {
  _id?: string; 
  nombre: string;
  descripcion?: string,
  imagen?: string;
  precio: number;
  descuento?: number;
  precioFinal: number;
  categorias: string[]; 
}
