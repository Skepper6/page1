// The film supplies visual states, not the speed of the reading experience.
// Each weight is a viewport of scrolling. Repeated times create a reading hold.
export const pacing = [
 [0,0,.35], [0,1.15,1.8], [1.15,1.15,1.4],
 [1.15,2.7,1.9], [2.7,2.7,.12],
 [2.7,3.7,1.65], [3.7,3.7,1.25],
 [3.7,4.6,2.3], [4.6,5.25,1.4], [5.25,5.25,1.6],
 [5.25,6.5,1.9], [6.5,6.5,1.1],
 [6.5,6.97,1.1], [6.97,6.97,.8],
 [6.97,7.35,1.1], [7.35,7.35,2],
 [7.35,8.06,1.7], [8.06,8.43,1.25], [8.43,8.43,1.6],
 [8.43,9.13,1.65], [9.13,9.13,.65],
 [9.13,10,1.9], [10,10,1.25]
].map(([from,to,length])=>[from,to,length*(from===to?.3:.62)]);
export const scrollScreens=pacing.reduce((sum,p)=>sum+p[2],0);
export function referenceAtProgress(progress){
 let cursor=Math.max(0,Math.min(1,progress))*scrollScreens;
 for(const [from,to,length] of pacing){
  if(cursor<=length)return from+(to-from)*cursor/length;
  cursor-=length;
 }
 return 10;
}
export function progressAtReference(time){
 let before=0;
 // Navigation lands in the middle of a reading hold where one exists.
 for(const [from,to,length] of pacing){
  if(from===to&&Math.abs(from-time)<.12)return (before+length*.5)/scrollScreens;
  before+=length;
 }
 before=0;
 for(const [from,to,length] of pacing){
  if(time>=from&&time<=to&&to>from)return (before+length*(time-from)/(to-from))/scrollScreens;
  before+=length;
 }
 return time<=0?0:1;
}
