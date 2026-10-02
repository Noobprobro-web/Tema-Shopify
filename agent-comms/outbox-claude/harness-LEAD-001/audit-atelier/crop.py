import sys, os
from PIL import Image
# usage: crop.py file.png tileHeight  -> writes tiles/file-NN.png
f = sys.argv[1]; th = int(sys.argv[2]) if len(sys.argv) > 2 else 1400
im = Image.open(f); w, h = im.size
os.makedirs('tiles', exist_ok=True)
base = os.path.splitext(os.path.basename(f))[0]
n = 0
for y in range(0, h, th):
    im.crop((0, y, w, min(h, y + th))).save(f'tiles/{base}-{n:02d}.png'); n += 1
print(base, w, h, n)
