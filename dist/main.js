System.register(["./bundle", "aurelia-framework", "aurelia-logging-console", "aurelia-bootstrapper"], function (_export) {
  "use strict";

  var LogManager, ConsoleAppender, bootstrap;
  return {
    setters: [function (_bundle) {}, function (_aureliaFramework) {
      LogManager = _aureliaFramework.LogManager;
    }, function (_aureliaLoggingConsole) {
      ConsoleAppender = _aureliaLoggingConsole.ConsoleAppender;
    }, function (_aureliaBootstrapper) {
      bootstrap = _aureliaBootstrapper.bootstrap;
    }],
    execute: function () {
      LogManager.addAppender(new ConsoleAppender());
      LogManager.setLevel(LogManager.levels.debug);

      bootstrap(function (aurelia) {
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator();

        aurelia.start().then(function (a) {
          return a.setRoot("dist/app", document.body);
        });
      });
    }
  };
});