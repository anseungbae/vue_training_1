<template>
  <div class="searchbox-box items-center">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">제목</el-col>
        <el-col :span="5">
          <el-input
            v-model="searchParam.searchTxtValue"
            placeholder="제목"
            clearable
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
          />
        </el-col>
        <el-col :span="2" class="search-label">사용여부 </el-col>
        <el-col :span="5" class="pr-5"
          ><el-select
            v-model="searchParam.useYn"
            placeholder="사용여부"
            style="min-width: 110px; width: 150px; margin-right: 5px"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in useYnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="10"> </el-col>
      </el-row>
    </div>
    <div>
      <el-button class="searchbox-button" @click="onSearchReset">초기화</el-button>
      <el-button class="searchbox-button" @click="onSearchDataToParent">조회</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

/** Local Variable **/
const searchParam = ref({
  searchTxtType: 'All', //  공통코드 타입
  searchTxtValue: null, //  공통코드 명
  useYn: 'All', // 사용여부
  rowCnt: 20,
  pageNo: 1
})

const useYnList = [
  { value: 'All', label: '전체', text: '전체' },
  { value: 'Y', label: '사용', text: '사용' },
  { value: 'N', label: '미사용', text: '미사용' }
]

const emit = defineEmits(['searchList', 'searchReset'])

/** Service API **/

/** Event Handler **/

const onSearchDataToParent = () => {
  emit('searchList', searchParam.value)
}

const onSearchReset = () => {
  searchParam.value.searchTxtType = 'All'
  searchParam.value.searchTxtValue = null
  searchParam.value.useYn = 'All'
  searchParam.value.rowCnt = 20
  searchParam.value.pageNo = 1
  emit('searchReset', searchParam.value)
}
/** Local Functions **/
</script>

<style scoped lang="scss"></style>
