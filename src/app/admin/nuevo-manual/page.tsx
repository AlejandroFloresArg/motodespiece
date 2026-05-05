'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { SITE_CONFIG } from '@/lib/config';

// Inicializamos el cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para los selects
interface Marca { id: string; nombre: string; }
interface Modelo { id: string; nombre: string; }

export default function NuevoManualPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);

  // Estados del formulario
  const [marcaId, setMarcaId] = useState('');
  const [modeloId, setModeloId] = useState('');
  const [tipo, setTipo] = useState('taller');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [anio, setAnio] = useState('');
  const [precioArs, setPrecioArs] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);

  // 1. Cargar marcas al montar el componente
  useEffect(() => {
    async function fetchMarcas() {
      const { data, error } = await supabase
        .from('marcas')
        .select('id, nombre')
        .order('nombre');
      
      if (!error && data) setMarcas(data);
      setLoadingMarcas(false);
    }
    fetchMarcas();
  }, []);

  // 2. Cargar modelos cuando se selecciona una marca
  useEffect(() => {
    async function fetchModelos() {
      if (!marcaId) {
        setModelos([]);
        setModeloId('');
        return;
      }
      
      setLoadingModelos(true);
      const { data, error } = await supabase
        .from('modelos')
        .select('id, nombre')
        .eq('marca_id', marcaId)
        .order('nombre');
        
      if (!error && data) setModelos(data);
      setModeloId(''); // Resetear modelo al cambiar de marca
      setLoadingModelos(false);
    }
    fetchModelos();
  }, [marcaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensaje(null);

    // Validaciones básicas
    if (!modeloId || !archivo || !titulo || !precioArs) {
      setMensaje({ tipo: 'error', texto: 'Por favor completá los campos obligatorios y seleccioná un archivo PDF.' });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Subir el archivo PDF a Supabase Storage
      // Creamos un nombre único para no sobreescribir archivos con el mismo nombre
      const nombreArchivoUnico = `${Date.now()}-${archivo.name.replace(/\s+/g, '-')}`;
      
      const { error: uploadError } = await supabase.storage
        .from(SITE_CONFIG.bucketName)
        .upload(nombreArchivoUnico, archivo, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Error al subir el PDF: ${uploadError.message}`);

      // 2. Insertar el registro en la tabla manuales
      const { error: insertError } = await supabase
        .from('manuales')
        .insert({
          modelo_id: modeloId,
          tipo: tipo,
          titulo: titulo,
          descripcion: descripcion,
          anio: anio ? parseInt(anio) : null,
          precio_ars: parseFloat(precioArs),
          url_archivo: nombreArchivoUnico, // Solo guardamos el nombre del archivo
          activo: true, // Por defecto al crear está activo
          nuevo: true   // Por defecto se marca como nuevo
        });

      if (insertError) throw new Error(`Error al guardar en la base de datos: ${insertError.message}`);

      // 3. Éxito: limpiar formulario
      setMensaje({ tipo: 'exito', texto: '¡Manual agregado correctamente!' });
      setTitulo('');
      setDescripcion('');
      setAnio('');
      setPrecioArs('');
      setArchivo(null);
      // Resetear el input de tipo file (truco de React)
      const fileInput = document.getElementById('archivo-pdf') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Manual</h1>
          <Link href="/admin" className="text-gray-500 hover:text-gray-900 font-medium text-sm">
            ← Volver al panel
          </Link>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 sm:p-8">
          {mensaje && (
            <div className={`mb-6 p-4 rounded-md ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Select Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                <select 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                  value={marcaId}
                  onChange={(e) => setMarcaId(e.target.value)}
                  required
                >
                  <option value="">Seleccioná una marca</option>
                  {marcas.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Select Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                <select 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:text-gray-500"
                  value={modeloId}
                  onChange={(e) => setModeloId(e.target.value)}
                  disabled={!marcaId || loadingModelos}
                  required
                >
                  <option value="">{loadingModelos ? 'Cargando...' : 'Seleccioná un modelo'}</option>
                  {modelos.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Select Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de manual *</label>
                <select 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="taller">Manual de Taller</option>
                  <option value="despiece">Catálogo de Despiece</option>
                  <option value="usuario">Manual de Usuario</option>
                </select>
              </div>

              {/* Input Año */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año <span className="text-gray-400 font-normal">(Opcional)</span></label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ej: 2018"
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                />
              </div>
            </div>

            {/* Input Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Manual *</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ej: Manual de Taller Oficial Yamaha MT-07"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            {/* Input Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (ARS) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-md py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0.00"
                  value={precioArs}
                  onChange={(e) => setPrecioArs(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Textarea Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción <span className="text-gray-400 font-normal">(Opcional pero recomendada para SEO)</span></label>
              <textarea 
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
                placeholder="Detalla qué incluye el manual (idioma, cantidad de páginas, capítulos importantes)..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* File Input */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Archivo PDF del Manual *</label>
              <input 
                id="archivo-pdf"
                type="file" 
                accept=".pdf"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)}
                required
              />
              <p className="mt-2 text-xs text-gray-500">Solo formato .pdf. Asegurate de que el nombre no contenga caracteres raros o tildes.</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isSubmitting || loadingMarcas}
                className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Subiendo manual y procesando...' : 'Guardar Manual en la Base de Datos'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}