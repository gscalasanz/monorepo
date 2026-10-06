# REGISTRY-detail — domain

## time

`src/shared/time/` — **único** lugar con `new Date()`/`Date.now()` (ESLint `no-new-date`). Zona
`America/Argentina/Buenos_Aires`. Branded `Instant` (ISO UTC) y `LocalDate` (`YYYY-MM-DD`).

| Símbolo | Para qué |
| --- | --- |
| `nowInstant()` · `nowMs()` · `todayBsAs()` · `currentYearBsAs()` | Reloj (timers, TTL, "hoy", año por defecto). |
| `formatDate(value, DATE_FORMATS.x)` | Pipe `dateFormat` + `\| date:'…'` de Angular. Acepta ISO, `YYYY-MM-DD`, `DD/MM/YYYY [HH:mm]`, epoch. Inválido → `''`. Las fechas calendario no se corren de día. |
| `DATE_FORMATS` | `date` `13/03/2026` · `time` `15:30` · `dateTime` `13/03/2026, 15:30` · `dateLong` · `dateTimeCompact` · `dayMonth` · `dayMonthYear` · `dayMonthNumeric` · `longDate`. |
| `formatInBsAs(instant, pattern)` | Patrón date-fns libre (locale `es`). |
| `resolveBackendDate(value)` | Cualquier fecha → `Instant` o `null` (fecha calendario = medianoche BsAs). |
| `parseLocalDate` · `parseInstant` · `isLocalDateString` · `localDateOf` | Validar/normalizar (lanzan si es inválido). |
| `addDays` · `daysBetween({from,to})` · `isBefore` · `calculateWeekRange` · `msFromInstant` · `msToInstant` | Aritmética. |
| `toDateInputValue` · `toDateTimeInputValue` · `dateTimeInputToInstant` | `<input type="date|datetime-local">` ↔ backend. |
| `calculateDurationInMinutes({start,end})` · `formatDuration` | Horas `HH:mm` (`time-helpers`). |
| `localDateSchema` · `instantSchema` | zod para el borde de la API (`localDateSchema` acepta `YYYY-MM-DD` y el ISO de medianoche de POST/PATCH). |
