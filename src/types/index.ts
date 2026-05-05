export interface Marca {
  id: string;
  nombre: string;
  logo_url?: string;
}

export interface Modelo {
  id: string;
  nombre: string;
  slug: string;
  cilindrada?: string;
  marca_id: string;
}

export interface Manual {
  id: string;
  marca: string;
  modelo: string;
  tipo_motor: string;
  precio: number;
  url_archivo: string;
}