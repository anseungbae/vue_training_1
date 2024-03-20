<template #default="{ node, data }">
  <el-scrollbar height="90%">
    <div class="grid-box">
      <div class="grid-header-box">
        <p class="menu-alin-left" style="margin-top: 5px">메뉴</p>
        <div class="button-box">
          <el-button class="basic-button flex justify-end" @click="onAddNode">Node 추가</el-button>
          <el-button class="basic-button flex justify-end" @click="onAddChildNode"
            >Child Node추가</el-button
          >
          <el-button class="basic-button flex justify-end" @click="onUpdateNode"> 저장</el-button>
        </div>
      </div>
      <el-tree
        style="min-width: 400px"
        :data="menuDataSource"
        draggable
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        show-checkbox
        node-key="id"
        default-expand="false"
        :render-content="renderContent"
        @node-click="onNodeClick"
        :filter-node-method="filterNode"
        :expand-on-click-node="true"
        :props="defaultProps"
        :indent="treeIndent"
        ref="treeRef"
      />
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import { ElTree } from 'element-plus'
import { formatToDate } from '@/utils/dateUtil'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
/** Local Variable **/

// date util start
let yymmdd = formatToDate()
const treeIndent = 40
//tree select param
const menuTreeProps = defineProps({
  menuTreeProp: {
    type: Object,
    default: null
  }
})
// tree interface data
interface Tree {
  id: number
  label: string
  menuName: string
  children?: Tree[]
}

const defaultProps = {
  children: 'children',
  label: 'label'
}

const menuDataSource = ref()

const treeRef = ref<InstanceType<typeof ElTree>>()

const emit = defineEmits(['menuParam', 'menuAddTreeParam']) // 선택된 메뉴 데이터 부모컨포넌트로 보냄
const menuRowParam = ref({
  id: null,
  menuName: null,
  menuDesc: '',
  menuType: '',
  menuUrl: '',
  menuIncludeType: '',
  pageId: '',
  useYn: '',
  mobileUseYn: '',
  upMenuId: '',
  menuLevel: null,
  menuIcon: '',
  mobilePageUrl: '',
  delYn: '',
  children: []
})

// 메뉴 Tree 클릭시 데이터  전달.
const onMenuTreeClick = (menuParamReset: any) => {
  if (menuParamReset.value == null) {
    menuParamReset()
  } else {
    const menuParam = {
      id: menuRowParam.value.id, // id
      menuName: menuRowParam.value.menuName, // 메뉴명
      menuDesc: menuRowParam.value.menuDesc, // 메뉴설명
      menuType: menuRowParam.value.menuType, // 메뉴 타입
      menuUrl: menuRowParam.value.menuUrl, // 메뉴Url
      menuIncludeType: menuRowParam.value.menuIncludeType, // 메뉴참조타입
      pageId: menuRowParam.value.pageId, // 페이지ID
      useYn: menuRowParam.value.useYn, // 사용여부
      mobileUseYn: menuRowParam.value.mobileUseYn, // 모바일사용여부
      upMenuId: menuRowParam.value.upMenuId, //
      menuLevel: menuRowParam.value.menuLevel, // 메뉴레벨
      menuIcon: menuRowParam.value.menuIcon, // 메뉴아이콘
      delYn: menuRowParam.value.delYn, // 삭제여부
      mobilePageUrl: menuRowParam.value.mobilePageUrl,
      children: menuRowParam.value.children // 자식노드
    }
    emit('menuParam', menuParam)
  }
}
// node 추가시 right page 내용 초기화(입력상태로)
const menuParamReset = () => {
  const menuParam = {}
  emit('menuParam', menuParam)
}

/** Service API **/

// Tree data setting 설정
const setMenuTreeData = () => {
  menuDataSource.value = menuTreeProps.menuTreeProp
}

/** Event Handler **/

// Tree DragStart 드레그 이동
const handleDragStart = (node: Node, ev: DragEvents) => {
  console.log('drag start', node)
}
// Tree Drag 이동 후 key event
const handleDragEnter = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag enter:', dropNode.label)
}
// Tree Drag 이동 완료 후 이벤트
const handleDragLeave = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag leave:', dropNode.label)
}

// Tree Drag 마우스 오버 이벤트
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag over:', dropNode.label)
}

// Tree Drag 종료 이벤트
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
const handleDrop = (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) => {
  console.log('tree drop:', dropNode.label, dropType)
}

// 부모창에서 넘어온 data tree setting event
watch([() => menuTreeProps.menuTreeProp], () => {
  setMenuTreeData()
})

