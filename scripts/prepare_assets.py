from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import numpy as np, cv2, json
p=Path(__file__).resolve().parents[1];out=p/'public/assets/processed';out.mkdir(parents=True,exist_ok=True)
files=sorted((p/'assets').glob('*'))
names=['components','nozzle','machine-exploded','machine-front','machine-angle','terrain','beans','light-background','reservoir','dial','dark-background','stars','machine-cup','glass-empty','glass-filled','coffee-stream','steam','sparkle','bean']
for i,(f,name) in enumerate(zip(files,names)):
 im=Image.open(f).convert('RGB');a=np.array(im);v=a.astype(float);lo=v.min(2);hi=v.max(2);gray=v.mean(2)
 if i in [7,10,11]: result=im
 elif i==5:
  # Terrain is confined below the skyline; discard the generated checkerboard sky.
  alpha=np.clip((hi-lo-4)/10,0,1);alpha[:int(im.height*.70)]=0
  alpha[int(im.height*.86):]=1
  result=Image.fromarray(np.dstack([a,(alpha*255).astype('uint8')]))
 elif i in [13,14]:
  # Reconstruct glass translucency from its luminance envelope, suppressing the checker grid.
  blur=cv2.GaussianBlur(gray,(0,0),7); alpha=np.clip((blur-145)/95,0,1)
  chroma=np.clip((hi-lo-12)/35,0,1);alpha=np.maximum(alpha,chroma)
  alpha[:,:int(im.width*.33)]=0;alpha[:,int(im.width*.68):]=0;alpha[:int(im.height*.16)]=0;alpha[int(im.height*.90):]=0
  rgb=a.copy();rgb[alpha<.6]=[224,225,221]
  result=Image.fromarray(np.dstack([rgb,(alpha*255).astype('uint8')]))
 elif i in [16,17]:
  blur=cv2.GaussianBlur(gray,(0,0),4);alpha=np.clip((blur-(105 if i==16 else 35))/150,0,1)
  result=Image.fromarray(np.dstack([np.full_like(a,245),(alpha*255).astype('uint8')]))
 else:
  threshold=155 if i in [0,1,8] else 175
  alpha=np.maximum(np.clip((threshold-gray)/22,0,1),np.clip((hi-lo-7)/14,0,1))
  mask=(alpha>.15).astype('uint8'); n,labels,stats,_=cv2.connectedComponentsWithStats(mask,8)
  keep=np.zeros(n,dtype=bool);keep[1:]=stats[1:,4]>80;alpha*=keep[labels]
  result=Image.fromarray(np.dstack([a,(alpha*255).astype('uint8')]))
 if result.mode=='RGBA' and i not in [5]:
  box=result.getbbox()
  if box: result=result.crop(box)
 result.thumbnail((1920,1600));result.save(out/(name+'.webp'),quality=92,method=6)
 print(name,result.size)
# Segment the component atlas into individually animated objects using known grid cells.
atlas=Image.open(out/'components.webp');w,h=atlas.size
for row in range(3):
 for col in range(6):
  piece=atlas.crop((int(col*w/6),int(row*h/3),int((col+1)*w/6),int((row+1)*h/3)))
  box=piece.getbbox()
  if box:piece=piece.crop(box)
  piece.save(out/f'part-{row*6+col:02}.webp',quality=94)
sheet=Image.new('RGB',(1200,800),'#eee9dd');d=ImageDraw.Draw(sheet)
for k,name in enumerate(['machine-front','machine-angle','machine-cup','machine-exploded','components','dial','reservoir','terrain']):
 im=Image.open(out/(name+'.webp'));im.thumbnail((290,340));x=k%4*300;y=k//4*400;sheet.paste(im,(x+(300-im.width)//2,y),im if im.mode=='RGBA' else None);d.text((x+5,y+365),name,fill='black')
sheet.save(p/'review/processed.jpg')
(out/'manifest.json').write_text(json.dumps(dict(zip(names,[f.name for f in files])),indent=2))
