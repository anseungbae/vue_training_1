<template>
  <el-dialog
    v-model="bannerGroupDetailPopupOpened"
    align-center
    class="modal-title modal-small"
    :title="modeText"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveBtnClick">저장</el-button>
    </div>
    <div class="modal-box">
      <el-scrollbar ref="scrollbarRef">
        <div>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">배너그룹 명</el-col>
            <el-col :span="21" class="input-content">
              <el-input
                v-model="bannerGroupDetailInfo.name"
                placeholder="배너그룹 명"
                clearable
                maxlength="100"
                ref="inputName"
              />
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label"> 분류 </el-col>
            <el-col :span="9" class="input-content input-text-font"> 상단 </el-col>

            <el-col :span="3" class="input-label">형태</el-col>
            <el-col :span="9" class="input-content input-text-font">가로 </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">게시여부</el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-select
                v-model="bannerGroupDetailInfo.postYn"
                style="min-width: 110px; width: 150px"
                placeholder="전체"
              >
                <el-option
                  v-for="item in postYnList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="3" class="input-label">게시일자</el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-date-picker
                v-model="dateRangeVal"
                type="daterange"
                range-separator="~"
                format="YYYY.MM.DD"
                value-format="YYYYMMDD"
                style="min-width: 210px; width: 250px"
                :clearable="false"
              />
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">사용여부</el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-select
                v-model="bannerGroupDetailInfo.useYn"
                style="min-width: 110px; width: 150px"
                placeholder="전체"
              >
                <el-option
                  v-for="item in useYnList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div class="grid-box mt-5">
          <div class="grid-header-box">
            <p class="subtitle-font">배너 이미지 목록</p>
            <div class="button-box">
              <el-button class="grid-button" @click="onBannerGroupDetailAddClick">추가</el-button>
              <el-button class="grid-button" @click="onBannerGroupDeletClick">삭제</el-button>
            </div>
          </div>
          <DataGrid
            ref="bannerGroupGridRef"
            rowSelection="multiple"
            class="ag-theme-quartz data-grid-small-box"
            :rowData="bannerImageMapList"
            :columnDefs="colDefs"
            @onGridReady="onGridReady"
          />
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
  <BannerGroupImageSelPopup
    ref="bannerImageGridListPopRef"
    @bannerImgCheckedList="ckeckedBannerImageList"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { isEmpty } from '@/utils/is'
import BannerGroupImageSelPopup from '@/views/bannerImage/popup/BannerSelectPopup.vue'
import BannerService from '@/api/bannerService'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'
import { useAlert } from '@/hooks/web/usePageLoading'
/** Local Variable **/
let modeText = ''
const inputName = ref(null)
const { loadStart, loadDone } = usePageLoading()
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const dateRangeVal = ref([today.format('YYYY.MM.DD'), today.add(+1, 'month').format('YYYY.MM.DD')])
const dateRangeValue = ref({
  postStartAt: dateRangeVal.value[0], // 게시시작일
  postEndAt: dateRangeVal.value[1] // 게시종료일
})
const postYnList = [
  { value: 'Y', label: '표시' },
  { value: 'N', label: '표시안함' }
]
const useYnList = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '사용안함' }
]

const emit = defineEmits(['onSearchDataReload']) //
const gridApi = ref<any>(null)
const autoSize = ref(null)
const colDefs = ref([
  {
    width: 40,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    editable: true,
    sortable: false,
    headerCheckboxSelectionFilteredOnly: true,
    showDisabledCheckboxes: true
  },
  {
    field: 'name',
    headerName: '이미지 명',
    flex: 2,
    sortable: false,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'imageDesc',
    headerName: '이미지 설명',
    flex: 2,
    sortable: false,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'linkUrl',
    headerName: '링크주소',
    flex: 5,
    sortable: false,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'orderNo',
    headerName: '순서',
    valueGetter: 'node.rowIndex + 1',
    sortable: false,
    flex: 1,
    cellStyle: { textAlign: 'center' }
  }
]) //  Grid 컬럼 정의 끝

