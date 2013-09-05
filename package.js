Package.describe({
    summary: "Package to load Intercom's JS files before your app's code."
});

Package.on_use(function (api) {
    api.use(['templating'], 'client');
    api.add_files('intercom-fetch.js', 'client');
});
