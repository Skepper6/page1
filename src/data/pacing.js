// The film supplies visual states, not the speed of the reading experience.
// Each weight is a viewport of scrolling. Zero-motion holds are excluded.
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
].filter(([from,to])=>from!==to).map(([from,to,length])=>[from,to,length*.72]);
export const scrollScreens=pacing.reduce((sum,p)=>sum+p[2],0);
const speeds=pacing.map(([from,to,length])=>(to-from)/length);
const tangent=i=>i===0?speeds[0]:i===speeds.length?speeds.at(-1):2*speeds[i-1]*speeds[i]/(speeds[i-1]+speeds[i]);
export function referenceAtProgress(progress){
 let cursor=Math.max(0,Math.min(1,progress))*scrollScreens;
 for(let i=0;i<pacing.length;i++){
  const [from,to,length]=pacing[i];
  if(cursor<=length){const t=cursor/length,t2=t*t,t3=t2*t;return (2*t3-3*t2+1)*from+(t3-2*t2+t)*length*tangent(i)+(-2*t3+3*t2)*to+(t3-t2)*length*tangent(i+1);}
  cursor-=length;
 }
 return 10;
}
export function progressAtReference(time){
 if(time<=0)return 0;if(time>=10)return 1;
 let low=0,high=1;for(let i=0;i<36;i++){const mid=(low+high)/2;if(referenceAtProgress(mid)<time)low=mid;else high=mid;}return (low+high)/2;
}
