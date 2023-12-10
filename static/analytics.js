
 // Initialize Firebase with your Firebase project's configuration
 const firebaseConfig = {
  apiKey: "AIzaSyD4H-20-Qzsd88-a6npA6UApgxujI6pbgQ",
  authDomain: "my-portfolio-victor-ojile.firebaseapp.com",
  projectId: "my-portfolio-victor-ojile",
  storageBucket: "my-portfolio-victor-ojile.appspot.com",
  messagingSenderId: "118354822018",
  appId: "1:118354822018:web:2f84b7c34739760ed1459b",
  measurementId: "G-E1ZVZS8ML2"
 };

 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 const analytics = firebase.analytics();

 function checkCookie(key) {
  return document.cookie && Object.fromEntries(document.cookie.split(';').map(e => e.split('=')))[' ' + key];
 }

 function trackUniqueVisitors() {
  if (checkCookie('page_view' + encodeURIComponent(new URL(location.href).pathname))) return;
  
  analytics.logEvent('page_view', {
   page_name: location.href,
   dateVisited: new Date().toISOString()
  });

  document.cookie = "page_view" + encodeURIComponent(new URL(location.href).pathname) + "=1;max-age=3600";
 }

 function trackClick(info) {
  if (checkCookie(info)) return;

  analytics.logEvent('click', {
   info
  });

  document.cookie = info + "=1;max-age=3600";
 }

 window.addEventListener('load', trackUniqueVisitors);
