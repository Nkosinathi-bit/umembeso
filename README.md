# Umembeso — Event Invitation Website

[![Browser checks](https://github.com/Nkosinathi-bit/umembeso/actions/workflows/site-check.yml/badge.svg)](https://github.com/Nkosinathi-bit/umembeso/actions/workflows/site-check.yml)

**Personal event project · HTML · CSS · JavaScript**

A responsive invitation website for a family umembeso celebration, with event information, a programme, countdown, mobile navigation and optional background music.

[Hosted invitation](https://umembesosn.netlify.app/)

## View locally

~~~bash
python -m http.server 8000
~~~

Open http://localhost:8000.

## Features

- Event countdown and animated introductory text.
- Responsive navigation, smooth scrolling and a back-to-top control.
- Programme and invitation images.
- A user-controllable music player.

The countdown uses **31 October 2026 at 09:00, UTC+02:00**, matching South African event time.

## Folder organisation

| Path | Contents |
| --- | --- |
| index.html | Invitation content and page structure |
| style.css | Layout, colours and animation |
| script.js | Countdown, navigation and audio controls |
| assets/images/ | Programme, poster and hero image |
| assets/audio/song.mp3 | Existing event audio |
| .github/ | Browser checks |

Google Fonts and Font Awesome are external styling resources. Music playback is subject to the browser's user-interaction requirements.

## Project context

This is a personal invitation frontend. It does not implement an RSVP database or a server-side guest-management system.
