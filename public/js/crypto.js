function BigInteger(a,b,c){a!=null&&("number"==typeof a?this.fromNumber(a,b,c):b==null&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function nbi(){return new BigInteger(null)}function am1(a,b,c,d,e,f){while(--f>=0){var g=b*this[a++]+c[d]+e;e=Math.floor(g/67108864),c[d++]=g&67108863}return e}function am2(a,b,c,d,e,f){var g=b&32767,h=b>>15;while(--f>=0){var i=this[a]&32767,j=this[a++]>>15,k=h*i+j*g;i=g*i+((k&32767)<<15)+c[d]+(e&1073741823),e=(i>>>30)+(k>>>15)+h*j+(e>>>30),c[d++]=i&1073741823}return e}function am3(a,b,c,d,e,f){var g=b&16383,h=b>>14;while(--f>=0){var i=this[a]&16383,j=this[a++]>>14,k=h*i+j*g;i=g*i+((k&16383)<<14)+c[d]+e,e=(i>>28)+(k>>14)+h*j,c[d++]=i&268435455}return e}function int2char(a){return BI_RM.charAt(a)}function intAt(a,b){var c=BI_RC[a.charCodeAt(b)];return c==null?-1:c}function bnpCopyTo(a){for(var b=this.t-1;b>=0;--b)a[b]=this[b];a.t=this.t,a.s=this.s}function bnpFromInt(a){this.t=1,this.s=a<0?-1:0,a>0?this[0]=a:a<-1?this[0]=a+DV:this.t=0}function nbv(a){var b=nbi();return b.fromInt(a),b}function bnpFromString(a,b){var c;if(b==16)c=4;else if(b==8)c=3;else if(b==256)c=8;else if(b==2)c=1;else if(b==32)c=5;else{if(b!=4){this.fromRadix(a,b);return}c=2}this.t=0,this.s=0;var d=a.length,e=!1,f=0;while(--d>=0){var g=c==8?a[d]&255:intAt(a,d);if(g<0){a.charAt(d)=="-"&&(e=!0);continue}e=!1,f==0?this[this.t++]=g:f+c>this.DB?(this[this.t-1]|=(g&(1<<this.DB-f)-1)<<f,this[this.t++]=g>>this.DB-f):this[this.t-1]|=g<<f,f+=c,f>=this.DB&&(f-=this.DB)}c==8&&(a[0]&128)!=0&&(this.s=-1,f>0&&(this[this.t-1]|=(1<<this.DB-f)-1<<f)),this.clamp(),e&&BigInteger.ZERO.subTo(this,this)}function bnpClamp(){var a=this.s&this.DM;while(this.t>0&&this[this.t-1]==a)--this.t}function bnToString(a){if(this.s<0)return"-"+this.negate().toString(a);var b;if(a==16)b=4;else if(a==8)b=3;else if(a==2)b=1;else if(a==32)b=5;else{if(a!=4)return this.toRadix(a);b=2}var c=(1<<b)-1,d,e=!1,f="",g=this.t,h=this.DB-g*this.DB%b;if(g-->0){h<this.DB&&(d=this[g]>>h)>0&&(e=!0,f=int2char(d));while(g>=0)h<b?(d=(this[g]&(1<<h)-1)<<b-h,d|=this[--g]>>(h+=this.DB-b)):(d=this[g]>>(h-=b)&c,h<=0&&(h+=this.DB,--g)),d>0&&(e=!0),e&&(f+=int2char(d))}return e?f:"0"}function bnNegate(){var a=nbi();return BigInteger.ZERO.subTo(this,a),a}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(a){var b=this.s-a.s;if(b!=0)return b;var c=this.t;b=c-a.t;if(b!=0)return b;while(--c>=0)if((b=this[c]-a[c])!=0)return b;return 0}function nbits(a){var b=1,c;return(c=a>>>16)!=0&&(a=c,b+=16),(c=a>>8)!=0&&(a=c,b+=8),(c=a>>4)!=0&&(a=c,b+=4),(c=a>>2)!=0&&(a=c,b+=2),(c=a>>1)!=0&&(a=c,b+=1),b}function bnBitLength(){return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(a,b){var c;for(c=this.t-1;c>=0;--c)b[c+a]=this[c];for(c=a-1;c>=0;--c)b[c]=0;b.t=this.t+a,b.s=this.s}function bnpDRShiftTo(a,b){for(var c=a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0),b.s=this.s}function bnpLShiftTo(a,b){var c=a%this.DB,d=this.DB-c,e=(1<<d)-1,f=Math.floor(a/this.DB),g=this.s<<c&this.DM,h;for(h=this.t-1;h>=0;--h)b[h+f+1]=this[h]>>d|g,g=(this[h]&e)<<c;for(h=f-1;h>=0;--h)b[h]=0;b[f]=g,b.t=this.t+f+1,b.s=this.s,b.clamp()}function bnpRShiftTo(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t){b.t=0;return}var d=a%this.DB,e=this.DB-d,f=(1<<d)-1;b[0]=this[c]>>d;for(var g=c+1;g<this.t;++g)b[g-c-1]|=(this[g]&f)<<e,b[g-c]=this[g]>>d;d>0&&(b[this.t-c-1]|=(this.s&f)<<e),b.t=this.t-c,b.clamp()}function bnpSubTo(a,b){var c=0,d=0,e=Math.min(a.t,this.t);while(c<e)d+=this[c]-a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){d-=a.s;while(c<this.t)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{d+=this.s;while(c<a.t)d-=a[c],b[c++]=d&this.DM,d>>=this.DB;d-=a.s}b.s=d<0?-1:0,d<-1?b[c++]=this.DV+d:d>0&&(b[c++]=d),b.t=c,b.clamp()}function bnpMultiplyTo(a,b){var c=this.abs(),d=a.abs(),e=c.t;b.t=e+d.t;while(--e>=0)b[e]=0;for(e=0;e<d.t;++e)b[e+c.t]=c.am(0,d[e],b,e,0,c.t);b.s=0,b.clamp(),this.s!=a.s&&BigInteger.ZERO.subTo(b,b)}function bnpSquareTo(a){var b=this.abs(),c=a.t=2*b.t;while(--c>=0)a[c]=0;for(c=0;c<b.t-1;++c){var d=b.am(c,b[c],a,2*c,0,1);(a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,d,b.t-c-1))>=b.DV&&(a[c+b.t]-=b.DV,a[c+b.t+1]=1)}a.t>0&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1)),a.s=0,a.clamp()}function bnpDivRemTo(a,b,c){var d=a.abs();if(d.t<=0)return;var e=this.abs();if(e.t<d.t){b!=null&&b.fromInt(0),c!=null&&this.copyTo(c);return}c==null&&(c=nbi());var f=nbi(),g=this.s,h=a.s,i=this.DB-nbits(d[d.t-1]);i>0?(d.lShiftTo(i,f),e.lShiftTo(i,c)):(d.copyTo(f),e.copyTo(c));var j=f.t,k=f[j-1];if(k==0)return;var l=k*(1<<this.F1)+(j>1?f[j-2]>>this.F2:0),m=this.FV/l,n=(1<<this.F1)/l,o=1<<this.F2,p=c.t,q=p-j,r=b==null?nbi():b;f.dlShiftTo(q,r),c.compareTo(r)>=0&&(c[c.t++]=1,c.subTo(r,c)),BigInteger.ONE.dlShiftTo(j,r),r.subTo(f,f);while(f.t<j)f[f.t++]=0;while(--q>=0){var s=c[--p]==k?this.DM:Math.floor(c[p]*m+(c[p-1]+o)*n);if((c[p]+=f.am(0,s,c,q,0,j))<s){f.dlShiftTo(q,r),c.subTo(r,c);while(c[p]<--s)c.subTo(r,c)}}b!=null&&(c.drShiftTo(j,b),g!=h&&BigInteger.ZERO.subTo(b,b)),c.t=j,c.clamp(),i>0&&c.rShiftTo(i,c),g<0&&BigInteger.ZERO.subTo(c,c)}function bnMod(a){var b=nbi();return this.abs().divRemTo(a,null,b),this.s<0&&b.compareTo(BigInteger.ZERO)>0&&a.subTo(b,b),b}function Classic(a){this.m=a}function cConvert(a){return a.s<0||a.compareTo(this.m)>=0?a.mod(this.m):a}function cRevert(a){return a}function cReduce(a){a.divRemTo(this.m,null,a)}function cMulTo(a,b,c){a.multiplyTo(b,c),this.reduce(c)}function cSqrTo(a,b){a.squareTo(b),this.reduce(b)}function bnpInvDigit(){if(this.t<1)return 0;var a=this[0];if((a&1)==0)return 0;var b=a&3;return b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV,b>0?this.DV-b:-b}function Montgomery(a){this.m=a,this.mp=a.invDigit(),this.mpl=this.mp&32767,this.mph=this.mp>>15,this.um=(1<<a.DB-15)-1,this.mt2=2*a.t}function montConvert(a){var b=nbi();return a.abs().dlShiftTo(this.m.t,b),b.divRemTo(this.m,null,b),a.s<0&&b.compareTo(BigInteger.ZERO)>0&&this.m.subTo(b,b),b}function montRevert(a){var b=nbi();return a.copyTo(b),this.reduce(b),b}function montReduce(a){while(a.t<=this.mt2)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,d=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM;c=b+this.m.t,a[c]+=this.m.am(0,d,a,b,0,this.m.t);while(a[c]>=a.DV)a[c]-=a.DV,a[++c]++}a.clamp(),a.drShiftTo(this.m.t,a),a.compareTo(this.m)>=0&&a.subTo(this.m,a)}function montSqrTo(a,b){a.squareTo(b),this.reduce(b)}function montMulTo(a,b,c){a.multiplyTo(b,c),this.reduce(c)}function bnpIsEven(){return(this.t>0?this[0]&1:this.s)==0}function bnpExp(a,b){if(a>4294967295||a<1)return BigInteger.ONE;var c=nbi(),d=nbi(),e=b.convert(this),f=nbits(a)-1;e.copyTo(c);while(--f>=0){b.sqrTo(c,d);if((a&1<<f)>0)b.mulTo(d,e,c);else{var g=c;c=d,d=g}}return b.revert(c)}function bnModPowInt(a,b){var c;return a<256||b.isEven()?c=new Classic(b):c=new Montgomery(b),this.exp(a,c)}function bnClone(){var a=nbi();return this.copyTo(a),a}function bnIntValue(){if(this.s<0){if(this.t==1)return this[0]-this.DV;if(this.t==0)return-1}else{if(this.t==1)return this[0];if(this.t==0)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnByteValue(){return this.t==0?this.s:this[0]<<24>>24}function bnShortValue(){return this.t==0?this.s:this[0]<<16>>16}function bnpChunkSize(a){return Math.floor(Math.LN2*this.DB/Math.log(a))}function bnSigNum(){return this.s<0?-1:this.t<=0||this.t==1&&this[0]<=0?0:1}function bnpToRadix(a){a==null&&(a=10);if(this.signum()==0||a<2||a>36)return"0";var b=this.chunkSize(a),c=Math.pow(a,b),d=nbv(c),e=nbi(),f=nbi(),g="";this.divRemTo(d,e,f);while(e.signum()>0)g=(c+f.intValue()).toString(a).substr(1)+g,e.divRemTo(d,e,f);return f.intValue().toString(a)+g}function bnpFromRadix(a,b){this.fromInt(0),b==null&&(b=10);var c=this.chunkSize(b),d=Math.pow(b,c),e=!1,f=0,g=0;for(var h=0;h<a.length;++h){var i=intAt(a,h);if(i<0){a.charAt(h)=="-"&&this.signum()==0&&(e=!0);continue}g=b*g+i,++f>=c&&(this.dMultiply(d),this.dAddOffset(g,0),f=0,g=0)}f>0&&(this.dMultiply(Math.pow(b,f)),this.dAddOffset(g,0)),e&&BigInteger.ZERO.subTo(this,this)}function bnpFromNumber(a,b,c){if("number"==typeof b)if(a<2)this.fromInt(1);else{this.fromNumber(a,c),this.testBit(a-1)||this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this),this.isEven()&&this.dAddOffset(1,0);while(!this.isProbablePrime(b))this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(BigInteger.ONE.shiftLeft(a-1),this)}else{var d=new Array,e=a&7;d.length=(a>>3)+1,b.nextBytes(d),e>0?d[0]&=(1<<e)-1:d[0]=0,this.fromString(d,256)}}function bnToByteArray(){var a=this.t,b=new Array;b[0]=this.s;var c=this.DB-a*this.DB%8,d,e=0;if(a-->0){c<this.DB&&(d=this[a]>>c)!=(this.s&this.DM)>>c&&(b[e++]=d|this.s<<this.DB-c);while(a>=0){c<8?(d=(this[a]&(1<<c)-1)<<8-c,d|=this[--a]>>(c+=this.DB-8)):(d=this[a]>>(c-=8)&255,c<=0&&(c+=this.DB,--a)),(d&128)!=0&&(d|=-256),e==0&&(this.s&128)!=(d&128)&&++e;if(e>0||d!=this.s)b[e++]=d}}return b}function bnEquals(a){return this.compareTo(a)==0}function bnMin(a){return this.compareTo(a)<0?this:a}function bnMax(a){return this.compareTo(a)>0?this:a}function bnpBitwiseTo(a,b,c){var d,e,f=Math.min(a.t,this.t);for(d=0;d<f;++d)c[d]=b(this[d],a[d]);if(a.t<this.t){e=a.s&this.DM;for(d=f;d<this.t;++d)c[d]=b(this[d],e);c.t=this.t}else{e=this.s&this.DM;for(d=f;d<a.t;++d)c[d]=b(e,a[d]);c.t=a.t}c.s=b(this.s,a.s),c.clamp()}function op_and(a,b){return a&b}function bnAnd(a){var b=nbi();return this.bitwiseTo(a,op_and,b),b}function op_or(a,b){return a|b}function bnOr(a){var b=nbi();return this.bitwiseTo(a,op_or,b),b}function op_xor(a,b){return a^b}function bnXor(a){var b=nbi();return this.bitwiseTo(a,op_xor,b),b}function op_andnot(a,b){return a&~b}function bnAndNot(a){var b=nbi();return this.bitwiseTo(a,op_andnot,b),b}function bnNot(){var a=nbi();for(var b=0;b<this.t;++b)a[b]=this.DM&~this[b];return a.t=this.t,a.s=~this.s,a}function bnShiftLeft(a){var b=nbi();return a<0?this.rShiftTo(-a,b):this.lShiftTo(a,b),b}function bnShiftRight(a){var b=nbi();return a<0?this.lShiftTo(-a,b):this.rShiftTo(a,b),b}function lbit(a){if(a==0)return-1;var b=0;return(a&65535)==0&&(a>>=16,b+=16),(a&255)==0&&(a>>=8,b+=8),(a&15)==0&&(a>>=4,b+=4),(a&3)==0&&(a>>=2,b+=2),(a&1)==0&&++b,b}function bnGetLowestSetBit(){for(var a=0;a<this.t;++a)if(this[a]!=0)return a*this.DB+lbit(this[a]);return this.s<0?this.t*this.DB:-1}function cbit(a){var b=0;while(a!=0)a&=a-1,++b;return b}function bnBitCount(){var a=0,b=this.s&this.DM;for(var c=0;c<this.t;++c)a+=cbit(this[c]^b);return a}function bnTestBit(a){var b=Math.floor(a/this.DB);return b>=this.t?this.s!=0:(this[b]&1<<a%this.DB)!=0}function bnpChangeBit(a,b){var c=BigInteger.ONE.shiftLeft(a);return this.bitwiseTo(c,b,c),c}function bnSetBit(a){return this.changeBit(a,op_or)}function bnClearBit(a){return this.changeBit(a,op_andnot)}function bnFlipBit(a){return this.changeBit(a,op_xor)}function bnpAddTo(a,b){var c=0,d=0,e=Math.min(a.t,this.t);while(c<e)d+=this[c]+a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){d+=a.s;while(c<this.t)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{d+=this.s;while(c<a.t)d+=a[c],b[c++]=d&this.DM,d>>=this.DB;d+=a.s}b.s=d<0?-1:0,d>0?b[c++]=d:d<-1&&(b[c++]=this.DV+d),b.t=c,b.clamp()}function bnAdd(a){var b=nbi();return this.addTo(a,b),b}function bnSubtract(a){var b=nbi();return this.subTo(a,b),b}function bnMultiply(a){var b=nbi();return this.multiplyTo(a,b),b}function bnDivide(a){var b=nbi();return this.divRemTo(a,b,null),b}function bnRemainder(a){var b=nbi();return this.divRemTo(a,null,b),b}function bnDivideAndRemainder(a){var b=nbi(),c=nbi();return this.divRemTo(a,b,c),new Array(b,c)}function bnpDMultiply(a){this[this.t]=this.am(0,a-1,this,0,0,this.t),++this.t,this.clamp()}function bnpDAddOffset(a,b){if(a==0)return;while(this.t<=b)this[this.t++]=0;this[b]+=a;while(this[b]>=this.DV)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}function NullExp(){}function nNop(a){return a}function nMulTo(a,b,c){a.multiplyTo(b,c)}function nSqrTo(a,b){a.squareTo(b)}function bnPow(a){return this.exp(a,new NullExp)}function bnpMultiplyLowerTo(a,b,c){var d=Math.min(this.t+a.t,b);c.s=0,c.t=d;while(d>0)c[--d]=0;var e;for(e=c.t-this.t;d<e;++d)c[d+this.t]=this.am(0,a[d],c,d,0,this.t);for(e=Math.min(a.t,b);d<e;++d)this.am(0,a[d],c,d,0,b-d);c.clamp()}function bnpMultiplyUpperTo(a,b,c){--b;var d=c.t=this.t+a.t-b;c.s=0;while(--d>=0)c[d]=0;for(d=Math.max(b-this.t,0);d<a.t;++d)c[this.t+d-b]=this.am(b-d,a[d],c,0,0,this.t+d-b);c.clamp(),c.drShiftTo(1,c)}function Barrett(a){this.r2=nbi(),this.q3=nbi(),BigInteger.ONE.dlShiftTo(2*a.t,this.r2),this.mu=this.r2.divide(a),this.m=a}function barrettConvert(a){if(a.s<0||a.t>2*this.m.t)return a.mod(this.m);if(a.compareTo(this.m)<0)return a;var b=nbi();return a.copyTo(b),this.reduce(b),b}function barrettRevert(a){return a}function barrettReduce(a){a.drShiftTo(this.m.t-1,this.r2),a.t>this.m.t+1&&(a.t=this.m.t+1,a.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);while(a.compareTo(this.r2)<0)a.dAddOffset(1,this.m.t+1);a.subTo(this.r2,a);while(a.compareTo(this.m)>=0)a.subTo(this.m,a)}function barrettSqrTo(a,b){a.squareTo(b),this.reduce(b)}function barrettMulTo(a,b,c){a.multiplyTo(b,c),this.reduce(c)}function bnModPow(a,b){var c=a.bitLength(),d,e=nbv(1),f;if(c<=0)return e;c<18?d=1:c<48?d=3:c<144?d=4:c<768?d=5:d=6,c<8?f=new Classic(b):b.isEven()?f=new Barrett(b):f=new Montgomery(b);var g=new Array,h=3,i=d-1,j=(1<<d)-1;g[1]=f.convert(this);if(d>1){var k=nbi();f.sqrTo(g[1],k);while(h<=j)g[h]=nbi(),f.mulTo(k,g[h-2],g[h]),h+=2}var l=a.t-1,m,n=!0,o=nbi(),p;c=nbits(a[l])-1;while(l>=0){c>=i?m=a[l]>>c-i&j:(m=(a[l]&(1<<c+1)-1)<<i-c,l>0&&(m|=a[l-1]>>this.DB+c-i)),h=d;while((m&1)==0)m>>=1,--h;(c-=h)<0&&(c+=this.DB,--l);if(n)g[m].copyTo(e),n=!1;else{while(h>1)f.sqrTo(e,o),f.sqrTo(o,e),h-=2;h>0?f.sqrTo(e,o):(p=e,e=o,o=p),f.mulTo(o,g[m],e)}while(l>=0&&(a[l]&1<<c)==0)f.sqrTo(e,o),p=e,e=o,o=p,--c<0&&(c=this.DB-1,--l)}return f.revert(e)}function bnGCD(a){var b=this.s<0?this.negate():this.clone(),c=a.s<0?a.negate():a.clone();if(b.compareTo(c)<0){var d=b;b=c,c=d}var e=b.getLowestSetBit(),f=c.getLowestSetBit();if(f<0)return b;e<f&&(f=e),f>0&&(b.rShiftTo(f,b),c.rShiftTo(f,c));while(b.signum()>0)(e=b.getLowestSetBit())>0&&b.rShiftTo(e,b),(e=c.getLowestSetBit())>0&&c.rShiftTo(e,c),b.compareTo(c)>=0?(b.subTo(c,b),b.rShiftTo(1,b)):(c.subTo(b,c),c.rShiftTo(1,c));return f>0&&c.lShiftTo(f,c),c}function bnpModInt(a){if(a<=0)return 0;var b=this.DV%a,c=this.s<0?a-1:0;if(this.t>0)if(b==0)c=this[0]%a;else for(var d=this.t-1;d>=0;--d)c=(b*c+this[d])%a;return c}function bnModInverse(a){var b=a.isEven();if(this.isEven()&&b||a.signum()==0)return BigInteger.ZERO;var c=a.clone(),d=this.clone(),e=nbv(1),f=nbv(0),g=nbv(0),h=nbv(1);while(c.signum()!=0){while(c.isEven()){c.rShiftTo(1,c);if(b){if(!e.isEven()||!f.isEven())e.addTo(this,e),f.subTo(a,f);e.rShiftTo(1,e)}else f.isEven()||f.subTo(a,f);f.rShiftTo(1,f)}while(d.isEven()){d.rShiftTo(1,d);if(b){if(!g.isEven()||!h.isEven())g.addTo(this,g),h.subTo(a,h);g.rShiftTo(1,g)}else h.isEven()||h.subTo(a,h);h.rShiftTo(1,h)}c.compareTo(d)>=0?(c.subTo(d,c),b&&e.subTo(g,e),f.subTo(h,f)):(d.subTo(c,d),b&&g.subTo(e,g),h.subTo(f,h))}return d.compareTo(BigInteger.ONE)!=0?BigInteger.ZERO:h.compareTo(a)>=0?h.subtract(a):h.signum()<0?(h.addTo(a,h),h.signum()<0?h.add(a):h):h}function bnIsProbablePrime(a){var b,c=this.abs();if(c.t==1&&c[0]<=lowprimes[lowprimes.length-1]){for(b=0;b<lowprimes.length;++b)if(c[0]==lowprimes[b])return!0;return!1}if(c.isEven())return!1;b=1;while(b<lowprimes.length){var d=lowprimes[b],e=b+1;while(e<lowprimes.length&&d<lplim)d*=lowprimes[e++];d=c.modInt(d);while(b<e)if(d%lowprimes[b++]==0)return!1}return c.millerRabin(a)}function bnpMillerRabin(a){var b=this.subtract(BigInteger.ONE),c=b.getLowestSetBit();if(c<=0)return!1;var d=b.shiftRight(c);a=a+1>>1,a>lowprimes.length&&(a=lowprimes.length);var e=nbi();for(var f=0;f<a;++f){e.fromInt(lowprimes[f]);var g=e.modPow(d,this);if(g.compareTo(BigInteger.ONE)!=0&&g.compareTo(b)!=0){var h=1;while(h++<c&&g.compareTo(b)!=0){g=g.modPowInt(2,this);if(g.compareTo(BigInteger.ONE)==0)return!1}if(g.compareTo(b)!=0)return!1}}return!0}function Arcfour(){this.i=0,this.j=0,this.S=new Array}function ARC4init(a){var b,c,d;for(b=0;b<256;++b)this.S[b]=b;c=0;for(b=0;b<256;++b)c=c+this.S[b]+a[b%a.length]&255,d=this.S[b],this.S[b]=this.S[c],this.S[c]=d;this.i=0,this.j=0}function ARC4next(){var a;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,a=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=a,this.S[a+this.S[this.i]&255]}function prng_newstate(){return new Arcfour}function rng_seed_int(a){rng_pool[rng_pptr++]^=a&255,rng_pool[rng_pptr++]^=a>>8&255,rng_pool[rng_pptr++]^=a>>16&255,rng_pool[rng_pptr++]^=a>>24&255,rng_pptr>=rng_psize&&(rng_pptr-=rng_psize)}function rng_seed_time(){rng_seed_int((new Date).getTime())}function rng_get_byte(){if(rng_state==null){rng_seed_time(),rng_state=prng_newstate(),rng_state.init(rng_pool);for(rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr)rng_pool[rng_pptr]=0;rng_pptr=0}return rng_state.next()}function rng_get_bytes(a){var b;for(b=0;b<a.length;++b)a[b]=rng_get_byte()}function SecureRandom(){}function parseBigInt(a,b){return new BigInteger(a,b)}function linebrk(a,b){var c="",d=0;while(d+b<a.length)c+=a.substring(d,d+b)+"\n",d+=b;return c+a.substring(d,a.length)}function byte2Hex(a){return a<16?"0"+a.toString(16):a.toString(16)}function pkcs1pad2(a,b){if(b<a.length+11)return alert("Message too long for RSA"),null;var c=new Array,d=a.length-1;while(d>=0&&b>0){var e=a.charCodeAt(d--);e<128?c[--b]=e:e>127&&e<2048?(c[--b]=e&63|128,c[--b]=e>>6|192):(c[--b]=e&63|128,c[--b]=e>>6&63|128,c[--b]=e>>12|224)}c[--b]=0;var f=new SecureRandom,g=new Array;while(b>2){g[0]=0;while(g[0]==0)f.nextBytes(g);c[--b]=g[0]}return c[--b]=2,c[--b]=0,new BigInteger(c)}function RSAKey(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}function RSASetPublic(a,b){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16)):alert("Invalid RSA public key")}function RSADoPublic(a){return a.modPowInt(this.e,this.n)}function RSAEncrypt(a){var b=pkcs1pad2(a,this.n.bitLength()+7>>3);if(b==null)return null;var c=this.doPublic(b);if(c==null)return null;var d=c.toString(16);return(d.length&1)==0?d:"0"+d}function pkcs1unpad2(a,b){var c=a.toByteArray(),d=0;while(d<c.length&&c[d]==0)++d;if(c.length-d!=b-1||c[d]!=2)return null;++d;while(c[d]!=0)if(++d>=c.length)return null;var e="";while(++d<c.length){var f=c[d]&255;f<128?e+=String.fromCharCode(f):f>191&&f<224?(e+=String.fromCharCode((f&31)<<6|c[d+1]&63),++d):(e+=String.fromCharCode((f&15)<<12|(c[d+1]&63)<<6|c[d+2]&63),d+=2)}return e}function RSASetPrivate(a,b,c){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16)):alert("Invalid RSA private key")}function RSASetPrivateEx(a,b,c,d,e,f,g,h){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16),this.p=parseBigInt(d,16),this.q=parseBigInt(e,16),this.dmp1=parseBigInt(f,16),this.dmq1=parseBigInt(g,16),this.coeff=parseBigInt(h,16)):alert("Invalid RSA private key")}function RSAGenerate(a,b){var c=new SecureRandom,d=a>>1;this.e=parseInt(b,16);var e=new BigInteger(b,16);for(;;){for(;;){this.p=new BigInteger(a-d,1,c);if(this.p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)==0&&this.p.isProbablePrime(10))break}for(;;){this.q=new BigInteger(d,1,c);if(this.q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)==0&&this.q.isProbablePrime(10))break}if(this.p.compareTo(this.q)<=0){var f=this.p;this.p=this.q,this.q=f}var g=this.p.subtract(BigInteger.ONE),h=this.q.subtract(BigInteger.ONE),i=g.multiply(h);if(i.gcd(e).compareTo(BigInteger.ONE)==0){this.n=this.p.multiply(this.q),this.d=e.modInverse(i),this.dmp1=this.d.mod(g),this.dmq1=this.d.mod(h),this.coeff=this.q.modInverse(this.p);break}}}function RSADoPrivate(a){if(this.p==null||this.q==null)return a.modPow(this.d,this.n);var b=a.mod(this.p).modPow(this.dmp1,this.p),c=a.mod(this.q).modPow(this.dmq1,this.q);while(b.compareTo(c)<0)b=b.add(this.p);return b.subtract(c).multiply(this.coeff).mod(this.p).multiply(this.q).add(c)}function RSADecrypt(a){var b=parseBigInt(a,16),c=this.doPrivate(b);return c==null?null:pkcs1unpad2(c,this.n.bitLength()+7>>3)}function _rsapem_pemToBase64(a){var b=a;return b=b.replace("-----BEGIN RSA PRIVATE KEY-----",""),b=b.replace("-----END RSA PRIVATE KEY-----",""),b=b.replace(/[ \n]+/g,""),b}function _rsapem_getPosArrayOfChildrenFromHex(a){var b=new Array,c=_asnhex_getStartPosOfV_AtObj(a,0),d=_asnhex_getPosOfNextSibling_AtObj(a,c),e=_asnhex_getPosOfNextSibling_AtObj(a,d),f=_asnhex_getPosOfNextSibling_AtObj(a,e),g=_asnhex_getPosOfNextSibling_AtObj(a,f),h=_asnhex_getPosOfNextSibling_AtObj(a,g),i=_asnhex_getPosOfNextSibling_AtObj(a,h),j=_asnhex_getPosOfNextSibling_AtObj(a,i),k=_asnhex_getPosOfNextSibling_AtObj(a,j);return b.push(c,d,e,f,g,h,i,j,k),b}function _rsapem_getHexValueArrayOfChildrenFromHex(a){var b=_rsapem_getPosArrayOfChildrenFromHex(a),c=_asnhex_getHexOfV_AtObj(a,b[0]),d=_asnhex_getHexOfV_AtObj(a,b[1]),e=_asnhex_getHexOfV_AtObj(a,b[2]),f=_asnhex_getHexOfV_AtObj(a,b[3]),g=_asnhex_getHexOfV_AtObj(a,b[4]),h=_asnhex_getHexOfV_AtObj(a,b[5]),i=_asnhex_getHexOfV_AtObj(a,b[6]),j=_asnhex_getHexOfV_AtObj(a,b[7]),k=_asnhex_getHexOfV_AtObj(a,b[8]),l=new Array;return l.push(c,d,e,f,g,h,i,j,k),l}function _rsapem_readPrivateKeyFromPEMString(a){var b=_rsapem_pemToBase64(a),c=b64tohex(b),d=_rsapem_getHexValueArrayOfChildrenFromHex(c);this.setPrivateEx(d[1],d[2],d[3],d[4],d[5],d[6],d[7],d[8])}function _rsasign_getHexPaddedDigestInfoForString(a,b,c){var d=b/4,e=_RSASIGN_HASHHEXFUNC[c],f=e(a),g="0001",h="00"+_RSASIGN_DIHEAD[c]+f,i="",j=d-g.length-h.length;for(var k=0;k<j;k+=2)i+="ff";return sPaddedMessageHex=g+i+h,sPaddedMessageHex}function _rsasign_signString(a,b){var c=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),b),d=parseBigInt(c,16),e=this.doPrivate(d),f=e.toString(16);return f}function _rsasign_signStringWithSHA1(a){var b=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),"sha1"),c=parseBigInt(b,16),d=this.doPrivate(c),e=d.toString(16);return e}function _rsasign_signStringWithSHA256(a){var b=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),"sha256"),c=parseBigInt(b,16),d=this.doPrivate(c),e=d.toString(16);return e}function _rsasign_getDecryptSignatureBI(a,b,c){var d=new RSAKey;d.setPublic(b,c);var e=d.doPublic(a);return e}function _rsasign_getHexDigestInfoFromSig(a,b,c){var d=_rsasign_getDecryptSignatureBI(a,b,c),e=d.toString(16).replace(/^1f+00/,"");return e}function _rsasign_getAlgNameAndHashFromHexDisgestInfo(a){for(var b in _RSASIGN_DIHEAD){var c=_RSASIGN_DIHEAD[b],d=c.length;if(a.substring(0,d)==c){var e=[b,a.substring(d)];return e}}return[]}function _rsasign_verifySignatureWithArgs(a,b,c,d){var e=_rsasign_getHexDigestInfoFromSig(b,c,d),f=_rsasign_getAlgNameAndHashFromHexDisgestInfo(e);if(f.length==0)return!1;var g=f[0],h=f[1],i=_RSASIGN_HASHHEXFUNC[g],j=i(a);return h==j}function _rsasign_verifyHexSignatureForMessage(a,b){var c=parseBigInt(a,16),d=_rsasign_verifySignatureWithArgs(b,c,this.n.toString(16),this.e.toString(16));return d}function _rsasign_verifyString(a,b){b=b.replace(/[ \n]+/g,"");var c=parseBigInt(b,16),d=this.doPublic(c),e=d.toString(16).replace(/^1f+00/,""),f=_rsasign_getAlgNameAndHashFromHexDisgestInfo(e);if(f.length==0)return!1;var g=f[0],h=f[1],i=_RSASIGN_HASHHEXFUNC[g],j=i(a);return h==j}function hex2b64(a){var b,c,d="";for(b=0;b+3<=a.length;b+=3)c=parseInt(a.substring(b,b+3),16),d+=b64map.charAt(c>>6)+b64map.charAt(c&63);b+1==a.length?(c=parseInt(a.substring(b,b+1),16),d+=b64map.charAt(c<<2)):b+2==a.length&&(c=parseInt(a.substring(b,b+2),16),d+=b64map.charAt(c>>2)+b64map.charAt((c&3)<<4));while((d.length&3)>0)d+=b64pad;return d}function b64tohex(a){var b="",c,d=0,e;for(c=0;c<a.length;++c){if(a.charAt(c)==b64pad)break;v=b64map.indexOf(a.charAt(c));if(v<0)continue;d==0?(b+=int2char(v>>2),e=v&3,d=1):d==1?(b+=int2char(e<<2|v>>4),e=v&15,d=2):d==2?(b+=int2char(e),b+=int2char(v>>2),e=v&3,d=3):(b+=int2char(e<<2|v>>4),b+=int2char(v&15),d=0)}return d==1&&(b+=int2char(e<<2)),b}function b64toBA(a){var b=b64tohex(a),c,d=new Array;for(c=0;2*c<b.length;++c)d[c]=parseInt(b.substring(2*c,2*c+2),16);return d}function _asnhex_getByteLengthOfL_AtObj(a,b){if(a.substring(b+2,b+3)!="8")return 1;var c=parseInt(a.substring(b+3,b+4));return c==0?-1:0<c&&c<10?c+1:-2}function _asnhex_getHexOfL_AtObj(a,b){var c=_asnhex_getByteLengthOfL_AtObj(a,b);return c<1?"":a.substring(b+2,b+2+c*2)}function _asnhex_getIntOfL_AtObj(a,b){var c=_asnhex_getHexOfL_AtObj(a,b);if(c=="")return-1;var d;return parseInt(c.substring(0,1))<8?d=parseBigInt(c,16):d=parseBigInt(c.substring(2),16),d.intValue()}function _asnhex_getStartPosOfV_AtObj(a,b){var c=_asnhex_getByteLengthOfL_AtObj(a,b);return c<0?c:b+(c+1)*2}function _asnhex_getHexOfV_AtObj(a,b){var c=_asnhex_getStartPosOfV_AtObj(a,b),d=_asnhex_getIntOfL_AtObj(a,b);return a.substring(c,c+d*2)}function _asnhex_getPosOfNextSibling_AtObj(a,b){var c=_asnhex_getStartPosOfV_AtObj(a,b),d=_asnhex_getIntOfL_AtObj(a,b);return c+d*2}function _asnhex_getPosArrayOfChildren_AtObj(a,b){var c=new Array,d=_asnhex_getStartPosOfV_AtObj(a,b);c.push(d);var e=_asnhex_getIntOfL_AtObj(a,b),f=d,g=0;for(;;){var h=_asnhex_getPosOfNextSibling_AtObj(a,f);if(h==null||h-d>=e*2)break;if(g>=200)break;c.push(h),f=h,g++}return c}function _x509_pemToBase64(a){var b=a;return b=b.replace("-----BEGIN CERTIFICATE-----",""),b=b.replace("-----END CERTIFICATE-----",""),b=b.replace(/[ \n]+/g,""),b}function _x509_pemToHex(a){var b=_x509_pemToBase64(a),c=b64tohex(b);return c}function _x509_getHexTbsCertificateFromCert(a){var b=_asnhex_getStartPosOfV_AtObj(a,0);return b}function _x509_getSubjectPublicKeyInfoPosFromCertHex(a){var b=_asnhex_getStartPosOfV_AtObj(a,0),c=_asnhex_getPosArrayOfChildren_AtObj(a,b);return c.length<1?-1:a.substring(c[0],c[0]+10)=="a003020102"?c.length<6?-1:c[6]:c.length<5?-1:c[5]}function _x509_getSubjectPublicKeyPosFromCertHex(a){var b=_x509_getSubjectPublicKeyInfoPosFromCertHex(a);if(b==-1)return-1;var c=_asnhex_getPosArrayOfChildren_AtObj(a,b);if(c.length!=2)return-1;var d=c[1];if(a.substring(d,d+2)!="03")return-1;var e=_asnhex_getStartPosOfV_AtObj(a,d);return a.substring(e,e+2)!="00"?-1:e+2}function _x509_getPublicKeyHexArrayFromCertHex(a){var b=_x509_getSubjectPublicKeyPosFromCertHex(a),c=_asnhex_getPosArrayOfChildren_AtObj(a,b);if(c.length!=2)return[];var d=_asnhex_getHexOfV_AtObj(a,c[0]),e=_asnhex_getHexOfV_AtObj(a,c[1]);return d!=null&&e!=null?[d,e]:[]}function _x509_getPublicKeyHexArrayFromCertPEM(a){var b=_x509_pemToHex(a),c=_x509_getPublicKeyHexArrayFromCertHex(b);return c}function _x509_readCertPEM(a){var b=_x509_pemToHex(a),c=_x509_getPublicKeyHexArrayFromCertHex(b),d=new RSAKey;d.setPublic(c[0],c[1]),this.subjectPublicKeyRSA=d,this.subjectPublicKeyRSA_hN=c[0],this.subjectPublicKeyRSA_hE=c[1]}function _x509_readCertPEMWithoutRSAInit(a){var b=_x509_pemToHex(a),c=_x509_getPublicKeyHexArrayFromCertHex(b);this.subjectPublicKeyRSA.setPublic(c[0],c[1]),this.subjectPublicKeyRSA_hN=c[0],this.subjectPublicKeyRSA_hE=c[1]}function X509(){this.subjectPublicKeyRSA=null,this.subjectPublicKeyRSA_hN=null,this.subjectPublicKeyRSA_hE=null}var dbits,canary=0xdeadbeefcafe,j_lm=(canary&16777215)==15715070;j_lm&&navigator.appName=="Microsoft Internet Explorer"?(BigInteger.prototype.am=am2,dbits=30):j_lm&&navigator.appName!="Netscape"?(BigInteger.prototype.am=am1,dbits=26):(BigInteger.prototype.am=am3,dbits=28),BigInteger.prototype.DB=dbits,BigInteger.prototype.DM=(1<<dbits)-1,BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP),BigInteger.prototype.F1=BI_FP-dbits,BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz",BI_RC=new Array,rr,vv;rr="0".charCodeAt(0);for(vv=0;vv<=9;++vv)BI_RC[rr++]=vv;rr="a".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;rr="A".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;Classic.prototype.convert=cConvert,Classic.prototype.revert=cRevert,Classic.prototype.reduce=cReduce,Classic.prototype.mulTo=cMulTo,Classic.prototype.sqrTo=cSqrTo,Montgomery.prototype.convert=montConvert,Montgomery.prototype.revert=montRevert,Montgomery.prototype.reduce=montReduce,Montgomery.prototype.mulTo=montMulTo,Montgomery.prototype.sqrTo=montSqrTo,BigInteger.prototype.copyTo=bnpCopyTo,BigInteger.prototype.fromInt=bnpFromInt,BigInteger.prototype.fromString=bnpFromString,BigInteger.prototype.clamp=bnpClamp,BigInteger.prototype.dlShiftTo=bnpDLShiftTo,BigInteger.prototype.drShiftTo=bnpDRShiftTo,BigInteger.prototype.lShiftTo=bnpLShiftTo,BigInteger.prototype.rShiftTo=bnpRShiftTo,BigInteger.prototype.subTo=bnpSubTo,BigInteger.prototype.multiplyTo=bnpMultiplyTo,BigInteger.prototype.squareTo=bnpSquareTo,BigInteger.prototype.divRemTo=bnpDivRemTo,BigInteger.prototype.invDigit=bnpInvDigit,BigInteger.prototype.isEven=bnpIsEven,BigInteger.prototype.exp=bnpExp,BigInteger.prototype.toString=bnToString,BigInteger.prototype.negate=bnNegate,BigInteger.prototype.abs=bnAbs,BigInteger.prototype.compareTo=bnCompareTo,BigInteger.prototype.bitLength=bnBitLength,BigInteger.prototype.mod=bnMod,BigInteger.prototype.modPowInt=bnModPowInt,BigInteger.ZERO=nbv(0),BigInteger.ONE=nbv(1),NullExp.prototype.convert=nNop,NullExp.prototype.revert=nNop,NullExp.prototype.mulTo=nMulTo,NullExp.prototype.sqrTo=nSqrTo,Barrett.prototype.convert=barrettConvert,Barrett.prototype.revert=barrettRevert,Barrett.prototype.reduce=barrettReduce,Barrett.prototype.mulTo=barrettMulTo,Barrett.prototype.sqrTo=barrettSqrTo;var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509],lplim=(1<<26)/lowprimes[lowprimes.length-1];BigInteger.prototype.chunkSize=bnpChunkSize,BigInteger.prototype.toRadix=bnpToRadix,BigInteger.prototype.fromRadix=bnpFromRadix,BigInteger.prototype.fromNumber=bnpFromNumber,BigInteger.prototype.bitwiseTo=bnpBitwiseTo,BigInteger.prototype.changeBit=bnpChangeBit,BigInteger.prototype.addTo=bnpAddTo,BigInteger.prototype.dMultiply=bnpDMultiply,BigInteger.prototype.dAddOffset=bnpDAddOffset,BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo,BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo,BigInteger.prototype.modInt=bnpModInt,BigInteger.prototype.millerRabin=bnpMillerRabin,BigInteger.prototype.clone=bnClone,BigInteger.prototype.intValue=bnIntValue,BigInteger.prototype.byteValue=bnByteValue,BigInteger.prototype.shortValue=bnShortValue,BigInteger.prototype.signum=bnSigNum,BigInteger.prototype.toByteArray=bnToByteArray,BigInteger.prototype.equals=bnEquals,BigInteger.prototype.min=bnMin,BigInteger.prototype.max=bnMax,BigInteger.prototype.and=bnAnd,BigInteger.prototype.or=bnOr,BigInteger.prototype.xor=bnXor,BigInteger.prototype.andNot=bnAndNot,BigInteger.prototype.not=bnNot,BigInteger.prototype.shiftLeft=bnShiftLeft,BigInteger.prototype.shiftRight=bnShiftRight,BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit,BigInteger.prototype.bitCount=bnBitCount,BigInteger.prototype.testBit=bnTestBit,BigInteger.prototype.setBit=bnSetBit,BigInteger.prototype.clearBit=bnClearBit,BigInteger.prototype.flipBit=bnFlipBit,BigInteger.prototype.add=bnAdd,BigInteger.prototype.subtract=bnSubtract,BigInteger.prototype.multiply=bnMultiply,BigInteger.prototype.divide=bnDivide,BigInteger.prototype.remainder=bnRemainder,BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder,BigInteger.prototype.modPow=bnModPow,BigInteger.prototype.modInverse=bnModInverse,BigInteger.prototype.pow=bnPow,BigInteger.prototype.gcd=bnGCD,BigInteger.prototype.isProbablePrime=bnIsProbablePrime,Arcfour.prototype.init=ARC4init,Arcfour.prototype.next=ARC4next;var rng_psize=256,rng_state,rng_pool,rng_pptr;if(rng_pool==null){rng_pool=new Array,rng_pptr=0;var t;if(navigator.appName=="Netscape"&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(t=0;t<z.length;++t)rng_pool[rng_pptr++]=z.charCodeAt(t)&255}while(rng_pptr<rng_psize)t=Math.floor(65536*Math.random()),rng_pool[rng_pptr++]=t>>>8,rng_pool[rng_pptr++]=t&255;rng_pptr=0,rng_seed_time()}SecureRandom.prototype.nextBytes=rng_get_bytes,RSAKey.prototype.doPublic=RSADoPublic,RSAKey.prototype.setPublic=RSASetPublic,RSAKey.prototype.encrypt=RSAEncrypt,RSAKey.prototype.doPrivate=RSADoPrivate,RSAKey.prototype.setPrivate=RSASetPrivate,RSAKey.prototype.setPrivateEx=
RSASetPrivateEx,RSAKey.prototype.generate=RSAGenerate,RSAKey.prototype.decrypt=RSADecrypt,sha1=new function(){var a=64,b=[1732584193,4023233417,2562383102,271733878,3285377520],c=b.length;this.hex=function(a){return k(d(a))},this.dec=function(a){return d(a)},this.bin=function(a){return p(d(a))};var d=function(a){var b=[];return e(a)?b=a:f(a)?b=o(a):"unknown type",b=j(b),h(b)},e=function(a){return a&&a.constructor===[].constructor},f=function(a){return typeof a==typeof "string"},g=function(a,b){return a<<b|a>>>32-b},h=function(d){var e=[],f=[],h,i,j,k=[];for(i=0;i<c;i++)e[i]=b[i];for(h=0;h<d.length;h+=a){for(i=0;i<c;i++)f[i]=e[i];k=m(d.slice(h,h+a));for(i=16;i<80;i++)k[i]=g(k[i-3]^k[i-8]^k[i-14]^k[i-16],1);for(i=0;i<80;i++)i<20?j=(e[1]&e[2]^~e[1]&e[3])+q[0]:i<40?j=(e[1]^e[2]^e[3])+q[1]:i<60?j=(e[1]&e[2]^e[1]&e[3]^e[2]&e[3])+q[2]:j=(e[1]^e[2]^e[3])+q[3],j+=g(e[0],5)+k[i]+e[4],e[4]=e[3],e[3]=e[2],e[2]=g(e[1],30),e[1]=e[0],e[0]=j;for(i=0;i<c;i++)e[i]+=f[i]}return l(e)},j=function(b){var c=b.length,d=c;b[d++]=128;while(d%a!=56)b[d++]=0;return c*=8,b.concat(0,0,0,0,l([c]))},k=function(a){var b,c="";for(b=0;b<a.length;b++)c+=(a[b]>15?"":"0")+a[b].toString(16);return c},l=function(a){var b=[];for(n=i=0;i<a.length;i++)b[n++]=a[i]>>>24&255,b[n++]=a[i]>>>16&255,b[n++]=a[i]>>>8&255,b[n++]=a[i]&255;return b},m=function(a){var b=[],c,d;for(d=c=0;c<a.length;c+=4,d++)b[d]=a[c]<<24|a[c+1]<<16|a[c+2]<<8|a[c+3];return b},o=function(a){var b,c,d,e=[];for(c=b=0;b<a.length;b++)d=a.charCodeAt(b),d<=255?e[c++]=d:(e[c++]=d>>>8,e[c++]=d&255);return e},p=function(a){var b,c="";for(b in a)c+=String.fromCharCode(a[b]);return c},q=[1518500249,1859775393,2400959708,3395469782]},sha256=new function(){var a=64,b=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],c=b.length;this.hex=function(a){return r(d(a))},this.dec=function(a){return d(a)},this.bin=function(a){return v(d(a))};var d=function(a){var b=[];return e(a)?b=a:f(a)?b=u(a):"unknown type",b=q(b),p(b)},e=function(a){return a&&a.constructor===[].constructor},f=function(a){return typeof a==typeof "string"},g=function(a,b){return a>>>b|a<<32-b},h=function(a){return g(a,2)^g(a,13)^g(a,22)},j=function(a){return g(a,6)^g(a,11)^g(a,25)},k=function(a){return g(a,7)^g(a,18)^a>>>3},l=function(a){return g(a,17)^g(a,19)^a>>>10},m=function(a,b,c){return a&b^~a&c},o=function(a,b,c){return a&b^a&c^b&c},p=function(d){var e=[],f=[],g,i,n,p,q=[];for(i=0;i<c;i++)e[i]=b[i];for(g=0;g<d.length;g+=a){for(i=0;i<c;i++)f[i]=e[i];q=t(d.slice(g,g+a));for(i=16;i<64;i++)q[i]=l(q[i-2])+q[i-7]+k(q[i-15])+q[i-16];for(i=0;i<64;i++)n=e[7]+j(e[4])+m(e[4],e[5],e[6])+w[i]+q[i],p=h(e[0])+o(e[0],e[1],e[2]),e[7]=e[6],e[6]=e[5],e[5]=e[4],e[4]=e[3]+n,e[3]=e[2],e[2]=e[1],e[1]=e[0],e[0]=n+p;for(i=0;i<c;i++)e[i]+=f[i]}return s(e)},q=function(b){var c=b.length,d=c;b[d++]=128;while(d%a!=56)b[d++]=0;return c*=8,b.concat(0,0,0,0,s([c]))},r=function(a){var b,c="";for(b=0;b<a.length;b++)c+=(a[b]>15?"":"0")+a[b].toString(16);return c},s=function(a){var b=[];for(n=i=0;i<a.length;i++)b[n++]=a[i]>>>24&255,b[n++]=a[i]>>>16&255,b[n++]=a[i]>>>8&255,b[n++]=a[i]&255;return b},t=function(a){var b=[],c,d;for(d=c=0;c<a.length;c+=4,d++)b[d]=a[c]<<24|a[c+1]<<16|a[c+2]<<8|a[c+3];return b},u=function(a){var b,c,d,e=[];for(c=b=0;b<a.length;b++)d=a.charCodeAt(b),d<=255?e[c++]=d:(e[c++]=d>>>8,e[c++]=d&255);return e},v=function(a){var b,c="";for(b in a)c+=String.fromCharCode(a[b]);return c},w=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]},RSAKey.prototype.readPrivateKeyFromPEMString=_rsapem_readPrivateKeyFromPEMString;var _RSASIGN_DIHEAD=[];_RSASIGN_DIHEAD.sha1="3021300906052b0e03021a05000414",_RSASIGN_DIHEAD.sha256="3031300d060960864801650304020105000420";var _RSASIGN_HASHHEXFUNC=[];_RSASIGN_HASHHEXFUNC.sha1=sha1.hex,_RSASIGN_HASHHEXFUNC.sha256=SHA256,RSAKey.prototype.signString=_rsasign_signString,RSAKey.prototype.signStringWithSHA1=_rsasign_signStringWithSHA1,RSAKey.prototype.signStringWithSHA256=_rsasign_signStringWithSHA256,RSAKey.prototype.verifyString=_rsasign_verifyString,RSAKey.prototype.verifyHexSignatureForMessage=_rsasign_verifyHexSignatureForMessage;var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",b64pad="=";X509.prototype.readCertPEM=_x509_readCertPEM,X509.prototype.readCertPEMWithoutRSAInit=_x509_readCertPEMWithoutRSAInit;