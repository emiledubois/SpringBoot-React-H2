// Setup global para Jasmine
import 'jasmine-core';

// Configuración de timeout para pruebas asíncronas
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// Mock de localStorage si no existe (para testing)
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null
  } as Storage;
}
