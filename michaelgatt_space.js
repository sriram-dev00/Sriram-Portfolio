import{aF as Y,aE as q,bb as G,bk as L,aG as j,be as O,bl as C,bm as A,bn as k,bo as N,bp as $,af as c,s as J,m as d,n as K,h as Z,a as ee,w as y,I as M,o as te,a6 as ie,c as ae,bi as U}from"./Dp2rd0PE.js";var ne=`uniform float uCurveAmountX;
uniform float uCurveAmountY;
uniform float uImageWidth;
uniform float uImageHeight;
uniform float uSizeFactorX;
uniform float uSizeFactorY;
uniform float uTiltAngle;

varying vec2 vUv;
varying float fogDepth;

void main() {
  vUv = uv;
  vec3 pos = position;

  
  float percentageX = (abs(pos.x) / (uImageWidth * 0.5)) * 1000.0;
  float percentageY = (abs(pos.y) / (uImageHeight * 0.5)) * 1000.0;
  pos.z += uCurveAmountX * pow(percentageX, 2.0) * 0.003 * uSizeFactorX;
  pos.z += uCurveAmountY * pow(percentageY, 2.0) * 0.003 * uSizeFactorY;

  
  pos.z += pos.y * tan(uTiltAngle);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  fogDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}`,se=`uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uWarpProgress;

varying vec2 vUv;

void main() {
    
    vec2 centeredUV = vUv - 0.5;

    
    float x = smoothstep(0.0, 1.0, (uWarpProgress * 2.0 + abs(centeredUV.y) * 2.0 - 1.0));

    
    vec2 warpedUV = mix(vUv, centeredUV * (1.0 - x) + 0.5, x);

    
    vec4 texColor = texture2D(uTexture, warpedUV);

    
    float warpOpacity = mix(1.0, 0.0, x); 

    
    texColor.a *= uOpacity * warpOpacity;

    gl_FragColor = texColor;
}`;class oe{constructor(e){var o,b;this.scene=e.scene,this.camera=e.camera,this.src=e.src,this.imageCount=1,this.imageCategory=e.category,this.isMobileOrTablet=e.isMobileOrTablet,this.noDeformations=e.noDeformations,this.isVideo=e.src?e.src.endsWith(".mp4")||e.src.endsWith(".webm"):!1,this.maxOverlapPercentage=e.maxOverlapPercentage||30,this.maxTries=e.maxTries||10;const t=e.isMobileOrTablet?2137:5760,r=e.isMobileOrTablet?1644:3100;this.minRadius=2500,this.maxRadius=5500,this.populatedAngle=e.isMobileOrTablet?360:270,this.halfPopulateAngleRad=this.populatedAngle/2*(Math.PI/180),this.circumference=2*Math.PI*this.minRadius,this.usedCircumference=this.circumference*(this.populatedAngle/360),this.cylinderHeight=this.usedCircumference/(t/r),this.scaleUpFactor=this.usedCircumference/t;const n=1+e.z*1.2,s=e.width*this.scaleUpFactor,l=e.height*this.scaleUpFactor;this.width=s*n,this.height=l*n,this.horizontalPosition=e.x/t,this.verticalPosition=e.y/r,this.distanceFactor=e.z>=0&&e.z<=1?e.z:Math.random(),this.horizontalOffset=s/this.usedCircumference/2,this.verticalOffset=l/this.cylinderHeight/2,this.horizontalPosition+=this.horizontalOffset,this.verticalPosition+=this.verticalOffset,this.baseOpacity=e.baseOpacity||1,this.boundingBoxes=e.boundingBoxes,this.bBox={},this.mesh=null,this.renderer=e.renderer||null,this.geometrySegments=e.geometrySegments??(this.noDeformations?1:this.isMobileOrTablet?10:20);const h=typeof((b=(o=this.renderer)==null?void 0:o.capabilities)==null?void 0:b.getMaxAnisotropy)=="function"?this.renderer.capabilities.getMaxAnisotropy.bind(this.renderer.capabilities):null,m=h?h():1;this.maxAnisotropy=Math.min(m,this.isMobileOrTablet?8:m),this.init()}init(){const e=this.loadTexture();if(e)for(let t=0;t<this.imageCount;t++){let r=!1;for(let n=0;n<this.maxTries;n++){const s=this.getImagePosition(),l=s.radius;if(this.bBox=this.calculateBoundingBox(s.x,s.y,this.width,this.height),this.horizontalOffset!==null||this.verticalOffset!==null||this.checkOverlap(this.bBox)<=this.maxOverlapPercentage){this.addImage(e,s,l),r=!0;break}}if(!r){const n=this.getImagePosition(),s=n.radius;this.addImage(e,n,s)}}}addImage(e,t){var l,h,m;const r=new Y(this.width,this.height,this.geometrySegments,this.geometrySegments),n=new q({precision:"highp",uniforms:{uCurveAmountX:{value:0},uCurveAmountY:{value:0},uImageHeight:{value:this.height},uImageWidth:{value:this.width},uSizeFactorX:{value:this.width/2e3},uSizeFactorY:{value:this.height/2e3},uTiltAngle:{value:0},uTexture:{value:e},fogColor:{value:((l=this.scene.fog)==null?void 0:l.color)||new G(0,0,0)},fogNear:{value:((h=this.scene.fog)==null?void 0:h.near)||0},fogFar:{value:((m=this.scene.fog)==null?void 0:m.far)||0},uOpacity:{value:this.baseOpacity},uWarpProgress:{value:0}},vertexShader:ne,fragmentShader:se,side:L,transparent:!0,fog:!0}),s=new j(r,n);s.imageCategory=this.imageCategory,s.position.set(t.x,t.y,t.z),s.lookAt(new O(0,s.position.y,0)),s.originalRotation=s.rotation.clone(),s.originalQuaternion=s.quaternion.clone(),s.baseOpacity=this.baseOpacity,this.mesh=s,this.scene.add(s)}loadTexture(){if(!this.src)return null;if(this.src.endsWith(".mp4")||this.src.endsWith(".webm")||this.isVideo){const e=document.createElement("video");e.src=`/api/get-video?url=${encodeURIComponent(this.src)}`,e.loop=!0,e.muted=!0,e.playsInline=!0,e.crossOrigin="anonymous",e.addEventListener("loadedmetadata",()=>{this.videoPlayPromise=e.play().catch(r=>{r.name==="AbortError"||r.message&&r.message.includes("interrupted")})});const t=new C(e);return t.minFilter=A,t.magFilter=A,t.format=k,this.applyTextureQualitySettings(t,{isVideo:!0}),this.videoElement=e,t}else{const t=new N().load(this.src);return this.applyTextureQualitySettings(t),t}}applyTextureQualitySettings(e,t={}){if(!e)return;const{isVideo:r=!1}=t;this.maxAnisotropy&&e.anisotropy!==this.maxAnisotropy&&(e.anisotropy=this.maxAnisotropy),r||(e.minFilter=$,e.magFilter=A,e.generateMipmaps=!0),e.needsUpdate=!0}playVideo(){this.videoElement&&this.videoElement.paused&&(this.videoPlayPromise=this.videoElement.play().catch(e=>{e.name==="AbortError"||e.message&&e.message.includes("interrupted")}))}pauseVideo(){this.videoElement&&!this.videoElement.paused&&this.videoElement.pause()}getImagePosition(){const e=this.minRadius+(this.maxRadius-this.minRadius)*this.distanceFactor,t=this.horizontalPosition!==null?this.horizontalPosition:Math.random(),r=this.verticalPosition!==null?this.verticalPosition:Math.random(),s=-Math.PI/2+t*this.populatedAngle*Math.PI/180-this.halfPopulateAngleRad,l=(.5-r)*this.cylinderHeight,h=e*Math.cos(s),m=e*Math.sin(s);return{x:h,y:l,z:m,radius:e}}calculateBoundingBox(e,t,r,n){return{xMin:e-r/2,xMax:e+r/2,yMin:t-n/2,yMax:t+n/2}}checkOverlap(e){let t=0,r=this.width*this.height;for(let n of this.boundingBoxes){const s=Math.max(0,Math.min(e.xMax,n.xMax)-Math.max(e.xMin,n.xMin)),l=Math.max(0,Math.min(e.yMax,n.yMax)-Math.max(e.yMin,n.yMin)),h=s*l;t+=h}return t/r*100}destroy(){var t,r;if(this.mesh){if(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),(r=(t=this.mesh.material.uniforms)==null?void 0:t.uTexture)!=null&&r.value){const n=this.mesh.material.uniforms.uTexture.value;n instanceof C&&(this.pauseVideo(),n.image.src="",n.image.load()),n.dispose()}this.mesh.material.dispose(),this.mesh=null}const e=this.bBox;if(this.bBox=null,this.boundingBoxes&&e){const n=this.boundingBoxes.indexOf(e);n>-1&&this.boundingBoxes.splice(n,1)}}}const ue={__name:"GalleryImage",props:{id:[String,Number],params:Object,animationsAllowed:Boolean,noDeformations:Boolean,isHome:{type:Boolean,default:!0}},setup(I){const e=I,t=c("scene"),r=c("camera"),n=c("curveAmountX"),s=c("boundingBoxes"),l=c("renderer"),h=c("addImageMesh"),m=c("addImageBBox"),o=J(null),b=d(()=>w.value?.35:.75),p=c("hoveredCategory"),u=c("clickedCategory"),V=c("tiltAngle"),T=d(()=>e.params.category===(p==null?void 0:p.value)),w=d(()=>e.params.category===(u==null?void 0:u.value)),W=d(()=>e.params.category!==(u==null?void 0:u.value)&&(u==null?void 0:u.value)),P=d(()=>w.value||T.value),{introHidden:D}=K(),{isMobileOrTablet:H}=Z(),B=ee(1),z=()=>{var i,a,v,f;o.value=new oe({scene:t.value,camera:r.value,boundingBoxes:s.value,isMobileOrTablet:H,noDeformations:e.noDeformations,renderer:l==null?void 0:l.value,...e.params}),D.value||Q(6),(v=(a=(i=o.value)==null?void 0:i.mesh)==null?void 0:a.scale)!=null&&v.x&&(B.value=o.value.mesh.scale.x),(f=o.value)!=null&&f.mesh&&(m(o.value.bBox),h(o.value.mesh))};let g=null;const E=()=>{if(l!=null&&l.value){z();return}g=y(()=>l==null?void 0:l.value,i=>{i&&(g&&g(),g=null,z())})};y(n,(i,a)=>{var f;if(!((f=o.value)!=null&&f.mesh))return;const v=i>a?"Power4.easeIn":"Power4.easeOut";M.to(o.value.mesh.material.uniforms.uCurveAmountX,{value:i,duration:.75,ease:v,overwrite:!0})});const F=d(()=>P.value?"Power4.easeOut":"Power1.easeInOut"),R=d(()=>{var a,v;const i=((v=(a=o.value)==null?void 0:a.mesh)==null?void 0:v.baseOpacity)??1;return u!=null&&u.value?w.value?i:0:p!=null&&p.value?T.value?i:i*.2:i});y(R,i=>{var a;!((a=o.value)!=null&&a.mesh)||!e.animationsAllowed||!e.isHome||M.to(o.value.mesh.material.uniforms.uOpacity,{value:i,duration:b.value,ease:F.value,overwrite:!0})});const X=d(()=>B.value*(w.value?.975:W.value?.9:1));y(X,i=>{var a;!((a=o.value)!=null&&a.mesh)||!e.animationsAllowed||M.to(o.value.mesh.scale,{x:i,y:i,z:i,duration:1,ease:"Power3.easeOut",overwrite:!0})});const S=i=>{const{mesh:a}=o.value,f=new O().setFromMatrixPosition(a.matrixWorld).project(r.value).x<0?Math.PI/i:-Math.PI/i;return new U().copy(a.originalQuaternion).multiply(new U().setFromAxisAngle(new O(0,1,0),f))},Q=i=>{const{mesh:a}=o.value;a.originalQuaternion=a.quaternion.clone(),a.quaternion.copy(S(i))},_=d(()=>{var a;if(!((a=o.value)!=null&&a.mesh))return{x:0,y:0,z:0,w:0};const{mesh:i}=o.value;return P.value?S(8):i.originalQuaternion});y(V,i=>{var a;(a=o.value)!=null&&a.mesh&&M.to(o.value.mesh.material.uniforms.uTiltAngle,{value:P.value?0:i,duration:1.5,overwrite:!0})});let x=null;return y(_,i=>{var a;!((a=o.value)!=null&&a.mesh)||!e.animationsAllowed||(x&&x.pause().kill(),x=M.to(o.value.mesh.quaternion,{...i,duration:b.value,ease:F.value}))}),te(()=>{ie(E)}),ae(()=>{o.value&&(o.value.destroy(),o.value=null),x&&(x.pause().kill(),x=null),g&&(g(),g=null)}),(i,a)=>null}};export{ue as default};
