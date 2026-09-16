from PIL import Image,ImageDraw
from pathlib import Path
p=Path('D:/createwebsite/chat1/page1');s=Image.new('RGB',(1600,1500),'#222');d=ImageDraw.Draw(s)
for i,t in enumerate([0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10]):
 f=p/'review'/('site-'+str(t).replace('.','-')+'.jpg')
 if not f.exists():continue
 im=Image.open(f);im.thumbnail((400,225));x=i%4*400;y=i//4*250;s.paste(im,(x,y+22));d.text((x+5,y+4),str(t),fill='white')
s.save(p/'review/site-sheet.jpg')
