import cv2
from PIL import Image,ImageDraw
from pathlib import Path
p=Path(r'D:\createwebsite\chat1\page1');c=cv2.VideoCapture(str(p/'ref_video.mp4')); fps=c.get(cv2.CAP_PROP_FPS); n=c.get(cv2.CAP_PROP_FRAME_COUNT); print(fps,n,n/fps)
sheet=Image.new('RGB',(1600,1500),'#222');d=ImageDraw.Draw(sheet)
for i in range(21):
 t=min(i*.5,n/fps-.1);c.set(cv2.CAP_PROP_POS_MSEC,t*1000);ok,f=c.read()
 if not ok: continue
 im=Image.fromarray(cv2.cvtColor(f,cv2.COLOR_BGR2RGB));im.save(p/'review'/f'ref-{i:02}.jpg');im.thumbnail((400,225));x=i%4*400;y=i//4*250;sheet.paste(im,(x,y+22));d.text((x+5,y+4),str(t),fill='white')
sheet.save(p/'review/reference.jpg')
