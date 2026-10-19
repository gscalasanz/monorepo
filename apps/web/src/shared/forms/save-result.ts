/**
 * Lo que devuelve un guardado: `ok`, o el mensaje humano del fallo. Genérico a
 * cualquier form que guarda contra la API (port de mi-tienda): vive en el kit de
 * formularios para que distintos features lo compartan sin importarse entre sí.
 */
export type SaveResult =
  { readonly ok: true } | { readonly ok: false; readonly message: string };
