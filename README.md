# travel.pro | Planificador de viajes

## Descripción
Esta aplicación web permite buscar información de países, clima actual, conversión de moneda, lugares turísticos y guardar destinos/atracciones favoritas.

## APIs integradas
- REST Countries API (`restcountries.com`) para datos generales de países.
- Open-Meteo API (`api.open-meteo.com`) para clima actual, con fallback a `api.met.no` si Open-Meteo no responde.
- Frankfurter API (`api.frankfurter.dev`) para conversión de moneda en tiempo real.
- OpenTripMap API (`api.opentripmap.com`) para atracciones turísticas.

## Características
- Búsqueda de países por nombre en español o inglés.
- Visualización de bandera, capital, población, región, idioma y moneda.
- Clima actual con descripción simbólica.
- Conversión de 100 unidades de moneda local a USD, EUR y GBP.
- Sección de atracciones con al menos 5 lugares.
- Guardar destinos favoritos.
- Guardar atracciones favoritas.
- Historial de búsquedas con eliminación por entrada y limpieza total.
- Tema oscuro persistente en LocalStorage.

## LocalStorage usado para
- `travel_user`: datos del usuario registrado.
- `favorites`: destinos guardados.
- `favorite_attractions`: atracciones guardadas.
- `history`: historial de búsquedas.
- `theme`: tema claro/oscuro.

## Cómo ejecutar
1. Abrir `index.html` en un servidor local.
2. Ingresar nombre, correo y país de residencia.
3. Buscar un país en el cuadro de búsqueda.

## Notas
- OpenTripMap requiere una clave válida para datos reales. En `src/script/tourism.js` se debe reemplazar `apiKey`.
- Si no se obtiene clave de OpenTripMap, la app muestra datos de respaldo.
