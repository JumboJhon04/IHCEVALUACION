# Historias de Usuario

A continuación se detallan las historias de usuario principales para el rediseño del "Usability Test Dashboard 2.0", enfocadas en resolver los problemas de usabilidad identificados en la evaluación heurística.

### Épica 1: Mejora de la Navegación y Visibilidad del Estado

**US-01: Navegación contextual (Breadcrumbs)**
- **Como** investigador UX
- **Quiero** ver mi ubicación actual dentro de la jerarquía del sistema (migas de pan) en la parte superior de cada vista
- **Para** poder entender dónde estoy y navegar de regreso a pantallas anteriores fácilmente sin perderme.
- **Criterios de Aceptación:**
  - El componente debe ser visible debajo del topbar.
  - El último elemento (la página actual) no debe ser un enlace clickeable.
  - Los elementos anteriores deben redirigir a sus respectivas vistas.

**US-02: Estados vacíos (Empty States)**
- **Como** usuario del dashboard
- **Quiero** ver mensajes claros explicativos cuando no haya datos registrados (ej. gráficos vacíos o 0%)
- **Para** entender por qué no veo información y saber qué acción debo tomar a continuación.
- **Criterios de Aceptación:**
  - Si no hay hallazgos, el gráfico de dona debe mostrar un mensaje "Sin hallazgos registrados" en el centro o en su lugar.
  - Si el porcentaje de éxito es 0, añadir un *tooltip* o subtexto explicando que se requieren más pruebas.

**US-03: Claridad en Métricas de Gráficos**
- **Como** evaluador
- **Quiero** que las métricas y gráficos tengan etiquetas de datos y leyendas claras
- **Para** comprender el valor numérico exacto de cada barra (ej. T-01) sin esfuerzo cognitivo adicional.
- **Criterios de Aceptación:**
  - Los gráficos de barras deben tener el número correspondiente en la cima de cada barra o al hacer *hover*.

### Épica 2: Prevención de Errores y Consistencia de Datos

**US-04: Validación de campos de texto**
- **Como** usuario que registra una prueba o tarea
- **Quiero** que el sistema valide que los campos tengan contenido coherente y longitudes mínimas lógicas
- **Para** evitar crear planes o tareas con texto basura o incomprensible.
- **Criterios de Aceptación:**
  - Nombres de planes deben tener mínimo 5 caracteres alfanuméricos válidos.
  - Mostrar mensajes de error en rojo debajo del input si la validación falla (ej. "El texto ingresado es inválido").

**US-05: Paginación y contador real**
- **Como** usuario que visualiza listas de planes o tareas
- **Quiero** ver un indicador real de cuántos elementos existen en total
- **Para** tener una idea clara del volumen de información y mi posición en la lista.
- **Criterios de Aceptación:**
  - El texto debe decir dinámicamente "Mostrando X resultados de Y en total".
