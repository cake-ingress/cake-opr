# cake-opr

* [Description](#description)
* [Features](#features)
* [Usage](#usage)
* [Example](#example)
* [Add to Safari on an iPhone](#add-to-safari-on-an-iphone)

## Description

KISS - Keep It Simple Stupid!

There's many of these user scripts for Ingress OPR (https://opr.ingress.com/recon) out there. I just wanted to create something simple to fix a few UX annoyances of mine though, not something that adds a ton of new buttons and links making the interface even busier.

## Features
See change history [here](changes.md)

* Move sections around:
  * Duplicates section to the top of page
  * Portal details to below the image
  * All the ratings except the main portal rating listed together
  * Wider Google streetview/maps view
  * What is it selector and comments side by side at the bottom
* Show user stats in top bar all the time
* ~~Disable auto scroll when clicking on ratings~~ now native
* ~~Add links to full size images on main portal image and duplicates~~ now native

## Usage

Use this URL to load it in to Tampermonkey or Greasemonkey:

https://raw.githubusercontent.com/cake-ingress/cake-opr/master/cake-opr.user.js

## Example

![Cake OPR screenshot](screenshot.png "Cake OPR screenshot")

## Add to Safari on an iPhone

1. Got to https://opr.ingress.com/recon and save a bookmark
2. Then go back to it and edit it. Paste this into the URL field:

javascript:(function(){if(document.URL=='https://opr.ingress.com/recon'){alert('Starting load');var head=document.getElementsByTagName('head')[0];var script=document.createElement('script');script.type='text/javascript';script.src='https://github.com/cake-ingress/cake-opr/raw/dev/cake-opr.user.js';head.appendChild(script);alert('Ending load');}else{window.location.href = 'https://opr.ingress.com/recon'; alert('Run the bookmark again');}})();
