export const eliminarTurnoAPI = async (id: string, tieneReservas: boolean, confirmacion: 'cancelar' | 'descartar' | 'none'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 100);
  });
};
