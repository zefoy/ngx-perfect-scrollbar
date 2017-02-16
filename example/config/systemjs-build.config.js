(function (global) {
  System.config({
    transpiler: 'ts',
    typescriptOptions: {
      tsconfig: "src/tsconfig.json",
      types: []
    },
    meta: {
      'typescript': {
        exports: "ts"
      }
    },
    paths: {
      'npm:': 'https://unpkg.com/'
    },
    map: {
      'app': 'src',
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/flex-layout': 'npm:@angular/flex-layout/bundles/flex-layout.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      'rxjs': 'npm:rxjs',
      'ts': 'npm:plugin-typescript/lib/plugin.js',
      'typescript': 'npm:typescript/lib/typescript.js',
      'angular2-perfect-scrollbar': 'node_modules/angular2-perfect-scrollbar'
    },
    packages: {
      'app': {
        main: './main.ts',
        defaultExtension: 'ts',
        meta: {
          '*.ts': {
            loader: "ts"
          }
        }
      },
      'rxjs': {
        defaultExtension: 'js'
      },
      'angular2-perfect-scrollbar': {
        main: 'bundles/angular2-perfect-scrollbar.umd.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);

