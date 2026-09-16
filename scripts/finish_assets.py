from pathlib import Path
from PIL import Image
import cv2,numpy as np
p=Path('D:/createwebsite/chat1/page1/public/assets/processed')
im=Image.open(p/'terrain.webp');im=im.crop((0,0,int(im.width*.86),im.height)).resize(im.size,Image.Resampling.LANCZOS);im.save(p/'terrain.webp',quality=94)
m=Image.open(p/'machine-front.webp');w,h=m.size;m.crop((0,0,int(w*.75),int(h*.53))).save(p/'part-head.webp',quality=95);m.crop((0,int(h*.53),int(w*.76),h)).save(p/'part-body.webp',quality=95)
for name in ['part-10','part-11','part-09','part-15']:
 im=Image.open(p/(name+'.webp')).convert('RGBA');a=np.array(im);n,labels,stats,_=cv2.connectedComponentsWithStats((a[:,:,3]>30).astype('uint8'),8);k=1+np.argmax(stats[1:,4]);a[:,:,3]*=(labels==k);im=Image.fromarray(a);box=im.getbbox();im.crop(box).save(p/(name+'.webp'),quality=94)