//  Tree click event
const onClickTree = (data: any) => {
  console.log('onClickTree  :: ', data)
  menuRowParam.value = data
  onMenuTreeClick(menuRowParam)
}

// click 했을때 체크해준다.
const setCheckedKeys = (data: any) => {
  if (data.children !== null) {
    treeRef.value!.setCheckedNodes(data.children, false)
  } else {
    treeRef.value!.setCheckedNodes([data[0], false])
  }
}

//  Tree click event
const onNodeClick = (data: any) => {
  console.log('onNodeClick ::,   ', data)
  onClickTree(data)
  setCheckedKeys(data)
}

// Tree Node data setting
const renderContent = (
  h,
  {
    node,
    data,
    store
  }: {
    node: Node
    data: Tree
    store: Node['store']
  }
) => {
  return h(
    'span',
    {
      class: 'custom-tree-node'
    },
    h('span', null, node.label),
    h(
      'span',
      null,
      h(
        'span',
        {
          onClick: () => onClickTree(data)
        },
        h('span', data.menuName)
      )
    ),
    h(
      'span',
      null,
      h(
        'a',
        {
          onClick: () => onClickTree(data)
        },
        h('span', '')
      )
    )
  )
}

// 저장 버튼 click .. tree 저장 부모창으로  data 전달...
const onUpdateNode = () => {
  console.log('save ::  ', menuDataSource.value)
  emit('menuAddTreeParam', menuDataSource.value)
}

/** Local Functions **/

const filterNode = (value, data) => {
  console.log('data.children')
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

let idval = 1000
// Node 추가
const onAddNode = (data: Tree) => {
  if (!data) {
    data.children = []
  }

  let insertCnt = getInsertMenuId(menuDataSource.value, 0)
  let newNode = {
    children: [],
    createdAt: '',
    createdId: null,
    delYn: 'N',
    id: 'insert-' + idval++,
    menuDesc: '',
    menuIcon: null,
    menuLevel: 1,
    menuName: '메뉴추가-' + insertCnt + idval++,
    menuType: 'PAGE',
    menuUrl: '',
    mobilePageUrl: null,
    mobileUseYn: 'N',
    orderNo: '',
    page: null,
    pageId: null,
    upMenuId: null,
    updatedAt: '',
    updatedId: '',
    useYn: 'Y',
    insertMod: 'Y'
  }
  // 입력창에 생성된 node 정보 넣어주기
  onClickTree(newNode)
  menuDataSource.value.push(newNode)
}
let ids = 1
let idsNum = 1
// Child Node 추가
const onAddChildNode = () => {
  // 선택된 node가 없으면 return
  if (!menuRowParam.value) {
    return
  }
  if (!menuRowParam.value.children) {
    menuRowParam.value.children = []
  }

  let insertChildCnt = getInsertMenuId(menuRowParam.value, 0)
  let newChild = {
    children: [],
    createdAt: '',
    createdId: null,
    delYn: 'N',
    id: 'insert-' + yymmdd + ids++ + '-' + insertChildCnt,
    menuDesc: '',
    menuIcon: null,
    menuLevel: menuRowParam.value.menuLevel + 1,
    menuName: '메뉴추가-' + insertChildCnt + idsNum++,
    menuType: 'PAGE',
    menuUrl: '',
    mobilePageUrl: null,
    mobileUseYn: 'N',
    orderNo: '',
    page: null,
    pageId: null,
    upMenuId: null,
    updatedAt: '',
    updatedId: '',
    useYn: 'Y',
    insertMod: 'Y'
  }
  menuRowParam.value.children.push(newChild)
  if (menuRowParam.value.children) {
    onNodeClick(newChild)
  } else {
    menuParamReset()
  }
  newChild = null
}
// child id  선택된 리스트의  id값을 비교하여 id값 증가
const getInsertMenuId = (list: any, insertCnt: any) => {
  let len = list.length
  let currentSelectId = null
  console.log('currentSelectId :: ', menuRowParam.value.id)
  if (menuDataSource.value && menuRowParam.value.id) {
    currentSelectId = menuRowParam.value.id
  }

  for (let i = 0; i < len; i++) {
    if (list[i].id.search('insert') != -1) {
      insertCnt++
    }

    if (list[i].children && list[i].children.length > 0) {
      insertCnt = getInsertMenuId(list[i].children, insertCnt)
    }

    if (currentSelectId == list[i].id) {
      console.log('선택해놓은 아이템 : ', list[i].menuName)
    }
  }

  return insertCnt
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 580px;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding-right: 20px;
  padding-left: 20px;
  margin-top: 20px;
  border-radius: '3px';
  background-color: '#409eff';
}
</style>
