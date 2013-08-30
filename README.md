meteor-intercom
===============

A package to load Intercom's static JavaScript-file before your app code does.

## Usage

1. Clone this package as a submodule into your `packages` folder.
2. Set a Meteor setting called `INTERCOM_APP_TOKEN` and `INTERCOM_APP_SECRET`.
3. Call the `boot` method of `window.Intercom` when your app loads, e.g in `client/_init.js`:
 
  /*
   * Fetch the setting INTERCOM_APP_TOKEN since it's only
   * available server-side.
   */
  Meteor.call('getIntercomToken', function(err, result) {
    if (!err && result) {
      Meteor.settings = {};
      Meteor.settings.INTERCOM_APP_TOKEN = result;
      Deps.autorun(function() {
        if (Meteor.userId()) {
          if (TeamsHandle.ready()) {
            window.Intercom('boot', getUserDataForIntercom());
          }
        }
      });
    }
  });

NOTE: Rename or delete `TeamsHandle.ready()` if you're not using teams/companies or calling it something else.

4. You'll need a corresponding server-side method that exposes `Meteor.settings.INTERCOM_APP_TOKEN`, called `getIntercomToken`.
5. Create the `getUserDataForIntercom()` function where you provide whatever info you want to Intercom, including your `app_id`, etc. 
6. Create the hashes for each of your users. Put this in a method and call it from the client or run it somewhere you can execute JS on the server:

    var crypto = Npm.require('crypto');
    Meteor.users.find({}).forEach(function(user) {
      var hmac = crypto.createHmac('sha256', Meteor.settings.INTERCOM_APP_SECRET);
      Meteor.users.update(user._id, {$set: {
        intercomHashedId: hmac.update(user._id).digest('hex')
      }});
    });
    
7. You will also want to put something in `Accounts.onCreateUser`, like this:

  /*
   * All users need their _id hashed with our app's secret at Intercom
   * in order for their 'secure mode' to work.
   *
   * When we create the user, we also store the intercomHashedId for efficient
   * retrival later on.
   */
  var hmac = crypto.createHmac('sha256', Meteor.settings.INTERCOM_APP_SECRET);
  user.intercomHashedId = hmac.update(user._id).digest('hex');

8. Make sure to send along `user.intercomHashedId` in your `getUserDataForIntercom()`.
9. Call `window.Intercom('update', getUserDataForIntercom())` whenever you're routing (switching page), as a before filter, for example. 

I THINK THAT'S IT. 
