# skeleton-navigation-bundling

*This is a fork of the [aurelia-skeleton-navigation](https://github.com/aurelia/skeleton-navigation) repo inspired by @Alxandr's [mimosa-aurelia-skeleton](https://github.com/YoloDev/mimosa-aurelia-skeleton) project to demonstrate bundling with Aurelia and gulp*

## Running The App

To run the app, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
  > **Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm endpoint config github` and following the prompts.
5. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```
  >**Note:** Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install`.
6. To run the app, execute the following command:

  ```shell
  gulp watch
  ```
7. Browse to [http://localhost:9000](http://localhost:9000) to see the app. You can make changes in the code found under `src` and the browser should auto-refresh itself as you save files.

## Changes/explanation

First off, we've modified `index.html` to import our newly-added `main.js` file for manually bootstrapping the aurelia app using the [aurelia-bootstrapper](https://github.com/aurelia/bootstrapper):

```html
<script>
  System.baseUrl = 'dist'; //NOTE: You can move this into the config.js file, if you like.
  System.import('./dist/main').catch(console.error.bind(console));
</script>
```

This loads our `dist/main.js` file which contains the following code to bootstrap and start aurelia:

```js
bootstrap(aurelia => {
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .router()
    .eventAggregator();

  aurelia.start().then(a => a.setRoot('dist/app', document.body));
});
```

It also includes an import for our `bundle.js` script which lets the bundler know what our dependencies are so that all required files are bundled:

```js
import './bundle';
```

Contents of the `bundle.js` file:

```js
// Aurelia framework
import 'aurelia-bootstrapper';
import 'aurelia-templating-binding';
import 'aurelia-templating-router';
import 'aurelia-templating-resources';
import 'aurelia-event-aggregator';
import 'aurelia-router';
import 'aurelia-history';
import 'aurelia-history-browser';

// Behaviours
import './nav-bar';

// Routes/views
import './app';
import './child-router';
import './flickr';
import './welcome';
```

Now that's all setup, we can get on to the actual bundling and automation in gulp.

Jspm is used for bundling via the `jspm bundle` command.

This is setup in the `gulpfile.js` configuration file, we declare a bundles array as follows:

```js
var bundles = [
    {
        module: 'main',
        name: 'bundled'
    }
];
```

We then create a gulp task `build-bundles` which uses [gulp-shell](https://www.npmjs.com/package/gulp-shell) to run the jspm command for each element of the array and then add it to the `build` task:

```js
gulp.task('build-bundles',
    shell.task(
        bundles.map(function (bundle) {
            return 'jspm bundle ' + path.output + bundle.module + ' ' + path.output + bundle.name + '.js --inject';
        }))
)

// .....

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html'],
    'build-bundles',
    callback
  );
});
```

We're adding the bundles task after the build tasks in the sequence because we're telling jspm to look in the output folder. You can see the jspm output in the gulp output as follows:

![gulp watch output](http://dev.saairey.co.uk/aurelia-skeleton-bundling/gulp-watch-output.png)

The full syntax for the `jspm bundle` command is:

```shell
jspm bundle moduleA + module/b [outfile] [--minify] [--no-mangle] [--inject] [--skip-source-maps]
```

For our single bundle, our command will come out as `jspm dist/main dist/bundled.js --inject` which is taking the `dist/main.js` file as the module to bundle, following all dependencies, and outputting `dist/bundled.js` as the bundled file. The `--inject` parameter is telling jspm to inject the bundle config back into our configuration file (`config.js`).

Now that all this is setup, all we need to do is run `gulp watch`. You can see in the output that the jspm command is being

Using your browser's developer tools, you can see that instead of over 100 requests to get our page up and running, we now only have around 20.

Before:

![requests before](http://dev.saairey.co.uk/aurelia-skeleton-bundling/requests-before.png)

After:

![requests after](http://dev.saairey.co.uk/aurelia-skeleton-bundling/requests-after.png)

A working demo can be seen [here](http://dev.saairey.co.uk/aurelia-skeleton-bundling/)
