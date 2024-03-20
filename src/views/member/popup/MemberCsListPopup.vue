<template>
  <el-dialog
    v-model="memberCsListPopupOpened"
    class="modal-title modal-small"
    title="상담내역 목록"
    align-center
  >
    <div class="modal-box">
      <div style="min-width: 500px; min-height: 600px">
        <div class="searchbox-box items-center" style="min-width: 0">
          <div>
            <el-row>
              <el-col :span="2" class="search-label">제목/내용 </el-col>
              <el-col :span="5">
                <el-input
                  v-model="searchData"
                  placeholder="제목 or 내용"
                  clearable
                  style="width: 250px"
                  @keyup.enter="onSearch"
                  @clear="onSearch"
                />
              </el-col>
              <el-col :span="6" class="search-label">처리상태</el-col>
              <el-col :span="5">
                <el-select
                  v-model="csProcessSts"
                  placeholder="전체"
                  style="width: 150px"
                  @change="onSearch"
                >
                  <el-option
                    v-for="item in csProcessStsList"
                    :key="item.code"
                    :label="item.codeName"
                    :value="item.code"
                  />
                </el-select>
              </el-col>
              <el-col :span="6"> </el-col>
            </el-row>
          </div>
          <div>
            <el-button class="searchbox-button" @click="onSearch">조회</el-button>
          </div>
        </div>

        <div class="grid-box mt-5">
          <div class="grid-header-box-end">
            <div class="button-box">
              <el-button class="grid-button" @click="onMemberCsInsOpenPopBtnClick">등록 </el-button>
            </div>
          </div>
          <div class="data-grid-large-box">
            <DataGrid
              ref="businessGridRef"
              class="ag-theme-quartz"
              style="height: 540px"
              :rowData="getMemberCsGridItems"
              :columnDefs="memberCsColDefs"
              @onGridCellClick="onMemberCsGridCellClick"
              @onGridReady="onGridReady"
            />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <MemberCsDetailPopup
    ref="memberCsDetailPopRef"
    @onMemberCsDetailInfoSaveComplete="getMemberCsListApi"
  />
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import UserCsService from '@/api/userCsService'
import MemberCsDetailPopup from '@/views/member/popup/MemberCsDetailPopup.vue' // Vue Grid Logic
import { dateToString } from '@/utils/gridFormatter'
import CodeService from '@/api/codeService'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'

const { loadStart, loadDone } = usePageLoading()
const props = defineProps({
  dataProp: {
    type: Array
  }
}) //부모컨포넌트에서 데이터 전달받음

const gridApi = ref(null)
const memberCsListPopupOpened = ref(false)
const pkUserId = ref(null)
const memberCsDetailPopRef = ref(null)
const memberCsGridItems = ref(null)
const searchData = ref(null)

const csProcessSts = ref(null)
const csProcessStsList = ref([])
const memberCsColDefs = [
  {
    field: 'id',
    headerName: '상담번호',
    width: 70,
    sortable: false,
    cellStyle: {
      filter: 'text',
      textAlign: 'right'
    }
  },
  {
    field: 'title',
    headerName: '제목',
    flex: 1,
    sortable: false,
    cellStyle: {
      filter: 'text',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  {
    field: 'csProcessStsName',
    headerName: '처리상태',
    sortable: false,
    width: 100,
    cellStyle: {
      filter: 'text',
      textAlign: 'center'
    }
  },
  {
    field: 'csDate',
    headerName: '상담일',
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    width: 100,
    cellStyle: {
      filter: 'text',
      textAlign: 'center'
    }
  },
  {
    field: 'csCompDate',
    headerName: '상담완료일',
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    width: 100,
    cellStyle: {
      filter: 'text',
      textAlign: 'center'
    }
  }
]

const onGridReady = (params: any) => {
  gridApi.value = params?.api
}

//  상담내역 목록 API 호출
const getMemberCsListApi = () => {
  loadStart()
  const param = {
    userId: pkUserId.value,
    searchValue: searchData.value,
    csProcessSts: csProcessSts.value == 'All' ? '' : csProcessSts.value
  }
  UserCsService.getUserCsList(param).then((res) => {
    memberCsGridItems.value = res.data
  })
  loadDone()
}

//공통코드 조회
const getcsProcessStsCodeListApi = () => {
  CodeService.getCodeListByPCode('csProcessSts').then((res) => {
    let data = [
      {
        code: 'All',
        codeName: '전체',
        createdAt: '',
        createdId: '',
        description: '',
        id: null,
        label: null,
        pCode: '',
        seq: null,
        updatedAt: '',
        updatedId: '',
        useYn: '',
        value: ''
      },
      ...res.data
    ]
    csProcessStsList.value = data

    // pageIdsList.value = res.data
  })
}

const open = (userId) => {
  //  넘어온 User ID 설정
  pkUserId.value = userId
  memberCsListPopupOpened.value = true
  getcsProcessStsCodeListApi()
  //  상담내역 목록 조회
  getMemberCsListApi()
}
const onMemberCsGridCellClick = (event) => {
  if (event.colDef.field === 'title') {
    memberCsDetailPopRef.value.open(pkUserId.value, event.data.id)
  }
}
//  고객상담 등록 버튼 Click Event
const onMemberCsInsOpenPopBtnClick = () => {
  //
  memberCsDetailPopRef.value.open(pkUserId.value, null)
}

const getMemberCsGridItems = computed(() => {
  return memberCsGridItems.value || []
})

const onSearch = () => {
  getMemberCsListApi()
}

defineExpose({
  open
})
</script>
<style lang="scss" scoped></style>
