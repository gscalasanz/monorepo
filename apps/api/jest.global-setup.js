/**
 * Los unit tests del api corren en UTC, la zona del servidor de producción (Render), igual
 * que vitest en web y en @scout/shared. Sin esto heredaban la zona de la máquina (UTC−3 en
 * desarrollo) y escondían los bugs que dependen de la zona del proceso.
 *
 * Tiene que ser `globalSetup`: corre en el proceso padre antes de crear los workers, que
 * heredan `TZ`. Cambiar `process.env.TZ` dentro de un test no tiene efecto (cada test ve una
 * copia de `process.env`).
 */
module.exports = () => {
  process.env.TZ = 'UTC';
};
