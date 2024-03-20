<template>
  <el-dialog
    v-model="termsDetailPopupOpened"
    align-center
    class="modal-title max-w-[500px] min-h-[400px]"
    title="약관 수정"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveButtonClick">저장</el-button>
    </div>
    <div class="modal-box">
      <div>
        <el-row class="row-box">
          <el-col :span="6" class="input-label">약관 구분</el-col>
          <el-col :span="18" class="input-content input-text-font">
            <el-select v-model="termsDetailParam.termsType" style="min-width: 110px; width: 150px">
              <el-option
                v-for="item in termsTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="input-label">약관 코드</el-col>
          <el-col :span="18" class="input-content input-text-font">
            <el-input
              v-model="termsDetailParam.termsCode"
              placeholder="약관 코드"
              maxlength="15"
              clearable
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="input-label">약관 명</el-col>
          <el-col :span="18" class="input-content input-text-font">
            <el-input
              v-model="termsDetailParam.termsName"
              placeholder="약관 명"
              maxlength="15"
              clearable
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="input-label">언어</el-col>
          <el-col :span="18" class="input-content input-text-font">
            <el-select v-model="termsDetailParam.locale" style="min-width: 110px; width: 150px">
              <el-option
                v-for="item in localeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="input-label">필수 여부</el-col>
          <el-col :span="18" class="input-content input-text-font">
            <el-select v-model="termsDetailParam.requireYn" style="min-width: 110px; width: 150px">
              <el-option
                v-for="item in requireYnList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="input-label">사용 여부</el-col>
          <el-col :span="18" class="input-content input-text-font">
            <el-select v-model="termsDetailParam.useYn" style="min-width: 110px; width: 150px">
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
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import TermsService from '@/api/termsService'
import { ref } from 'vue'
import { isEmpty } from '@/utils/is'
import { useAlert } from '@/hooks/web/usePageLoading.ts'

const { alert, confirm } = useAlert()

const termsTypeList = ref([
  {
    value: 'B',
    label: '사업장 약관'
  },
  {
    value: 'P',
    label: '개인 약관'
  },
  {
    value: 'S',
    label: '구독 결제 약관'
  }
])
const localeList = ref([
  {
    value: 'KO',
    label: '한국어'
  },
  {
    value: 'EN',
    label: '영어'
  }
])
const requireYnList = ref([
  {
    value: 'Y',
    label: '필수'
  },
  {
    value: 'N',
    label: '선택'
  }
])
const useYnList = ref([
  {
    value: 'Y',
    label: '사용'
  },
  {
    value: 'N',
    label: '사용안함'
  }
])
const emits = defineEmits(['onSearchDataReload'])

//  상세 팝업 Open 여부
const termsDetailPopupOpened = ref(false)

const termsDetailParam = ref({
  termsId: null,
  termsType: null,
  termsCode: null,
  termsName: null,
  locale: null,
  requireYn: null,
  useYn: null,
  content: null,
  saveMode: null
})

//  약관 수정 조회 API 호출
const getTermsDetailApi = () => {
  const param = { termsId: termsDetailParam.value.termsId }
  TermsService.getTermsInfo(param).then((res) => {
    //  조회해온 Data
    termsDetailParam.value.content = res.data.content
    termsDetailParam.value.locale = res.data.locale
    termsDetailParam.value.termsType = res.data.termsType
    termsDetailParam.value.termsCode = res.data.termsCode
    termsDetailParam.value.termsName = res.data.termsName
    termsDetailParam.value.requireYn = res.data.requireYn
    termsDetailParam.value.useYn = res.data.useYn
  })
}
//저장 API 호출
const saveTermsDetailApi = () => {
  const param = {
    saveMode: termsDetailParam.value.saveMode,
    termsId: termsDetailParam.value.termsId,
    termsType: termsDetailParam.value.termsType,
    termsCode: termsDetailParam.value.termsCode,
    termsName: termsDetailParam.value.termsName,
    locale: termsDetailParam.value.locale,
    requireYn: termsDetailParam.value.requireYn,
    useYn: termsDetailParam.value.useYn
  }
  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      TermsService.modifyTerms(param).then((res) => {
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

//  약관 저장 전 Validation 체크
const saveValidation = () => {
  if (isEmpty(termsDetailParam.value.termsType)) {
    alert('약관 구분을 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsDetailParam.value.termsCode)) {
    alert('약관 코드를 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsDetailParam.value.termsName)) {
    alert('약관 명을 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsDetailParam.value.locale)) {
    alert('언어를 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsDetailParam.value.requireYn)) {
    alert('필수 여부를 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsDetailParam.value.useYn)) {
    alert('사용 여부를 선택해 주세요.', '알림', null, null)
    return false
  }
  return true
}
// 저장 버튼 클릭
const onSaveButtonClick = async () => {
  //  Save API 호출 전 Validation 체크
  if (saveValidation()) {
    termsDetailParam.value.saveMode = 'update'
    saveTermsDetailApi()
  }
}
//부모창에서 openDetali 메소드호출 약관 수정 조회 API 호출
const openDetali = (id) => {
  if (id == null) {
    termsDetailPopupOpened.value = false
  } else {
    termsDetailParam.value.termsId = id
    termsDetailParam.value.saveMode = 'update'
    getTermsDetailApi()
    termsDetailPopupOpened.value = true
  }
}
const onCloseBtnClick = () => {
  //  재조회 관련 호출하기.
  emits('onSearchDataReload')
  //  화면 닫기
  termsDetailPopupOpened.value = false
}

defineExpose({
  openDetali
})
</script>

<style scoped></style>
