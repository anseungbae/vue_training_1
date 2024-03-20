<template>
  <el-dialog
    v-model="termsCreatePopupOpened"
    align-center
    class="modal-title min-w-[995px] min-h-[700px]"
    title="약관 등록"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveButtonClick">저장</el-button>
    </div>
    <div class="modal-box">
      <el-scrollbar ref="scrollbarRef">
        <div>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">약관 구분</el-col>
            <el-col :span="9" class="input-content">
              <el-select
                v-model="termsCreateParam.termsType"
                style="min-width: 110px; width: 150px"
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
                v-model="termsCreateParam.termsCode"
                maxlength="15"
                placeholder="약관 코드"
                clearable
              />
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">약관 명</el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-input
                v-model="termsCreateParam.termsName"
                maxlength="15"
                placeholder="약관 명"
                clearable
              />
            </el-col>
            <el-col :span="3" class="input-label">언어</el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-select v-model="termsCreateParam.locale" style="min-width: 110px; width: 150px">
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
            <el-col :span="21" class="input-content">
              <editor ref="editorRef" @onEditContent="onEditContent"></editor>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">필수 여부</el-col>
            <el-col :span="9" class="input-content">
              <el-select
                v-model="termsCreateParam.requireYn"
                style="min-width: 110px; width: 150px"
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
              <el-select v-model="termsCreateParam.useYn" style="min-width: 110px; width: 150px">
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
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import Editor from '@/components/Editor.vue'
import TermsService from '@/api/termsService'
import { isEmpty } from '@/utils/is'
import { ref } from 'vue'
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
const emits = defineEmits(['onSearchDataReloadCre'])

const termsCreatePopupOpened = ref(false)
const termsCreateParam = ref({
  termsType: 'B',
  termsCode: null,
  termsName: null,
  locale: 'KO',
  requireYn: 'Y',
  useYn: 'Y',
  content: null,
  saveMode: null
})

//  Editor 관련 Variable
const editorRef = ref()

//저장 API 호출
const saveTermsCreateApi = () => {
  const param = {
    saveMode: 'insert',
    termsType: termsCreateParam.value.termsType,
    termsCode: termsCreateParam.value.termsCode,
    termsName: termsCreateParam.value.termsName,
    locale: termsCreateParam.value.locale,
    requireYn: termsCreateParam.value.requireYn,
    content: termsCreateParam.value.content,
    useYn: termsCreateParam.value.useYn
  }

  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      TermsService.createTerms(param).then((res) => {
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
  if (isEmpty(termsCreateParam.value.termsType)) {
    alert('약관 구분을 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsCreateParam.value.termsCode)) {
    alert('약관 코드를 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsCreateParam.value.termsName)) {
    alert('약관 명을 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsCreateParam.value.locale)) {
    alert('언어를 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsCreateParam.value.content)) {
    alert('약관 내용을 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsCreateParam.value.requireYn)) {
    alert('필수 여부를 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(termsCreateParam.value.useYn)) {
    alert('사용 여부를 선택해 주세요.', '알림', null, null)
    return false
  }
  return true
}

// 저장 버튼 클릭
const onSaveButtonClick = async () => {
  //  Validation Check 전에 내용 Content 가져오기
  editorRef.value.getEditContent()

  //  Save API 호출 전 Validation 체크
  if (saveValidation()) {
    // sava API 호출
    saveTermsCreateApi()
  }
}

const openCreate = () => {
  termsCreateParam.value.content = ''
  termsCreatePopupOpened.value = true
}

const onEditContent = (getMark) => {
  if (getMark == null || getMark === '<p><br></p>') {
    termsCreateParam.value.content = ''
  } else {
    termsCreateParam.value.content = getMark
  }
}

const onCloseBtnClick = () => {
  //  재조회 관련 호출하기.
  emits('onSearchDataReloadCre')
  //  화면 닫기
  termsCreatePopupOpened.value = false
}

defineExpose({
  openCreate
})
</script>

<style scoped></style>
