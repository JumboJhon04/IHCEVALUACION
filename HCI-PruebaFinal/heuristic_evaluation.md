# Evaluación Heurística

## Problemas Detectados

| # | Pantalla | Heurística Nielsen | Problema detectado | Severidad | Recomendación |
|---|---|---|---|---|---|
| 1 | Dashboard | #1 Visibilidad del estado | "0% tareas exitosas" no explica por qué ni qué hacer | Crítico | Agregar mensaje explicativo o call-to-action |
| 2 | Dashboard | #6 Reconocer vs recordar | Los gráficos no tienen leyenda clara, la barra roja en T-01 no tiene etiqueta de valor | Moderado | Agregar etiquetas de datos en las barras |
| 3 | Dashboard | #4 Consistencia | El gráfico de dona "Hallazgos por Severidad" muestra solo el contorno vacío, sin datos visibles | Crítico | Mostrar estado vacío con mensaje "Sin hallazgos aún" |
| 4 | Plan de Prueba | #5 Prevención de errores | El plan creado se llama "No se" con descripción "aqnq / ##########", datos claramente de prueba sin validación | Crítico | Validar campos obligatorios con reglas mínimas de contenido |
| 5 | Plan de Prueba | #1 Visibilidad del estado | Dice "1 resultado encontrado" pero no hay paginación ni indicador de total real | Leve | Mostrar "Mostrando 1 de 1 planes" |
| 6 | Tareas y Guion | #5 Prevención de errores | La tarea "1qwque" tiene métrica y criterio con texto incomprensible (ej. "ajsñewñamsñc") | Crítico | Implementar validación de texto coherente en los inputs |

## Conclusión

El Dashboard actual presenta varios problemas que violan las heurísticas de Nielsen, particularmente en Prevención de Errores (se permite ingresar texto incomprensible o basura sin validaciones) y Visibilidad del Estado (falta de explicaciones claras cuando los porcentajes son 0 o cuando no hay datos en los gráficos). El enfoque debe ser solucionar los problemas de estado vacío (Empty States) y añadir validaciones estrictas en los formularios para mantener la integridad de los datos.
