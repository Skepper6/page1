import sys
sys.path.insert(0,r'D:\createwebsite\chat1\.video-tools')
import av
from PIL import Image,ImageDraw
from pathlib import Path
p=Path(r'D:\createwebsite\chat1\page1')
a=sorted((p/'assets').glob('*'))
sheet=Image.new('RGB',(1250,((len(a)+4)//5)*220),'#777777');d=ImageDraw.Draw(sheet)
for i,f in enumerate(a):
 im=Image.open(f);im.thumbnail((242,185));x=i%5*250;y=i//5*220;sheet.paste(im,(x,y));d.text((x+3,y+188),str(i)+' '+f.name[:27],fill='white')
sheet.save(p/'review/assets.jpg')
c=av.open(str(p/'ref_video.mp4'));s=c.streams.video[0];duration=float(s.duration*s.time_base);print('VIDEO',duration,s.width,s.height)
frames=list(c.decode(video=0))
sheet=Image.new('RGB',(1600,((21+3)//4)*250),'#222');d=ImageDraw.Draw(sheet)
for i in range(21):
 t=min(i*.5,duration-.05);f=min(frames,key=lambda f:abs(float(f.pts*f.time_base)-t));im=f.to_image();im.thumbnail((400,225));x=i%4*400;y=i//4*250;sheet.paste(im,(x,y+22));d.text((x+5,y+4),str(t),fill='white');f.to_image().save(p/'review'/f'ref-{i:02}.jpg')
sheet.save(p/'review/reference.jpg')
