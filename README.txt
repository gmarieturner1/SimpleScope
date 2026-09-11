SCOPE OF WORK — SETUP

This app syncs live across every device it's opened on, using a
free Firebase project as the shared backend. firebase-config.js is
already filled in and connected to that project — nothing left to
configure there.

TWO WAYS TO USE IT
-------------------

1) QUICKEST — just open it
   Double-click index.html and it opens in your browser. Works
   fully on a laptop/desktop right away, and since data lives in
   Firebase (not on the device), anything entered here shows up on
   every other device running the app too.

2) BEST FOR PHONE — host it, then install
   Opening index.html directly on a phone works, but phones don't
   reliably offer a real "Add to Home Screen" / install icon for a
   local file. To get that (and full offline support), host these
   files somewhere served over https:

   a) Netlify Drop — netlify.com/drop
      Drag this whole folder onto the page. Gives you a live URL in
      seconds, no account required to try it (create a free account
      to keep the URL permanently).

   b) GitHub Pages — if you already use GitHub, create a repo,
      upload these files, then turn on Pages in repo Settings.

   Once hosted, open that URL on the foreman's phone and tap "Add
   to Home Screen" (Safari/Chrome) or use the install icon in
   desktop Chrome/Edge. From then on it behaves like a normal app
   icon, offline included — edits made offline sync automatically
   once back online.

ABOUT THE SHARED BACKEND
-------------------------
Every device signs in anonymously (no login screen) and reads/
writes the same Firestore database, so a job the foreman starts on
his phone shows up on the office laptop within a second or two.

This is a lightweight security model, not a full one: anyone with
the app's URL and files can read and write all job data — there's
no per-user login separating "the foreman" from "the office" or
anyone else. That's fine as long as the hosted URL and this folder
stay within your team. Don't post the URL publicly or put this repo
in a public GitHub listing. If you eventually want real per-person
logins (so you can tell who entered what, or restrict who can see
pricing), that's a straightforward next step from here.

FILES
-----
index.html    — the app
style.css     — styling
app.js        — all the logic (data lives in your browser's storage)
manifest.json — makes it installable
sw.js         — lets it work offline once installed
icon-192.png / icon-512.png — app icons