const bannerImageMapList = ref(null)
const bannerGroupDetailPopupOpened = ref(false)
const bannerImageGridListPopRef = ref(null)
const bannerGroupDetailInfo = ref<any>({
  id: null,
  name: null,
  category: 'TOP',
  type: 'H',
  postYn: null,
  postStartAt: null,
  postEndAt: null,
  useYn: null,
  delYn: null,
  bgColor: null,
  saveMode: ''
})
// Validation Check
const bannerGroupDetailValidationCheck = () => {
  if (isEmpty(bannerGroupDetailInfo.value)) {
    alert('저장할 데이터가 없습니다.', '알림', null, () => {})
    return false
  } else if (isEmpty(bannerGroupDetailInfo.value.name)) {
    alert('배너그룹 명은 필수 입력 항목입니댜.', '알림', null, null)
    inputName.value.focus(true)
    return false
  } else if (isEmpty(bannerGroupDetailInfo.value.category)) {
    alert('분류 항목은 필수 입력 항목입니댜.', '알림', null, null)
    return false
  } else if (isEmpty(bannerGroupDetailInfo.value.type)) {
    alert('형태 항목은 필수 입력 항목입니댜.', '알림', null, null)
    return false
  } else if (isEmpty(dateRangeVal.value)) {
    alert('게시 일자는  필수 입력 항목입니댜.', '알림', null, null)
    return false
  } else if (isEmpty(bannerImageMapList.value) || bannerImageMapList.value.length == 0) {
    alert('배너 이미지 목록을 추가해 주세요.', '알림', null, null)
    return false
  }
  return true
}
/** Service API **/
//저장 API 호출
const saveBannerGroupDetailApi = () => {
  const saveDetailInfo = {
    id: bannerGroupDetailInfo.value.id,
    name: bannerGroupDetailInfo.value.name,
    category: bannerGroupDetailInfo.value.category,
    type: bannerGroupDetailInfo.value.type,
    postYn: bannerGroupDetailInfo.value.postYn,
    postStartAt: dayjs(dateRangeVal.value[0]).format('YYYYMMDD'),
    postEndAt: dayjs(dateRangeVal.value[1]).format('YYYYMMDD'),
    useYn: bannerGroupDetailInfo.value.useYn,
    delYn: bannerGroupDetailInfo.value.delYn,
    bgColor: bannerGroupDetailInfo.value.bgColor,
    saveMode: bannerGroupDetailInfo.value.saveMode
  }

  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      let saveParam = { saveInfo: saveDetailInfo, bannerImageList: bannerImageMapList.value }
      BannerService.saveBannerGroup(saveParam).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `저장되었습니다.`
        } else {
          alertMsg = '저장에 실패하였습니다.'
        }
        alert(alertMsg, '저장', null, () => {
          onCloseBtnClick()
        })
      })
    }
  })
}

confirm('저장하시겠습니까?', '저장', null, (action) => {
  if (action === 'confirm') {
  }
})

//  배너그룹 조회 API 호출
const getBannerGroupDetailInfoAPi = () => {
  const param = { id: bannerGroupDetailInfo.value.id }
  loadStart()
  BannerService.getBannerGroupDetail(param)
    .then((res) => {
      // grid data
      bannerImageMapList.value = res.data.bannerImageList
      dateRangeVal.value = []
      //  조회해온 Detail Data
      bannerGroupDetailInfo.value = res.data
      bannerGroupDetailInfo.value.id = res.data.detailInfo.id
      bannerGroupDetailInfo.value.name = res.data.detailInfo.name
      bannerGroupDetailInfo.value.category = 'TOP'
      bannerGroupDetailInfo.value.type = 'H'
      bannerGroupDetailInfo.value.postYn = res.data.detailInfo.postYn
      bannerGroupDetailInfo.value.useYn = res.data.detailInfo.useYn
      dateRangeVal.value[0] = dayjs(res.data.detailInfo.postStartAt).format('YYYY-MM-DD')
      dateRangeVal.value[1] = dayjs(res.data.detailInfo.postEndAt).format('YYYY-MM-DD')
      bannerGroupDetailInfo.value.delYn = res.data.detailInfo.delYn
      bannerGroupDetailInfo.value.bgColor = res.data.detailInfo.bgColor
    })
    .catch((err) => alert(err, '알림', null, null))
  loadDone()
}

