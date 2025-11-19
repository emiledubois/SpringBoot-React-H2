module.exports = function(config) {
  config.set({
    // Framework base
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],

    // Archivos a incluir en las pruebas
    files: [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx'
    ],

    // Preprocesadores
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
      '**/*.tsx': ['karma-typescript']
    },

    // Configuración de TypeScript para Karma
    karmaTypescriptConfig: {
      compilerOptions: {
        target: 'es2015',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        esModuleInterop: true,
        skipLibCheck: true,
        lib: ['es2015', 'dom'],
        types: ['jasmine', 'node']
      },
      bundlerOptions: {
        transforms: [
          require('karma-typescript-es6-transform')()
        ]
      },
      exclude: ['node_modules']
    },

    // Reporteros
    reporters: ['progress', 'kjhtml', 'coverage', 'karma-typescript'],

    // Configuración de cobertura
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    // Puerto del servidor
    port: 9876,

    // Colores en la terminal
    colors: true,

    // Nivel de log
    logLevel: config.LOG_INFO,

    // Auto-watch de archivos
    autoWatch: true,

    // Navegadores
    browsers: ['Chrome'],

    // Modo single run (false para modo watch)
    singleRun: false,

    // Concurrencia
    concurrency: Infinity
  });
};
