/*
 * Load the intercom script and put it into the DOM.
 * Set a session once done.
 */

var s = document.createElement('script');
s.type='text/javascript';
s.async=true;
s.src='https://static.intercomcdn.com/intercom.v1.js';

var x=document.getElementsByTagName('script')[0];
x.parentNode.insertBefore(s,x);

function loaded() {
  Meteor.startup(function() {
    Session.set('intercomLoaded', true)
  })
}
if(s.attachEvent){
  s.attachEvent('onload', loaded);
}else{
  s.addEventListener('load',loaded,false);
}