/** Local Functions **/
//부모창에서 popup의 메소드 호출
const detailOpen = (id) => {
  //  메인상단배너 상세조회
  if (isEmpty(id)) {
    // insert Mod
    modeText = '메인 배너 상단 등록'
    bannerGroupDetailPopupOpened.value = true
    dateRangeVal.value[0] = dayjs(dateRangeValue.value.postStartAt).format('YYYYMMDD')
    dateRangeVal.value[1] = dayjs(dateRangeValue.value.postEndAt).format('YYYYMMDD')
    bannerImageMapList.value = []
    bannerGroupDetailInfo.value = {
      id: null,
      name: null,
      category: 'TOP',
      type: 'H',
      postYn: 'Y',
      postStartAt: dateRangeValue.value.postStartAt,
      postEndAt: dateRangeValue.value.postEndAt,
      useYn: 'Y',
      delYn: null,
      bgColor: '',
      saveMode: 'insert'
    }
  } else {
    // Update Mod
    modeText = '메인 배너 상단 수정'
    bannerImageMapList.value = []
    bannerGroupDetailPopupOpened.value = true
    bannerGroupDetailInfo.value.id = id
    bannerGroupDetailInfo.value.saveMode = 'update'
    getBannerGroupDetailInfoAPi()
  }
}

/** Event Handler **/
// 이미지 ROW ADD 추가 Event
const ckeckedBannerImageList = (ckeckedBannerImageList: any) => {
  if (ckeckedBannerImageList && ckeckedBannerImageList.length > 0) {
    const addRowArr = []
    ckeckedBannerImageList.map((checkInfo: any) => {
      const isDuplicate =
        bannerImageMapList.value.filter((mapInfo: any) => mapInfo.bannerImageId === checkInfo.id)
          .length > 0
          ? true
          : false
      if (!isDuplicate) {
        addRowArr.push({
          bannerGroupId: checkInfo.bannerGroupId,
          bannerImageId: checkInfo.id,
          orderNo:
            (bannerImageMapList.value ? bannerImageMapList.value.length : 0) +
            (addRowArr ? addRowArr.length : 0) +
            1,
          name: checkInfo.name,
          imageDesc: checkInfo.imageDesc,
          linkUrl: checkInfo.linkUrl,
          fileUrl: checkInfo.fileUrl
        })
      }
    })
    //  중복을 제거 ROW ADD
    if (addRowArr && addRowArr.length > 0) {
      const newBannerImageMapList = bannerImageMapList.value.concat(addRowArr)
      bannerImageMapList.value = newBannerImageMapList
      bannerImageMapList.value = bannerImageMapList.value
    }
  }
}

// 이미지 추가 등록 팝업
const onBannerGroupDetailAddClick = () => {
  bannerImageGridListPopRef.value.imageOpen()
}

// delete button click
// check한 항목 삭제하기
const onBannerGroupDeletClick = () => {
  const selectedCheckedRows = gridApi.value.getSelectedRows()
  if (selectedCheckedRows && selectedCheckedRows.length > 0) {
    const checkedMapList = []
    bannerImageMapList.value.map((imgMapChk) => {
      if (
        selectedCheckedRows.filter(
          (checkInfo) => checkInfo.bannerImageId === imgMapChk.bannerImageId
        ).length === 0
      ) {
        checkedMapList.push(imgMapChk)
      }
    })
    bannerImageMapList.value = checkedMapList
  } else {
    alert('삭제할 데이터가 없습니다.', '알림', null, null)
    return false
  }
}

const onGridReady = (params: any) => {
  gridApi.value = params?.api
  autoSize.value = 'fitGridWidth'
}

// 저장 버튼 클릭 시
const onSaveBtnClick = async () => {
  if (bannerGroupDetailValidationCheck()) {
    saveBannerGroupDetailApi()
  }
}

const onCloseBtnClick = () => {
  //  재조회 관련 호출하기.
  emit('onSearchDataReload')
  //  화면 닫기
  bannerGroupDetailPopupOpened.value = false
}
defineExpose({
  detailOpen
})
</script>

<style lang="scss" scoped></style>
