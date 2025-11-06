<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { lkSignatureProps } from './types';

defineOptions({ name: 'LkSignature' });

const props = defineProps(lkSignatureProps);

const root = ref<any>(null);
const canvasRef = ref<any>(null);
let ctx: any = null;

const strokes: Array<Array<{x:number;y:number}>> = [];
let current: Array<{x:number;y:number}> | null = null;

function getPoint(e:any){
  const t = e.touches?.[0] || e.changedTouches?.[0] || e;
  const rect = root.value?.getBoundingClientRect?.() || { left: 0, top: 0 } as any;
  return { x: (t.pageX - rect.left), y: (t.pageY - rect.top) };
}

function drawAll(){
  if(!ctx) return;
  ctx.fillStyle = props.background;
  ctx.fillRect(0,0,props.width, props.height);
  ctx.strokeStyle = props.color;
  ctx.lineWidth = props.lineWidth;
  ctx.lineCap = 'round';
  for(const s of strokes){
    if(s.length<2) continue;
    ctx.beginPath();
    ctx.moveTo(s[0].x, s[0].y);
    for(let i=1;i<s.length;i++) ctx.lineTo(s[i].x, s[i].y);
    ctx.stroke();
  }
}

function onStart(e:any){
  current = [];
  const p = getPoint(e);
  current.push(p);
}
function onMove(e:any){
  if(!current) return;
  const p = getPoint(e);
  current.push(p);
  strokes.push(current.slice(-2)); // 临时作为优化，只重画最后一段
  // 重画最后一段
  if(ctx){
    ctx.strokeStyle = props.color;
    ctx.lineWidth = props.lineWidth;
    ctx.lineCap = 'round';
    const seg = current.slice(-2);
    if(seg.length===2){
      ctx.beginPath();
      ctx.moveTo(seg[0].x, seg[0].y);
      ctx.lineTo(seg[1].x, seg[1].y);
      ctx.stroke();
    }
  }
}
function onEnd(){
  if(current && current.length>1){ strokes.push(current); }
  current = null;
}

function clear(){ strokes.length = 0; if(ctx){ ctx.clearRect(0,0,props.width, props.height); drawAll(); } }
function undo(){ if(strokes.length){ strokes.pop(); drawAll(); } }
function toDataURL(){ try { return (canvasRef.value as HTMLCanvasElement).toDataURL('image/png'); } catch(e){ return ''; } }

defineExpose({ clear, undo, toDataURL });

onMounted(()=>{
  // #ifdef H5
  try{
    const c = canvasRef.value as HTMLCanvasElement;
    c.width = props.width; c.height = props.height;
    ctx = c.getContext('2d');
    drawAll();
  }catch(e){}
  // #endif
});
</script>

<template>
  <view class="lk-signature" ref="root" @touchstart.prevent.stop="onStart" @touchmove.prevent.stop="onMove" @touchend.prevent.stop="onEnd">
    <canvas ref="canvasRef" class="lk-signature__canvas" :width="props.width" :height="props.height"></canvas>
  </view>
</template>

<style scoped lang="scss">
.lk-signature { width: 100%; display:flex; justify-content:center; align-items:center; }
.lk-signature__canvas { border: 2rpx dashed var(--lk-color-border); border-radius: var(--lk-radius-sm); touch-action: none; }
</style>
