'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Manual {
  id: string;
  titulo: string;
  precio_ars: number;
  activo: boolean;
  nuevo: boolean;
  tipo: string;
  modelos?: { nombre: string; marcas?: { nombre: string } };
}

export default function AdminPage() {
  const [manuales, setManuales] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal de edición
  const [editando, setEditando] = useState<Manual | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editTipo, setEditTipo] = useState(''); // <-- NUEVO: Estado para el tipo
  const [guardando, setGuardando] = useState(false);

  const fetchManuales = async () => {
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
      setManuales(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchManuales();
  }, []);

  const toggleField = async (id: string, field: 'activo' | 'nuevo', currentValue: boolean) => {
    // Actualización optimista (cambia visualmente antes de esperar a la DB)
    setManuales(prev => prev.map(m => m.id === id ? { ...m, [field]: !currentValue } : m));
    
    const { error } = await supabase
      .from('manuales')
      .update({ [field]: !currentValue })
      .eq('id', id);
      
    if (error) {
      console.error(`Error actualizando ${field}:`, error);
      alert('Hubo un error al guardar el cambio.');
      fetchManuales(); // Si falla, recarga los datos reales
    }
  };

  const abrirEdicion = (manual: Manual) => {
    setEditando(manual);
    setEditTitulo(manual.titulo);
    setEditPrecio(manual.precio_ars.toString());
    setEditTipo(manual.tipo || ''); // <-- NUEVO: Carga el tipo actual
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    setGuardando(true);
    
    const { error } = await supabase
      .from('manuales')
      .update({
        titulo: editTitulo,
        precio_ars: parseFloat(editPrecio),
        tipo: editTipo, // <-- NUEVO: Guarda el tipo modificado
      })
      .eq('id', editando.id);

    if (error) {
      alert('Error al guardar los cambios: ' + error.message);
    } else {
      setEditando(null);
      fetchManuales();
    }
    setGuardando(false);
  };

  const eliminarManual = async (id: string, titulo: string) => {
    const confirmado = window.confirm(
      `¿Estás seguro que querés eliminar "${titulo}"?\n\nEsta acción no se puede deshacer y borrará el manual de tu tienda.`
    );
    if (!confirmado) return;

    const { error } = await supabase
      .from('manuales')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error al eliminar el manual: ' + error.message);
    } else {
      fetchManuales();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título y Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehículo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Activo</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Nuevo</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {manuales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => abrirEdicion(manual)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => eliminarManual(manual.id, manual.titulo)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Editar Manual</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                />
              </div>
              
              {/* NUEVO CAMPO: TIPO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Manual</label>
                <input
                  type="text"
                  placeholder="Ej: Despiece, Taller, Usuario..."
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  value={editTipo}
                  onChange={(e) => setEditTipo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (ARS)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-md py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    value={editPrecio}
                    onChange={(e) => setEditPrecio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditando(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                disabled={guardando}
                className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors text-sm flex justify-center items-center"
              >
                {guardando ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Guardar cambios'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}