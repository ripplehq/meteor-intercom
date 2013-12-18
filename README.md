meteor-intercom
===============

A tiny package to asyncronously load Intercom's JavaScript-file.

On top of just getting the script to load, though, there a few steps you need to perform in order to get Intercom support running in Meteor.

We've been careful to put the Intercom app token and app secret into Meteor's settings file so that you can use different depending on your environment (dev, testing, production, etc). If you don't want that, simply hard code the app_id in `getUserDataForIntercom`.

## Installation

1. Clone this package as a submodule into your `packages` folder.
2. Set a server only setting called `INTERCOM_APP_SECRET` and a public setting called `INTERCOM_APP_TOKEN`.
```
{
  INTERCOM_APP_SECRET : 'your secret',
  public : {
    INTERCOM_APP_TOKEN: 'your token',
  }
}
```

3. Call the `boot` method of `window.Intercom` when your app loads, e.g in `client/lib/intercom.js`:

```
Deps.autorun(function() {
  if (Meteor.userId() &&
      Session.get('intercomLoaded') &&
      TeamsHandle.ready()) {
    window.Intercom('boot', getUserDataForIntercom());
  }
});

```

NOTE: Rename or delete `TeamsHandle.ready()` if you're not using teams/companies or calling it something else.

5. Create the `getUserDataForIntercom()` function on the client from which you return an object with whatever info you want to send to Intercom, including your `app_id` that your get from Meteor.settings.public.INTERCOM_APP_TOKEN, etc.
6. Create the hashes for each of your users. Put this in a method and call it from the client or run it somewhere you can execute JS on the server:

```
var crypto = Npm.require('crypto');
Meteor.users.find({}).forEach(function(user) {
  var hmac = crypto.createHmac('sha256', Meteor.settings.INTERCOM_APP_SECRET);
  Meteor.users.update(user._id, {$set: {
    intercomHashedId: hmac.update(user._id).digest('hex')
  }});
});
```

7. You will also want to put something in `Accounts.onCreateUser`, like this:

```
/*
* All users need their _id hashed with our app's secret at Intercom
* in order for their 'secure mode' to work.
*
* When we create the user, we also store the intercomHashedId for efficient
* retrival later on.
*/
var hmac = crypto.createHmac('sha256', Meteor.settings.INTERCOM_APP_SECRET);
user.intercomHashedId = hmac.update(user._id).digest('hex');
```

8. Make sure to send along `user.intercomHashedId` in your `getUserDataForIntercom()`.
9. Call `window.Intercom('update', getUserDataForIntercom())` whenever you're routing (switching page), as a before filter, for example.

I THINK THAT'S IT.
