import{_ as U}from"./index.vue_vue_type_script_setup_true_lang-DrjQ59DJ.js";import{d as P,A as t,U as k,c as R,L as T,b as N,i as g,e as c,w as x,I as L,F as B,v as C,E as A,t as O,u as j,a as w,f as v,_ as q,o as V}from"./index-DvlLjNFd.js";/* empty css                  */import{P as W}from"./menuService-EopF3asC.js";const Y=l=>(O("data-v-67124205"),l=l(),j(),l),$={class:"grid-box"},F={class:"grid-header-box"},J=Y(()=>g("p",{class:"menu-alin-left"},"페이지 관리",-1)),z={class:"button-box"},H=P({__name:"PageManageGrid",props:{pageGridProp:{type:Object,default:null}},setup(l){const i=t(),o=t();k({id:null,pageName:null,pageUrl:null,pageDesc:null,useYn:null,delYn:null});const r=l,m=t({editable:!0}),u=t(),s=t(),h=t(),f=t([{field:"number",headerName:"No.",valueGetter:"node.rowIndex + 1",headerClass:"centered",cellClass:"centered",width:80,cellStyle:{width:80,filter:"text",sortable:!0,textAlign:"center"}},{field:"pageName",headerName:"페이지명",headerClass:"centered",cellClass:"centered",cellEditor:"agTextCellEditor",cellEditorParams:{maxLength:50},width:150,cellStyle:{width:150,filter:"text",sortable:!0}},{field:"pageUrl",headerName:"페이지 URL",headerClass:"centered",cellClass:"centered",cellEditor:"agTextCellEditor",cellEditorParams:{maxLength:50},width:300,cellStyle:{width:300,filter:"text",sortable:!0}},{field:"pageDesc",headerName:"페이지설명",headerClass:"centered",cellClass:"centered",cellEditor:"agTextCellEditor",cellEditorParams:{maxLength:50},width:400,cellStyle:{width:400,filter:"text",sortable:!0}},{field:"useYn",headerName:"사용여부",headerClass:"centered",cellClass:"centered",cellEditor:"agTextCellEditor",cellEditorParams:{maxLength:50},cellStyle:{width:100,filter:"text",sortable:!0}}]),y=t();y.value=f,R(()=>u.value||[]);const D=()=>{u.value=r.pageGridProp,h.value=JSON.parse(JSON.stringify(r.pageGridProp))};T(()=>r.pageGridProp,()=>{D()});const b=e=>{e.colDefs.field==="pageName"&&(console.log("~~~~~~ etc Cell Click : ",o.value),o.value.open(e.data.id))},E=e=>{s.value=e.api},G=()=>{s.value.applyTransaction({add:[f]})},I=()=>{S()},S=()=>{const e=h.value;s.value.applyTransaction({update:[s.value]}),s.value.forEachNode(function(a){const n=e.find(d=>d.Id===a.data.Id),p=e.find(d=>d.pageName!=a.data.pageName),_=e.find(d=>d.pageUrl!=a.data.pageUrl);if(console.log("oriItem :: ",_),console.log("oriPageName :: ",p),console.log("oriItemId :: ",n),a.data.pageName===""&&a.data.pageName===null){console.log("err node :: ",a.data.pageName),C.confirm("페이지명을 입력하세요","Warning",{cancelButtonText:"Cancel",type:"warning"}).then(async()=>{});return}else if(a.data.pageUrl===""){C.confirm("페이지 URL을 입력하세요","Warning",{cancelButtonText:"Cancel",type:"warning"}).then(async()=>{});return}n!==""&&(_!==""||n!=="")&&(console.log("node.data.pageName  :: ",a.data.pageName),console.log("oriPageName  ::  ",p))})},M=()=>{};return(e,a)=>{const n=A,p=U;return w(),N(B,null,[g("div",$,[g("div",F,[J,g("div",z,[c(n,{class:"basic-button flex justify-end",round:"",onClick:G},{default:x(()=>[v("등록")]),_:1}),c(n,{class:"basic-button flex justify-end",round:"",onClick:I},{default:x(()=>[v("저장")]),_:1})])]),c(p,{ref_key:"pageManaGrid",ref:i,style:{height:"750px",width:"100%"},class:"ag-theme-quartz px-5 pt-[10px] h-full",rowData:u.value,defaultColDef:m.value,columnDefs:f.value,"v-loading":!0,onGridReady:E,onCellClicked:b,WidthAndHeight:"'100%', '100%'"},null,8,["rowData","defaultColDef","columnDefs"])]),c(L(o),{ref_key:"PageManageDetailPopRef",ref:o,onOnSearchDataReload:M},null,512)],64)}}}),K=q(H,[["__scopeId","data-v-67124205"]]),Q={style:{display:"flex"}},te=P({__name:"pageManage",setup(l){const i=t([]);V(()=>{o()});const o=()=>{W.getPageListAll().then(r=>{i.value=r.data})};return(r,m)=>(w(),N("div",Q,[c(K,{pageGridProp:i.value,class:"margin-width100"},null,8,["pageGridProp"])]))}});export{te as default};
