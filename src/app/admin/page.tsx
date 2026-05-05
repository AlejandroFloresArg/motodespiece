'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Inicializamos el cliente de Supabase para el frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [manuales, setManuales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManuales = async () => {
    // Hacemos un JOIN con modelos y marcas para mostrar el nombre del vehículo
    const { data, error } = await supabase
      .from('manuales')
      .select(`
        id, titulo, precio_ars, activo, nuevo, tipo,
        modelos ( nombre, marcas ( nombre ) )
      `)
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error cargando manuales:', error);
    } else if (data) {
      setManuales(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchManuales();
  }, []);

  const toggleField = async (id: string, field: 'activo' | 'nuevo', currentValue: boolean) => {
    // Actualización optimista en la interfaz para que se sienta rápido
    setManuales(prev => prev.map(m => m.id === id ? { ...m, [field]: !currentValue } : m));
    
    // Actualización real en la base de datos
    const { error } = await supabase
      .from('manuales')
      .update({ [field]: !currentValue })
      .eq('id', id);

    if (error) {
      console.error(`Error actualizando el campo ${field}:`, error);
      alert('Hubo un error al guardar el cambio.');
      fetchManuales(); // Revertimos si falla
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-medium">Cargando manuales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Manuales</h1>
          <Link 
            href="/admin/nuevo-manual" 
            className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm text-sm"
          >
            + Agregar nuevo
          </Link>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehículo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Activo</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Nuevo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {manuales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No hay manuales cargados todavía.
                    </td>
                  </tr>
                ) : (
                  manuales.map((manual) => (
                    <tr key={manual.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{manual.titulo}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{manual.tipo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {/* Verificamos que existan las relaciones para no romper la web */}
                        {manual.modelos?.marcas?.nombre} {manual.modelos?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${manual.precio_ars}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={manual.activo}
                            onChange={() => toggleField(manual.id, 'activo', manual.activo)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={manual.nuevo}
                            onChange={() => toggleField(manual.id, 'nuevo', manual.nuevo)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}