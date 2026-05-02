# Flask Media Website

Static 5-page website for Flask Media.

## Preview on Mac
Open Terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Update before launch
- Replace WhatsApp number in `assets/js/main.js`
- Set the Cloudflare Pages secret `RESEND_API_KEY` for the `/api/contact` Resend form handler
- Replace logo files in `assets/images/` if final SVG/PNG versions are available
- Add GTM/GA4/Meta Pixel scripts in each page head placeholder


Version 3 update: the hero animation now uses assets/images/flask-media-emblem.png, extracted from the final Flask Media logo, and the full logo is used in the header/footer.
