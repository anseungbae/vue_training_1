<template>
  <el-dialog
    v-model="termsVersionPopupOpened"
    align-center
    class="modal-title min-w-[995px] min-h-[700px]"
    title="Version Up 약관 저장"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveButtonClick">저장</el-button>
    </div>
    <div class="modal-box">
      <div>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">약관 구분</el-col>
          <el-col :span="9" class="input-content">
            <el-select
              v-model="termsVersionParam.termsType"
              style="min-width: 110px; width: 150px"
              :disabled="true"
            >
              <el-option
                v-for="item in termsTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3" class="input-label">약관 코드</el-col>
          <el-col :span="9" class="input-content input-text-font">
            <el-input
              v-model="termsVersionParam.termsCode"
              placeholder="약관 코드"
              :disabled="true"
              maxlength="15"
              clearable
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">약관 명</el-col>
          <el-col :span="9" class="input-content input-text-font">
            <el-input
              v-model="termsVersionParam.termsName"
              placeholder="약관 명"
              :disabled="true"
              maxlength="15"
              clearable
            />
          </el-col>
          <el-col :span="3" class="input-label">언어</el-col>
          <el-col :span="9" class="input-content input-text-font">
            <el-select
              v-model="termsVersionParam.locale"
              style="min-width: 110px; width: 150px"
              :disabled="true"
            >
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
          <el-col :span="3" class="input-label">내용</el-col>
          <el-col :span="21" class="input-content input-text-font min-w-[800px] min-h-[420px]">
            <editor ref="editorRef" @onEditContent="onEditContent"></editor>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">필수 여부</el-col>
          <el-col :span="9" class="input-content input-text-font">
            <el-select
              v-model="termsVersionParam.requireYn"
              style="min-width: 110px; width: 150px"
              :disabled="true"
            >
              <el-option
                v-for="item in requireYnList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3" class="input-label">사용 여부</el-col>
          <el-col :span="9" class="input-content input-text-font">
            <el-select
              v-model="termsVersionParam.useYn"
              style="min-width: 110px; width: 150px"
              :disabled="true"
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
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import Editor from '@/components/Editor.vue'
import TermsService from '@/api/termsService'
import { ref } from 'vue'
import { isEmpty } from '@/utils/is'
import { useAlert } from '@/hooks/web/usePageLoading.ts'

const { alert, confirm } = useAlert()

const termsTypeList = ref([
  {
    value: 'B',
    label: '사업장 약관',
    text: '사업장 약관'
  },
  {
    value: 'P',
    label: '개인 약관',
    text: '개인 약관'
  },
  {
    value: 'S',
    label: '구독 결제 약관',
    text: '구독 결제 약관'
  }
])
const localeList = ref([
  {
    value: 'KO',
    label: '한국어',
    text: '한국어'
  },
  {
    value: 'EN',
    label: '영어',
    text: '영어'
  }
])
const requireYnList = ref([
  {
    value: 'Y',
    label: '필수',
    text: '필수'
  },
  {
    value: 'N',
    label: '선택',
    text: '선택'
  }
])
const useYnList = ref([
  {
    value: 'Y',
    label: '사용',
    text: '사용'
  },
  {
    value: 'N',
    label: '사용안함',
    text: '사용안함'
  }
])

//  Version Up Open Variable
const termsVersionPopupOpened = ref(false)
const termsVersionParam = ref({
  termsDetailId: null,
  termsId: null,
  termsType: null,
  termsCode: null,
  termsName: null,
  locale: null,
  requireYn: null,
  useYn: null,
  content: null,
  version: null,
  saveMode: null
})

const emits = defineEmits(['onSearchDataReloadVer'])

const editorRef = ref()

//  약관 버전업 상세 조회 API 호출
const getTermsVersionApi = () => {
  const param = { termsId: termsVersionParam.value.termsId }
  TermsService.getTermsInfo(param).then((res) => {
    //  조회해온 Data
    termsVersionParam.value.termsDetailId = res.data.termsDetailId
    termsVersionParam.value.termsType = res.data.termsType
    termsVersionParam.value.termsCode = res.data.termsCode
    termsVersionParam.value.termsName = res.data.termsName
    termsVersionParam.value.locale = res.data.locale
    termsVersionParam.value.requireYn = res.data.requireYn
    termsVersionParam.value.useYn = res.data.useYn
    termsVersionParam.value.version = res.data.version

    editorRef.value.setEditContent(res.data.content)
  })
}

const onCloseBtnClick = () => {
  //  재조회 관련 호출하기.
  emits('onSearchDataReloadVer')
  //  화면 닫기
  termsVersionPopupOpened.value = false
}
//저장 API 호출 //versionUpTerms
const saveTermsVersionApi = () => {
  const param = {
    saveMode: termsVersionParam.value.saveMode,
    termsId: termsVersionParam.value.termsId,
    version: termsVersionParam.value.version,
    content: termsVersionParam.value.content
  }
  confirm('저장하시겠습니까?', '버전업', null, (action) => {
    if (action === 'confirm') {
      TermsService.versionUpTerms(param).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `저장되었습니다.`
        } else {
          alertMsg = '저장에 실패하였습니다.'
        }
        alert(alertMsg, '버전업', null, () => {
          onCloseBtnClick()
        })
      })
    }
  })
}

//  약관 저장 전 Validation 체크
const saveValidation = () => {
  if (isEmpty(termsVersionParam.value.content)) {
    alert('약관 내용을 입력해 주세요.', '알림', null, null)
    return false
  }
  return true
}
// 저장 버튼 클릭
const onSaveButtonClick = async () => {
  if (saveValidation()) {
    termsVersionParam.value.saveMode = 'update'
    // sava API 호출
    saveTermsVersionApi()
  }
}
//상세 조회 API 호출( 부모창 호출 메소드)
const openVersionUp = (termsId) => {
  termsVersionParam.value.termsId = termsId
  termsVersionParam.value.saveMode = 'update'
  getTermsVersionApi()
  termsVersionPopupOpened.value = true
}

// edit 컴퍼넌트의 메소드 호출.
const onEditContent = (getTerms) => {
  if (getTerms == null) {
    termsVersionParam.value.content = ''
  } else {
    termsVersionParam.value.content = getTerms
  }
}
defineExpose({
  openVersionUp
})
</script>

<style scoped></style>
