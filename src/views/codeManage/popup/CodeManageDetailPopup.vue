<template>
  <el-dialog
    v-model="codeDetailPopupOpened"
    class="min-w-[550px] min-h-[300px] pb-0 t-0%"
    width="600"
    title="공통코드 등록"
  >
    <hr />
    <div class="flex justify-end my-[10px]">
      <div>
        <el-button class="basic-button" @click="onSaveAlert">저장</el-button>
      </div>
    </div>
    <div class="modal-box subtitle-font">
      <el-row class="row-box">
        <el-col :span="6" class="input-label">코드</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.code"
            :input-style="{ fontSize: '12px' }"
            disable
            clearable
            maxlength="15"
            placeholder="코드"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label">코드네임</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.codeName"
            :input-style="{ fontSize: '12px' }"
            disable
            clearable
            maxlength="15"
            placeholder="코드네임"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label">부모코드</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.pCode"
            :input-style="{ fontSize: '12px' }"
            disable
            clearable
            maxlength="15"
            placeholder="부모코드"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label">설명</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.description"
            :input-style="{ fontSize: '12px' }"
            disable
            clearable
            maxlength="100"
            placeholder="설명"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label">순번</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.seq"
            :input-style="{ fontSize: '12px' }"
            type="text"
            disable
            clearable
            placeholder="순번"
            oninput="value = value.replace(/[^0-9.]/g, '')"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label">사용여부</el-col>
        <el-col :span="18" class="input-content">
          <el-select
            v-model="detailParam.useYn"
            placeholder="선택"
            style="min-width: 110px; width: 150px"
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
      <el-row class="row-box">
        <el-col :span="6" class="input-label">label</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.label"
            :input-style="{ fontSize: '12px' }"
            disable
            clearable
            maxlength="85"
            placeholder="label"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label">value</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.value"
            :input-style="{ fontSize: '12px' }"
            disable
            clearable
            maxlength="85"
            placeholder="value"
          />
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { isEmpty } from '@/utils/is'
import { useAlert } from '@/hooks/web/usePageLoading'
import CodeService from '@/api/codeService'

/** 파라미터**/
const { alert, confirm } = useAlert()
const emit = defineEmits(['onSearchDataReload']) //
//  성별 Select 목록

const validationMsg = ref(null)

//사용여부 리스트
const useYnList = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '사용안함' }
]

const codeDetailPopupOpened = ref(false)
const pkUserId = ref<any>(null)
/** Grid 관련 **/

/** Detail Info 관련 **/
const detailParam = ref<any>({
  code: null,
  pCode: null,
  codeName: null,
  description: '',
  seq: null,
  useYn: null,
  label: null,
  value: null,
  id: pkUserId,
  saveMode: null
})

//Dialog param
const alertMsg = ref('')

// Popup  Ref

/** 기능 **/
//넘어온 사용자 EmailId 설정
const open = (userId: any) => {
  if (userId) {
    pkUserId.value = userId
    getCodeDetailApi() //  회원 상세정보 조회
    codeDetailPopupOpened.value = true
    detailParam.value.saveMode = 'update'
  } else {
    pkUserId.value = ''
    getCodeDetailApi()
    codeDetailPopupOpened.value = true
    detailParam.value.saveMode = 'insert'
  }
}

//  배너이미지 상세조회 API 호출
const getCodeDetailApi = () => {
  const param = { id: pkUserId.value }
  CodeService.getCodeDetail(param).then((res) => {
    //조회한 배너이미지 정보를 넣어줌
    detailParam.value.code = res.data.code
    detailParam.value.pCode = res.data.pCode
    detailParam.value.codeName = res.data.codeName
    detailParam.value.description = res.data.description
    detailParam.value.seq = res.data.seq
    detailParam.value.useYn = res.data.useYn
    detailParam.value.label = res.data.label
    detailParam.value.value = res.data.value
  })
}

/** Dialog 관련 **/
const onSaveAlert = (alertList: any) => {
  confirm('저장하시겠습니까?', '알림', null, (action) => {
    if (action == 'confirm') {
      if (validation()) {
        onSaveApi()
      } else {
        alert(validationMsg.value, '경고', null, () => {})
      }
    }
  })
}

const validation = () => {
  if (isEmpty(detailParam.value.code)) {
    validationMsg.value = '코드를 입력해주세요.'
    return false
  } else if (isEmpty(detailParam.value.codeName)) {
    validationMsg.value = '코드명을 입력해주세요.'
    return false
  } else if (isEmpty(detailParam.value.seq)) {
    validationMsg.value = '순번을 선택해주세요.'
    return false
  } else {
    return true
  }
}

//  저장 서비스
const onSaveApi = () => {
  CodeService.saveCode(detailParam.value)
    .then((res) => {
      if (res.data) {
        alert('저장하였습니다.', '알림', null, () => {
          onClosePopupResearch()
        })
      }
    })
    .catch((err) => console.error(err, '경고', null, () => {}))
}

/** Popup  **/

// 팝업 닫으며 재조회.
const onClosePopupResearch = () => {
  emit('onSearchDataReload')
  codeDetailPopupOpened.value = false //  화면 닫기
}

// 초기 데이터 설정
defineExpose({
  open
}) //Popup Open
</script>

<style lang="scss" scoped></style>
