import{p as y,g as M,V as we,d as G,A as c,a as U,h as ue,w as l,i as m,e,W as Ne,k as ie,t as ce,u as re,_ as de,c as pe,b as k,f as _,B as Le,F as C,r as V,E as j,l as ve,m as me,n as _e,s as te,N as ge,q as oe,o as fe,L as Ie,x as se,P as xe,Q as Pe,R as Re,S as ne,U as Ue}from"./index-DvlLjNFd.js";/* empty css                  *//* empty css                 *//* empty css                  *//* empty css               */import{i as D,_ as ke}from"./index.vue_vue_type_script_setup_true_lang-DrjQ59DJ.js";const Q="admin/banner-group",Ee=Q+"/list",Be=Q+"/detail",Ce=Q+"/save",Se=Q+"/delete",$="admin/banner-image",ye=$+"/list",Ae=$+"/detail",De=$+"/save",Ve=$+"/delete",Ge=$+"/select-list",F="admin/banner-login-image",Ye=F+"/list",Oe=F+"/detail",Te=F+"/save",Me=F+"/delete",$e=F+"/getLoginBanner",Fe=n=>y(Ee,n),ze=n=>M(Be,n),We=n=>y(Ce,n),Ke=n=>y(Se,n),qe=n=>y(ye,n),je=n=>M(Ae,n),Qe=(n,s)=>we(De,n,s),He=n=>y(Ve,n),Je=n=>M(Ge,n),Xe=n=>y(Ye,n),Ze=n=>M(Oe,n),el=n=>y(Te,n),ll=n=>y(Me,n),al=()=>M($e),nl={getBannerLoginImageList:Xe,getBannerLoginImageDetail:Ze,saveBannerLoginImage:el,deleteBannerLoginImageList:ll,getBannerLoginList:al,getBannerGroupList:Fe,getBannerGroupDetail:ze,saveBannerGroup:We,getBannerImageList:qe,getBannerImageDetail:je,saveBannerImage:Qe,deleteBannerImageList:He,getBannerImageSelectList:Je,deleteBannerGroupList:Ke},q=nl,tl=n=>(ce("data-v-6e92efcc"),n=n(),re(),n),ol={class:"wrap",style:{"min-width":"468px","min-height":"468px"}},sl=tl(()=>m("div",{class:"row"},[m("div",{class:"column"},[m("span",{class:"popup-title"},"미리보기")])],-1)),ul={class:"myForm",style:{"margin-top":"10px"}},il=G({__name:"BannerPreviewPopup",setup(n,{expose:s}){const u=c(!1),N=c(null);return s({open:b=>{console.log("urlllllllllllllllllllllll : ",b),N.value=b,u.value=!0}}),(b,f)=>{const L=Ne,h=ie;return U(),ue(h,{modelValue:u.value,"onUpdate:modelValue":f[0]||(f[0]=o=>u.value=o),"align-center":"",width:"500",height:"500"},{default:l(()=>[m("div",ol,[sl,m("div",ul,[e(L,{style:{width:"100%",height:"100%"},src:N.value,"zoom-rate":1.2,"max-scale":7,"min-scale":.2,"initial-index":4,fit:"cover"},null,8,["src"])])])]),_:1},8,["modelValue"])}}}),be=de(il,[["__scopeId","data-v-6e92efcc"]]),cl=n=>(ce("data-v-cf9c9f48"),n=n(),re(),n),rl=cl(()=>m("hr",null,null,-1)),dl={class:"flex justify-between mt-[10px]"},pl={class:"subtitle-font"},vl=G({__name:"BannerImageDetailPopup",emits:["onSearchDataReload"],setup(n,{expose:s,emit:u}){const{alert:N,confirm:g}=ge(),b=u,f=c(null),L=c(null),h=c(null),o=[{value:"Y",label:"사용"},{value:"N",label:"사용안함"}],p=[{value:"Y",label:"사용"},{value:"N",label:"사용안함"}],R=[{value:"LOGIN",label:"로그인 배너"},{value:"MAINTOP",label:"메인 상단 배너"}],S=c(null),P=c(!1),E=c(null);c(null);const w=c(null);c(null);const v=c(null),Y=c(null),a=c({id:null,imageDesc:null,linkNewWindowYn:null,linkUrl:"",name:null,oriFileName:null,usePage:null,useYn:null,fileGroupId:null}),H=c(""),J=c({type:"save",title:"알람",message:"수정한 정보를 저장하시겠습니까?"});c({type:"reset",title:"알람",message:"회원의 비밀번호를 초기화를 하시겠습니까?"}),pe(()=>w.value||[]);const X=()=>{S.value.open(Y.value)},z=i=>{i?(console.log("1111111111111"),E.value=i,console.log("pkUserId : ",E.value),W(),P.value=!0,L.value=!0,console.log("isPreView : ",L)):(console.log("2222222222222222 : ",E.value),E.value="",W(),P.value=!0,L.value=!1)},W=()=>{const i={id:E.value};console.log("parrrrrr : ",i),q.getBannerImageDetail(i).then(t=>{console.log("데이터어어 : ",t),a.value.id=t.data.id,a.value.imageDesc=t.data.imageDesc,a.value.linkNewWindowYn=t.data.linkNewWindowYn,a.value.linkUrl=t.data.linkUrl,a.value.name=t.data.name,a.value.oriFileName=t.data.oriFileName,a.value.usePage=t.data.usePage,a.value.useYn=t.data.useYn,a.value.fileGroupId=t.data.fileGroupId!=="null"?t.data.fileGroupId:null,Y.value=t.data.fileUrl})},Z=i=>{g("저장하시겠습니까?","오류",null,t=>{t=="confirm"&&(I()?x():N(h.value,"경고",null,()=>{}))})},ee=()=>{f.value.click()},I=()=>D(a.value.name)?(h.value="이미지 명을 입력해주세요.",!1):D(a.value.imageDesc)?(h.value="이미지 설명을 입력해주세요.",!1):D(a.value.oriFileName)?(h.value="이미지를 선택해주세요.",!1):D(a.value.linkUrl)?(h.value="Link주소를 입력해주세요.",!1):D(a.value.linkNewWindowYn)?(h.value="새창오픈여부를 선택해주세요.",!1):D(a.value.useYn)?(h.value="사용여부를 선택해주세요.",!1):D(a.value.usePage)?(h.value="적용영역을 선택해주세요.",!1):!0,x=()=>{const i=new FormData;i.append("uploadFile",v.value),i.append("saveMode",a.value.id?"update":"insert"),i.append("id",a.value.id),i.append("name",a.value.name),i.append("imageDesc",a.value.imageDesc),i.append("linkUrl",a.value.linkUrl),i.append("linkNewWindowYn",a.value.linkNewWindowYn),i.append("useYn",a.value.useYn),i.append("fileGroupId",a.value.fileGroupId),i.append("usePage",a.value.usePage);const t={headers:{"Content-Type":"multipart/form-data"}};console.log("form DATA : ",i),console.log("form config : ",t),q.saveBannerImage(i,t).then(B=>{console.log("userModify ",B.data),B.data&&(H.value="저장하였습니다.",O())}).catch(B=>N(B))},O=()=>{b("onSearchDataReload"),P.value=!1},T=i=>{console.log("222222222222222 : ",i),v.value=i.target.files[0],console.log("222222222222222 : ",v.value),console.log("333333333333333 : ",i.target.files[0]),a.value.oriFileName=i.target.files[0].name};return s({open:z}),(i,t)=>{const B=j,d=ve,K=me,A=_e,le=oe,ae=te,he=ie;return U(),k(C,null,[e(he,{modelValue:P.value,"onUpdate:modelValue":t[8]||(t[8]=r=>P.value=r),class:"min-w-[550px] min-h-[300px] pb-0 t-0%",width:"600",title:"배너이미지 저장"},{default:l(()=>[rl,m("div",dl,[m("div",null,[L.value?(U(),ue(B,{key:0,class:"basic-button",onClick:X},{default:l(()=>[_("미리보기")]),_:1})):Le("",!0)]),m("div",null,[e(B,{class:"basic-button",onClick:t[0]||(t[0]=r=>Z(J.value))},{default:l(()=>[_("저장")]),_:1})])]),m("div",pl,[e(A,{class:"row-box"},{default:l(()=>[e(d,{span:6,class:"input-label"},{default:l(()=>[_(" 이미지 명")]),_:1}),e(d,{span:18,class:"input-content"},{default:l(()=>[e(K,{modelValue:a.value.name,"onUpdate:modelValue":t[1]||(t[1]=r=>a.value.name=r),"input-style":{fontSize:"12px"},disable:""},null,8,["modelValue"])]),_:1})]),_:1}),e(A,{class:"row-box"},{default:l(()=>[e(d,{span:6,class:"input-label"},{default:l(()=>[_(" 이미지 설명")]),_:1}),e(d,{span:18,class:"input-content"},{default:l(()=>[e(K,{modelValue:a.value.imageDesc,"onUpdate:modelValue":t[2]||(t[2]=r=>a.value.imageDesc=r),"input-style":{fontSize:"12px"},disable:""},null,8,["modelValue"])]),_:1})]),_:1}),e(A,{class:"row-box"},{default:l(()=>[e(d,{span:6,class:"input-label"},{default:l(()=>[_(" 이미지 ")]),_:1}),e(d,{span:13,class:"input-content"},{default:l(()=>[e(K,{modelValue:a.value.oriFileName,"onUpdate:modelValue":t[3]||(t[3]=r=>a.value.oriFileName=r),"input-style":{fontSize:"12px"},disabled:""},null,8,["modelValue"])]),_:1}),e(d,{span:1,class:"input-content"},{default:l(()=>[e(B,{class:"basic-button",onClick:ee},{default:l(()=>[_("파일선택")]),_:1})]),_:1}),m("input",{ref_key:"fileRef",ref:f,type:"file",accept:"image/*",onChange:T,style:{display:"none"}},null,544)]),_:1}),e(A,{class:"row-box"},{default:l(()=>[e(d,{span:6,class:"input-label"},{default:l(()=>[_(" Link 주소")]),_:1}),e(d,{span:18,class:"input-content"},{default:l(()=>[e(K,{modelValue:a.value.linkUrl,"onUpdate:modelValue":t[4]||(t[4]=r=>a.value.linkUrl=r),"input-style":{fontSize:"12px"},disable:""},null,8,["modelValue"])]),_:1})]),_:1}),e(A,{class:"row-box"},{default:l(()=>[e(d,{span:6,class:"input-label"},{default:l(()=>[_(" 새창오픈여부")]),_:1}),e(d,{span:18,class:"input-content"},{default:l(()=>[e(ae,{modelValue:a.value.linkNewWindowYn,"onUpdate:modelValue":t[5]||(t[5]=r=>a.value.linkNewWindowYn=r),placeholder:"선택",style:{width:"250px"}},{default:l(()=>[(U(),k(C,null,V(p,r=>e(le,{key:r.value,label:r.label,value:r.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(A,{class:"row-box"},{default:l(()=>[e(d,{span:6,class:"input-label"},{default:l(()=>[_(" 사용여부")]),_:1}),e(d,{span:18,class:"input-content"},{default:l(()=>[e(ae,{modelValue:a.value.useYn,"onUpdate:modelValue":t[6]||(t[6]=r=>a.value.useYn=r),placeholder:"선택",style:{width:"250px"}},{default:l(()=>[(U(),k(C,null,V(o,r=>e(le,{key:r.value,label:r.label,value:r.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(A,{class:"row-box"},{default:l(()=>[e(d,{span:6,class:"input-label"},{default:l(()=>[_(" 적용영역 선택")]),_:1}),e(d,{span:18,class:"input-content"},{default:l(()=>[e(ae,{modelValue:a.value.usePage,"onUpdate:modelValue":t[7]||(t[7]=r=>a.value.usePage=r),placeholder:"선택",style:{width:"250px"}},{default:l(()=>[(U(),k(C,null,V(R,r=>e(le,{key:r.value,label:r.label,value:r.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1})])]),_:1},8,["modelValue"]),e(be,{ref_key:"bannerPreviewRef",ref:S},null,512)],64)}}}),ml=de(vl,[["__scopeId","data-v-cf9c9f48"]]),_l=G({__name:"BannerImagePreviewButtonRender",props:{params:{}},setup(n){const s=n,u=()=>{const N=s.params.data.fileUrl;s.params.clicked(N)};return fe(()=>{}),pe(()=>{}),(N,g)=>{const b=j;return U(),k("span",null,[e(b,{style:{"background-color":"#0055d4",color:"white"},size:"small",onClick:u},{default:l(()=>[_("미리보기")]),_:1})])}}}),gl={class:"grid-box flex flex-col flex-1 mt-5 min-w-[1200px] h-full"},fl={class:"button-box grid-header-box h-[44px]"},bl={class:"grid-box flex flex-col flex-1"},hl={class:"flex"},wl={class:"total-page-label"},Nl={class:"data-grid-large-box"},Ll={class:"footer-pagination"},Il=G({__name:"BannerImageGrid",props:{dataProp:{type:Array},totalElemnetCnt:{type:Number}},emits:["pageChange","changeRowsPerPage","getBannerImageList"],setup(n,{emit:s}){const{alert:u,confirm:N}=ge(),g=n,b=s,f=c([]),L=c(null),h=c(null),o=c(),p=c(0),R=c(0),S=c(0),P=c(0),E=[{value:10,label:"10개씩"},{value:20,label:"20개씩"},{value:30,label:"30개씩"},{value:50,label:"50개씩"},{value:100,label:"100개씩"}],w=c({pageNo:1,rowCnt:20}),v=c([{width:60,headerCheckboxSelection:!0,checkboxSelection:!0,editable:!0,headerCheckboxSelectionFilteredOnly:!0,showDisabledCheckboxes:!0},{field:"id",headerName:"번호",width:80,cellStyle:{textAlign:"center"}},{field:"name",headerName:"이미지명",width:250,flex:1,cellStyle:{textDecoration:"underline",cursor:"pointer",textAlign:"center"}},{field:"imageDesc",headerName:"이미지 설명",width:230,cellStyle:{textAlign:"center"}},{field:"linkUrl",headerName:"링크주소",width:230,cellStyle:{textAlign:"center"}},{field:"usePage",headerName:"사용페이지",width:230,cellStyle:{textAlign:"center"}},{field:"linkNewWindowYn",headerName:"새창오픈여부",width:100,cellStyle:{textAlign:"center"}},{field:"useYn",headerName:"사용여부",width:100,cellStyle:{textAlign:"center"}},{field:"cellRender",headerName:"미리보기",width:100,cellRenderer:_l,cellRendererParams:{clicked:I=>{h.value.open(I)}},cellStyle:{textAlign:"center"}}]),Y=()=>{w.value.rowCnt=p.value,b("pageChange",w)},a=()=>{w.value.pageNo=1,w.value.rowCnt=p.value,b("pageChange",w)};Ie(g,()=>{console.log("props data : ",g.dataProp),console.log("props total : ",g),H()});const H=()=>{f.value=g.dataProp,R.value=Number(g.totalElemnetCnt),p.value=w.value.rowCnt,P.value=w.value.pageNo*w.value.rowCnt,S.value=P.value-(w.value.rowCnt-1),P.value>R.value&&(P.value=R.value)},J=I=>{console.log("@@@@@@@@@@@@@@@ : ",I.data.id),I.colDef.field==="name"&&(console.log("~~~~~~ etc Cell Click : ",L.value),L.value.open(I.data.id))},X=()=>{L.value.open()},z=()=>{b("getBannerImageList")},W=I=>{console.log("onRowSelected : ",I)},Z=I=>{o.value=I==null?void 0:I.api},ee=I=>{const x=o.value.getSelectedRows();if(console.log("222222222222222222 : ",x),x&&x.length>0){let T={deleteList:x.map(i=>i.id)};N("삭제하시겠습니까?","삭제",{},i=>{i==="confirm"&&q.deleteBannerImageList(T).then(t=>{console.log("getUserCsList ",t.data),z()})})}else u("삭제할 목록을 선택해 주세요.","알림",null,()=>{})};return(I,x)=>{const O=j,T=oe,i=te,t=ke,B=Re;return U(),k(C,null,[m("div",gl,[m("div",fl,[e(O,{class:"basic-button",round:"",onClick:X},{default:l(()=>[_("등록")]),_:1}),e(O,{class:"basic-button",round:"",onClick:ee},{default:l(()=>[_("삭제")]),_:1})]),m("div",bl,[m("div",hl,[e(i,{placeholder:"20개씩",style:{width:"100px",margin:"15px 5px 0px 20px"},modelValue:p.value,"onUpdate:modelValue":x[0]||(x[0]=d=>p.value=d),onChange:a},{default:l(()=>[(U(),k(C,null,V(E,d=>e(T,{key:d.value,label:d.label,value:d.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"]),m("div",wl,se(`전체 ${R.value}개 중`),1),xe(m("div",{class:"current-pagerange-label"},se(`${S.value}~${P.value}개`),513),[[Pe,R.value!==0]])]),m("div",Nl,[e(t,{rowSelection:"multiple",class:"ag-theme-quartz",rowData:f.value,columnDefs:v.value,onOnGridCellClick:J,onOnGridReady:Z},null,8,["rowData","columnDefs"])]),m("div",Ll,[e(B,{"current-page":w.value.pageNo,"onUpdate:currentPage":x[1]||(x[1]=d=>w.value.pageNo=d),"page-size":p.value,"onUpdate:pageSize":x[2]||(x[2]=d=>p.value=d),total:R.value,"onUpdate:total":x[3]||(x[3]=d=>R.value=d),"page-sizes":[10,20,30,50,100],layout:" prev, pager, next",onSizeChange:Y,onCurrentChange:Y,onRowSelected:W},null,8,["current-page","page-size","total"])])])]),e(ml,{ref_key:"bannerDetailPopRef",ref:L,onOnSearchDataReload:z},null,512),e(be,{ref_key:"bannerPreviewRef",ref:h},null,512)],64)}}}),xl={class:"searchbox-box mb-0"},Pl={class:"flex-col my-auto"},Rl=G({__name:"BannerImageSearch",emits:["searchList","searchReset"],setup(n,{emit:s}){const u=c({name:null,imageDesc:null,linkUrl:null,useYn:null,usePage:null,rowCnt:20,pageNo:1}),N=[{value:"All",label:"전체"},{value:"Y",label:"사용"},{value:"N",label:"사용안함"}],g=[{value:"All",label:"전체"},{value:"LOGIN",label:"로그인 배너"},{value:"MAINTOP",label:"메인 상단 배너"}],b=s,f=()=>{console.log("searchParam : ",u.value),b("searchList",u.value)},L=()=>{u.value.name=null,u.value.imageDesc=null,u.value.linkUrl=null,u.value.useYn=null,u.value.usePage=null,u.value.rowCnt=20,u.value.pageNo=1,b("searchReset",u.value)};return(h,o)=>{const p=ve,R=me,S=_e,P=oe,E=te,w=j;return U(),k("div",xl,[m("div",null,[e(S,{class:"mb-2"},{default:l(()=>[e(p,{span:2,class:"search-label"},{default:l(()=>[_("이미지명 ")]),_:1}),e(p,{span:6,class:"pr-5"},{default:l(()=>[e(R,{modelValue:u.value.name,"onUpdate:modelValue":o[0]||(o[0]=v=>u.value.name=v),placeholder:"제목",clearable:"",onKeyup:ne(f,["enter"])},null,8,["modelValue"])]),_:1}),e(p,{span:2,class:"search-label"},{default:l(()=>[_("이미지 설명 ")]),_:1}),e(p,{span:6,class:"pr-5"},{default:l(()=>[e(R,{modelValue:u.value.imageDesc,"onUpdate:modelValue":o[1]||(o[1]=v=>u.value.imageDesc=v),placeholder:"제목",clearable:"",onKeyup:ne(f,["enter"])},null,8,["modelValue"])]),_:1}),e(p,{span:8})]),_:1}),e(S,{class:"items-center"},{default:l(()=>[e(p,{span:2,class:"search-label"},{default:l(()=>[_(" 링크주소")]),_:1}),e(p,{span:6,class:"pr-5"},{default:l(()=>[e(R,{modelValue:u.value.linkUrl,"onUpdate:modelValue":o[2]||(o[2]=v=>u.value.linkUrl=v),placeholder:"링크를 입력해주세요.",clearable:"",onKeyup:ne(f,["enter"])},null,8,["modelValue"])]),_:1}),e(p,{span:2,class:"search-label"},{default:l(()=>[_(" 사용여부")]),_:1}),e(p,{span:4,class:"pr-5"},{default:l(()=>[e(E,{modelValue:u.value.useYn,"onUpdate:modelValue":o[3]||(o[3]=v=>u.value.useYn=v),class:"w-30",placeholder:"선택",onChange:f},{default:l(()=>[(U(),k(C,null,V(N,v=>e(P,{key:v.value,label:v.label,value:v.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),e(p,{span:2,class:"search-label"},{default:l(()=>[_(" 사용페이지")]),_:1}),e(p,{span:4,class:"pr-5"},{default:l(()=>[e(E,{modelValue:u.value.usePage,"onUpdate:modelValue":o[4]||(o[4]=v=>u.value.usePage=v),class:"w-30",placeholder:"선택",onChange:f},{default:l(()=>[(U(),k(C,null,V(g,v=>e(P,{key:v.value,label:v.label,value:v.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),e(p,{span:4})]),_:1})]),m("div",Pl,[e(w,{class:"searchbox-button",round:"",onClick:L},{default:l(()=>[_("초기화")]),_:1}),e(w,{class:"searchbox-button mt-2",round:"",onClick:f},{default:l(()=>[_("조회")]),_:1})])])}}}),yl=G({__name:"BannerImageManage",setup(n){const s=Ue({rowCnt:20,pageNo:1,name:null,imageDesc:null,linkUrl:null,useYn:null,usePage:null}),u=c(0);c({isPopupOpen:!1,id:null});const N=c([]);fe(()=>{g()});const g=()=>{console.log("getBannerImageList : ",s),q.getBannerImageList(s).then(o=>{u.value=Number(o.data.totalElements),N.value=o.data.bannerImageList?o.data.bannerImageList:[]})},b=o=>{s.name=o.name,s.imageDesc=o.imageDesc,s.linkUrl=o.linkUrl,s.useYn=o.useYn=="All"?"":o.useYn,s.usePage=o.usePage=="All"?"":o.usePage,console.log("search param  : ",s),g()},f=()=>{s.name=null,s.imageDesc=null,s.linkUrl=null,s.useYn=null,s.usePage=null,s.rowCnt=20,s.pageNo=1,g()},L=o=>{s.pageNo=o.value.pageNo,s.rowCnt=o.value.rowCnt,console.log("search param change : ",s),g()},h=o=>{s.pageNo=o.value.pageNo,s.rowCnt=o.value.rowCnt,console.log("search param change : ",s),g()};return(o,p)=>(U(),k(C,null,[e(Rl,{onSearchList:b,onSearchReset:f}),e(Il,{dataProp:N.value,onPageChange:L,totalElemnetCnt:u.value,onChangeRowsPerPage:h,onGetBannerImageList:g},null,8,["dataProp","totalElemnetCnt"])],64))}});export{yl as default};