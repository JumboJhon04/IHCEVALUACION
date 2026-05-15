# Priorización de Tareas

Para organizar el desarrollo del rediseño del "Usability Test Dashboard 2.0", se ha utilizado la técnica de priorización **MoSCoW** (*Must have, Should have, Could have, Won't have*). Esta priorización está alineada con los hallazgos de la evaluación heurística.

### Must Have (Debe tener - Crítico para el Sprint)
*Son aquellas funcionalidades obligatorias para solucionar los problemas de severidad "Crítica" identificados.*

1. **Validación robusta de formularios:** Implementar restricciones y validaciones de esquema (ej. Zod) en la creación de Planes de Prueba y Tareas para bloquear el ingreso de datos incomprensibles o basura.
2. **Estados vacíos (Empty States):** Añadir mensajes descriptivos y de acción ("Call to action") cuando las tarjetas KPI o los gráficos (como el de Severidad) no tienen datos para mostrar, mejorando la visibilidad del estado.
3. **Claridad en KPIs:** Explicar el contexto de las métricas (ej. si dice "0% tareas exitosas", indicar "0 de 1 observaciones").

### Should Have (Debería tener - Alta prioridad)
*Importantes pero no vitales. Mejoran significativamente la experiencia del usuario.*

1. **Breadcrumbs (Migas de pan):** Implementar navegación contextual en todas las vistas principales (Plan, Tareas, Observaciones, Hallazgos) para reducir la carga de memoria del usuario.
2. **Etiquetas de datos en gráficos:** Mostrar valores numéricos explícitos en los gráficos de barras para que el usuario no dependa únicamente de estimar visualmente el tamaño de la barra.
3. **Consistencia Visual (UI):** Aplicar la paleta de colores institucional oscura de forma uniforme (fondo de sidebar, colores de estado y hover de botones).

### Could Have (Podría tener - Deseable)
*Mejoras útiles si el tiempo lo permite, pero no comprometen la entrega del proyecto de la materia.*

1. **Indicador de Paginación Mejorado:** Mostrar texto dinámico "Mostrando X de Y resultados" en las vistas de listas.
2. **Filtros avanzados combinados:** Implementar múltiples criterios de búsqueda al mismo tiempo en el Dashboard.

### Won't Have (No tendrá por ahora)
*Fuera del alcance de esta fase de rediseño (para versiones futuras).*

1. Exportación de reportes automáticos en PDF o Excel.
2. Integración con sistemas de gestión de tareas externos (como Jira).
3. Autenticación, roles y gestión de permisos de usuarios.
