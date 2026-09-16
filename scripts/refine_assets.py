from PIL import Image,ImageFilter
import numpy as np,cv2
from pathlib import Path
p=Path('D:/createwebsite/chat1/page1');out=p/'public/assets/processed'
f=sorted((p/'assets').glob('*'))[5];im=Image.open(f).convert('RGB');a=np.array(im);v=a.astype(float);gray=v.mean(2);h,w=gray.shape
valid=(gray<16)|((v[:,:,2]-v[:,:,0]>4)&(gray<48));valid[:int(h*.72)]=False
edge=np.argmax(valid,axis=0);edge[edge==0]=int(h*.9);edge=cv2.medianBlur(edge.astype('float32').reshape(1,-1),5).reshape(-1)
alpha=np.clip((np.arange(h)[:,None]-edge[None,:]+1)/2,0,1);rgba=Image.fromarray(np.dstack([a,(alpha*255).astype('uint8')]));rgba.thumbnail((1920,1600));rgba.save(out/'terrain.webp',quality=93)
m=Image.open(out/'machine-front.webp');w,h=m.size
m.crop((0,0,int(w*.75),int(h*.415))).save(out/'part-head.webp',quality=95)
m.crop((0,int(h*.415),int(w*.76),h)).save(out/'part-body.webp',quality=95)
