#!/opt/homebrew/opt/python@3.14/bin/python3.14
"""Layered-cinema POC screenshot helper (2026-09-02).

shot.py URL OUT [--w 1440] [--h 900] [--theme dark|light|system] [--rm]
                [--splash] [--design layered|marquee|none] [--scroll PX]
                [--console] [--viewport-only]

Full-page screenshot with the theme/design keys pre-stamped in localStorage
and the LogoReveal splash suppressed unless --splash. Prints a JSON line with
the root attributes, which data-layer elements are shown/hidden, their
computed transforms, and every external host the page requested (the
zero-third-party check). Uses the system Chrome (the bundled Chromium build
for Python Playwright 1.61 is not installed on this Mac).
"""
import argparse, json
from playwright.sync_api import sync_playwright

p = argparse.ArgumentParser()
p.add_argument('url'); p.add_argument('out')
p.add_argument('--w', type=int, default=1440); p.add_argument('--h', type=int, default=900)
p.add_argument('--theme', default='dark'); p.add_argument('--rm', action='store_true')
p.add_argument('--splash', action='store_true'); p.add_argument('--design', default='none')
p.add_argument('--scroll', type=int, default=0); p.add_argument('--console', action='store_true')
p.add_argument('--viewport-only', action='store_true')
a = p.parse_args()

init = "" if a.splash else "try{sessionStorage.setItem('apr70:v9-reveal','1');sessionStorage.setItem('apr70:splash-shown','1')}catch(e){}"
if a.theme in ('dark', 'light'):
    init += f"try{{localStorage.setItem('apr70-theme','{a.theme}')}}catch(e){{}}"
else:
    init += "try{localStorage.removeItem('apr70-theme')}catch(e){}"
if a.design == 'layered':
    init += "try{localStorage.setItem('apr70-design','layered')}catch(e){}"
elif a.design == 'marquee':
    init += "try{localStorage.removeItem('apr70-design')}catch(e){}"

with sync_playwright() as pw:
    b = pw.chromium.launch(channel='chrome', headless=True)
    ctx = b.new_context(viewport={'width': a.w, 'height': a.h},
                        reduced_motion='reduce' if a.rm else 'no-preference',
                        color_scheme='light' if a.theme == 'light' else 'dark')
    ctx.add_init_script(init)
    page = ctx.new_page()
    logs, reqs = [], []
    page.on('console', lambda m: logs.append(f'{m.type}: {m.text}'))
    page.on('pageerror', lambda e: logs.append(f'PAGEERROR: {e}'))
    page.on('request', lambda r: reqs.append(r.url))
    page.goto(a.url, wait_until='networkidle')
    page.wait_for_timeout(1200)
    if a.scroll:
        page.evaluate(f'window.scrollTo(0,{a.scroll})')
        page.wait_for_timeout(700)
    page.screenshot(path=a.out, full_page=not a.viewport_only)
    info = page.evaluate("""() => ({
      design: document.documentElement.getAttribute('data-design'),
      theme: document.documentElement.getAttribute('data-theme'),
      host: !!document.querySelector('[data-layered-host]'),
      layers: [...document.querySelectorAll('[data-layer]')].map(e => e.dataset.layer + ':' + (e.getClientRects().length ? 'shown' : 'hidden')),
      island: [...document.querySelectorAll('astro-island[client="visible"]')].map(e => e.hasAttribute('ssr') ? 'not-hydrated' : 'hydrated'),
      transforms: [...document.querySelectorAll('[data-layer]')].map(e => e.dataset.layer + '=' + getComputedStyle(e).transform),
      storedDesign: (()=>{try{return localStorage.getItem('apr70-design')}catch(e){return null}})(),
    })""")
    ext = sorted({r.split('/')[2] for r in reqs if r.startswith('http')})
    print(json.dumps({'out': a.out, 'info': info, 'hosts': ext}))
    if a.console:
        print('\n'.join(logs[-40:]))
    b.close()
