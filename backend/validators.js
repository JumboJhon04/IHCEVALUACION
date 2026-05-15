// Validación reutilizable para todas las rutas

const validators = {
  // PRUEBAS
  validatePrueba: (data) => {
    const errors = [];

    if (!data.producto || typeof data.producto !== 'string' || data.producto.trim().length === 0) {
      errors.push('Campo "producto" es obligatorio y debe ser texto');
    } else if (data.producto.length > 100) {
      errors.push('Campo "producto" no puede exceder 100 caracteres');
    }

    if (!data.modulo_evaluado || typeof data.modulo_evaluado !== 'string' || data.modulo_evaluado.trim().length === 0) {
      errors.push('Campo "modulo_evaluado" es obligatorio y debe ser texto');
    } else if (data.modulo_evaluado.length > 100) {
      errors.push('Campo "modulo_evaluado" no puede exceder 100 caracteres');
    }

    if (!data.objetivo || typeof data.objetivo !== 'string' || data.objetivo.trim().length === 0) {
      errors.push('Campo "objetivo" es obligatorio y debe ser texto');
    }

    if (data.perfil_usuarios !== undefined && data.perfil_usuarios !== null) {
      if (typeof data.perfil_usuarios !== 'string') {
        errors.push('Campo "perfil_usuarios" debe ser texto');
      } else if (data.perfil_usuarios.length > 255) {
        errors.push('Campo "perfil_usuarios" no puede exceder 255 caracteres');
      }
    }

    if (data.metodo !== undefined && data.metodo !== null) {
      if (typeof data.metodo !== 'string') {
        errors.push('Campo "metodo" debe ser texto');
      } else if (data.metodo.length > 100) {
        errors.push('Campo "metodo" no puede exceder 100 caracteres');
      }
    }

    if (data.fecha !== undefined && data.fecha !== null) {
      if (typeof data.fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.fecha)) {
        errors.push('Campo "fecha" debe tener formato YYYY-MM-DD');
      }
    }

    if (data.lugar !== undefined && data.lugar !== null) {
      if (typeof data.lugar !== 'string') {
        errors.push('Campo "lugar" debe ser texto');
      } else if (data.lugar.length > 100) {
        errors.push('Campo "lugar" no puede exceder 100 caracteres');
      }
    }

    if (data.duracion_minutos !== undefined && data.duracion_minutos !== null) {
      if (typeof data.duracion_minutos !== 'number' || data.duracion_minutos < 0) {
        errors.push('Campo "duracion_minutos" debe ser un número no negativo');
      }
    }

    if (data.instrucciones_inicio !== undefined && data.instrucciones_inicio !== null && typeof data.instrucciones_inicio !== 'string') {
      errors.push('Campo "instrucciones_inicio" debe ser texto');
    }

    if (data.preguntas_seguimiento !== undefined && data.preguntas_seguimiento !== null && typeof data.preguntas_seguimiento !== 'string') {
      errors.push('Campo "preguntas_seguimiento" debe ser texto');
    }

    if (data.instrucciones_cierre !== undefined && data.instrucciones_cierre !== null && typeof data.instrucciones_cierre !== 'string') {
      errors.push('Campo "instrucciones_cierre" debe ser texto');
    }

    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  },

  // PARTICIPANTES
  validateParticipante: (data) => {
    const errors = [];
    
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
      errors.push('Campo "nombre" es obligatorio y debe ser texto');
    } else if (data.nombre.length > 100) {
      errors.push('Campo "nombre" no puede exceder 100 caracteres');
    }
    
    if (!data.perfil || typeof data.perfil !== 'string' || data.perfil.trim().length === 0) {
      errors.push('Campo "perfil" es obligatorio y debe ser texto');
    } else if (data.perfil.length > 100) {
      errors.push('Campo "perfil" no puede exceder 100 caracteres');
    }
    
    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  },

  // TAREAS
  validateTarea: (data) => {
    const errors = [];
    
    if (!data.prueba_id || typeof data.prueba_id !== 'number' || data.prueba_id <= 0) {
      errors.push('Campo "prueba_id" es obligatorio y debe ser un número positivo');
    }
    
    if (!data.escenario || typeof data.escenario !== 'string' || data.escenario.trim().length === 0) {
      errors.push('Campo "escenario" es obligatorio y debe ser texto');
    }
    
    if (!data.resultado_esperado || typeof data.resultado_esperado !== 'string' || data.resultado_esperado.trim().length === 0) {
      errors.push('Campo "resultado_esperado" es obligatorio y debe ser texto');
    }
    
    if (!data.metrica_principal || typeof data.metrica_principal !== 'string' || data.metrica_principal.trim().length === 0) {
      errors.push('Campo "metrica_principal" es obligatorio y debe ser texto');
    }
    
    if (!data.criterio_exito || typeof data.criterio_exito !== 'string' || data.criterio_exito.trim().length === 0) {
      errors.push('Campo "criterio_exito" es obligatorio y debe ser texto');
    }
    
    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  },

  // OBSERVACIONES
  validateObservacion: (data) => {
    const errors = [];
    
    if (!data.participante_id || typeof data.participante_id !== 'number' || data.participante_id <= 0) {
      errors.push('Campo "participante_id" es obligatorio y debe ser un número positivo');
    }
    
    if (!data.tarea_id || typeof data.tarea_id !== 'number' || data.tarea_id <= 0) {
      errors.push('Campo "tarea_id" es obligatorio y debe ser un número positivo');
    }
    
    if (typeof data.exito !== 'boolean' && data.exito !== 0 && data.exito !== 1) {
      errors.push('Campo "exito" debe ser un booleano (true/false)');
    }
    
    if (data.tiempo_segundos !== undefined && (typeof data.tiempo_segundos !== 'number' || data.tiempo_segundos < 0)) {
      errors.push('Campo "tiempo_segundos" debe ser un número no negativo');
    }
    
    if (data.cantidad_errores !== undefined && (typeof data.cantidad_errores !== 'number' || data.cantidad_errores < 0)) {
      errors.push('Campo "cantidad_errores" debe ser un número no negativo');
    }
    
    if (data.comentarios !== undefined && typeof data.comentarios !== 'string') {
      errors.push('Campo "comentarios" debe ser texto');
    }
    
    if (data.problema_detectado !== undefined && typeof data.problema_detectado !== 'string') {
      errors.push('Campo "problema_detectado" debe ser texto');
    }
    
    if (data.severidad !== undefined && typeof data.severidad !== 'string') {
      errors.push('Campo "severidad" debe ser texto');
    }
    
    if (data.mejora_propuesta !== undefined && typeof data.mejora_propuesta !== 'string') {
      errors.push('Campo "mejora_propuesta" debe ser texto');
    }
    
    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  },

  // HALLAZGOS
  validateHallazgo: (data) => {
    const errors = [];
    
    if (!data.prueba_id || typeof data.prueba_id !== 'number' || data.prueba_id <= 0) {
      errors.push('Campo "prueba_id" es obligatorio y debe ser un número positivo');
    }
    
    if (!data.frecuencia || typeof data.frecuencia !== 'string' || data.frecuencia.trim().length === 0) {
      errors.push('Campo "frecuencia" es obligatorio y debe ser texto');
    }
    
    if (!data.severidad || typeof data.severidad !== 'string' || data.severidad.trim().length === 0) {
      errors.push('Campo "severidad" es obligatorio y debe ser texto');
    }
    
    if (!data.prioridad || typeof data.prioridad !== 'string' || data.prioridad.trim().length === 0) {
      errors.push('Campo "prioridad" es obligatorio y debe ser texto');
    }
    
    if (!data.estado || typeof data.estado !== 'string' || data.estado.trim().length === 0) {
      errors.push('Campo "estado" es obligatorio y debe ser texto');
    }
    
    if (data.recomendacion_mejora !== undefined && typeof data.recomendacion_mejora !== 'string') {
      errors.push('Campo "recomendacion_mejora" debe ser texto');
    }
    
    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  }
};

module.exports = validators;
