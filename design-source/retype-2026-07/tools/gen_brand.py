#!/usr/bin/env python3
"""APR 70 brand production generator — wordmark E (Punch), monogram, favicons.
All text OUTLINED from Jost variable (SIL OFL). Perf geometry: BH-1866 true gauge."""
import os, math
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'brand-build')
W2 = os.path.join(HERE, 'Jost-variable.woff2')

COLORS = {
  'black':'#000000','white':'#FFFFFF','orange':'#E85D04','amber':'#824B07',
  'imax':'#077082','blue':'#0077B6','grey':'#C8C8C8','navy':'#001F3F',
}
ACCENTS = ['orange','amber','imax','blue','navy','grey']

_insts = {}
def inst(w):
    if w not in _insts:
        f = TTFont(W2); instantiateVariableFont(f, {'wght': w}, inplace=True); _insts[w] = f
    return _insts[w]

def text_paths(text, size, wght, ls_em, x, y, anchor='start'):
    """Return (list-of-path-d, total_width, cap_height_px)."""
    f = inst(wght); upm = f['head'].unitsPerEm
    cmap = f.getBestCmap(); gs = f.getGlyphSet(); scale = size/upm
    ls = ls_em*size
    adv = [f['hmtx'][cmap[ord(c)]][0]*scale for c in text]
    total = sum(adv) + ls*(len(text)-1)
    cx = x - total/2 if anchor=='middle' else x - total if anchor=='end' else x
    out=[]
    for c,a in zip(text,adv):
        if not c.isspace():
            sp = SVGPathPen(gs)
            tp = TransformPen(sp, Transform(scale,0,0,-scale,cx,y))
            gs[cmap[ord(c)]].draw(tp)
            d = sp.getCommands()
            if d: out.append(d)
        cx += a + ls
    cap = f['OS/2'].sCapHeight*scale if hasattr(f['OS/2'],'sCapHeight') else size*0.72
    return out, total, cap

def bh_perf(cx, cy, s):
    """BH-1866 at scale s px/mm: 2.794 wide x 1.854 high, flat edges 2.08, curved sides."""
    C,D,H = 2.794*s, 1.854*s, 2.08*s
    hw,hh,fh = C/2, D/2, H/2
    b = hw-fh
    return (f"M{cx-fh} {cy-hh} L{cx+fh} {cy-hh} Q{cx+fh+b} {cy-hh} {cx+hw} {cy} "
            f"Q{cx+fh+b} {cy+hh} {cx+fh} {cy+hh} L{cx-fh} {cy+hh} "
            f"Q{cx-fh-b} {cy+hh} {cx-hw} {cy} Q{cx-fh-b} {cy-hh} {cx-fh} {cy-hh} Z")

def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n{body}\n</svg>\n'

def wr(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path,'w').write(content)

# ── A. WORDMARK E — "APR 70" + BH punch ─────────────────────────────
def wordmark(ink_hex, punch_hex, with_pictures):
    SIZE, LS = 64, 0.14
    paths, tw, cap = text_paths('APR 70', SIZE, 700, LS, 0, 0)
    # punch: cap-height-proportioned BH perf after the text
    ps = (SIZE*0.30)/1.854          # perf height ≈ 30% of font size
    perf_w = 2.794*ps
    gap = SIZE*0.18
    pad = 8
    W = tw + gap + perf_w + pad*2
    baseline = pad + cap
    H = baseline + (SIZE*0.34 if with_pictures else 0) + pad + (16 if with_pictures else 0)
    body  = f'<g fill="{ink_hex}" transform="translate({pad},{baseline})">'
    body += ''.join(f'<path d="{d}"/>' for d in paths) + '</g>\n'
    pcx = pad + tw + gap + perf_w/2
    pcy = baseline - (SIZE*0.30)/2*0.62  # optically sit like a full stop, slightly raised
    body += f'<path fill="{punch_hex}" d="{bh_perf(pcx, pcy, ps)}"/>'
    if with_pictures:
        pp, ptw, pcap = text_paths('PICTURES', SIZE*0.20, 400, 0.52, pad + tw/2, baseline + SIZE*0.34, 'middle')
        body += f'\n<g fill="{ink_hex}">' + ''.join(f'<path d="{d}"/>' for d in pp) + '</g>'
    return svg(round(W,1), round(H,1), body)

n=0
for ink in ['white','black']:
    for punch in ACCENTS:
        for wp, tag in [(False,'wordmark'), (True,'wordmark-pictures')]:
            wr(f'{OUT}/wordmark/{tag}_{ink}_punch-{punch}.svg', wordmark(COLORS[ink], COLORS[punch], wp)); n+=1
for c in COLORS:   # solid single-color versions
    for wp, tag in [(False,'wordmark'), (True,'wordmark-pictures')]:
        wr(f'{OUT}/wordmark/{tag}_solid-{c}.svg', wordmark(COLORS[c], COLORS[c], wp)); n+=1
print('wordmarks:', n)

# ── B. MONOGRAM — "70" in D4 double hairline box, Jost 500 ──────────
def monogram(hex_):
    SIZE = 64
    paths, tw, cap = text_paths('70', SIZE, 500, 0.02, 0, 0)
    padx, pady = SIZE*0.30, SIZE*0.24
    bw, bh = tw + padx*2, cap + pady*2
    off = 5  # outer frame offset (D4 double box)
    W, H = bw + off*2 + 4, bh + off*2 + 4
    x0, y0 = off+2, off+2
    body  = f'<rect x="{x0}" y="{y0}" width="{bw}" height="{bh}" fill="none" stroke="{hex_}" stroke-width="1.6"/>\n'
    body += f'<rect x="{x0-off}" y="{y0-off}" width="{bw+off*2}" height="{bh+off*2}" fill="none" stroke="{hex_}" stroke-width="1.1"/>\n'
    body += f'<g fill="{hex_}" transform="translate({x0+padx},{y0+pady+cap})">' + ''.join(f'<path d="{d}"/>' for d in paths) + '</g>'
    return svg(round(W,1), round(H,1), body)

m=0
for c in COLORS:
    wr(f'{OUT}/monogram/monogram-70_{c}.svg', monogram(COLORS[c])); m+=1
print('monograms:', m)

# ── C. FAVICONS — Jost 600 tiles, auto-contrast text ────────────────
LIGHT_BGS = {'white','grey'}
def favicon(text, bg_name):
    S = 512
    fg = '#1A1A1A' if bg_name in LIGHT_BGS else '#FFFFFF'
    size = S*0.44 if len(text)<=2 else S*0.34
    paths, tw, cap = text_paths(text, size, 600, 0.01 if len(text)<3 else 0.0, S/2, S/2 + cap_of(text,size)/2, 'middle')
    body  = f'<rect width="{S}" height="{S}" rx="{S*0.12}" fill="{COLORS[bg_name]}"/>\n'
    body += f'<g fill="{fg}">' + ''.join(f'<path d="{d}"/>' for d in paths) + '</g>'
    return svg(S, S, body)
def cap_of(text, size):
    f = inst(600); return f['OS/2'].sCapHeight*(size/f['head'].unitsPerEm)

fv=0
for text in ['70','212','310','NRC']:
    for bg in COLORS:
        wr(f'{OUT}/favicons/svg/favicon-{text.lower()}_{bg}.svg', favicon(text, bg)); fv+=1
print('favicon svgs:', fv)
print('TOTAL svgs:', n+m+fv)
