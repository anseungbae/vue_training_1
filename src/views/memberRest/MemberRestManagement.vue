<template>
  <MemberRestSearch @searchList="onSearch" @searchReset="onSearchReset" />
  <MemberRestGrid
    :dataProp="RestMemberList"
    @pageChange="onPageChange"
    :totalElemnetCnt="totalCnt"
    @ChangeRowsPerPage="onChangeRowsPerPage"
    @getRestMemberList="getRestMemberList"
    @executeRestClear="executeRestClear"
    @sendEmail="sendEmail"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import MemberRestSearch from './MemberRestSearch.vue'
import MemberRestGrid from './MemberRestGrid.vue'
import UserService from '@/api/userService'
import dayjs from 'dayjs'
import { useAlert } from '@/hooks/web/usePageLoading'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'

/** Local Variable **/
const { loadStart, loadDone } = usePageLoading()
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const searchParam = reactive({
  rowCnt: 20,
  pageNo: 1,
  userSts: '', //  회원상태
  userNmId: null, //  회원명/ID
  fromRestAt: today.add(-1, 'month').format('YYYYMMDD'), //  휴면예정/휴면 일자
  toRestAt: today.format('YYYYMMDD'), // 휴면예정/휴면 일자
  bizNmId: null // 사업장 명/ID
})
const totalCnt = ref(0)

//  휴면유저 목록을  관리.
const RestMemberList = ref([])

/** Service API **/
onMounted(() => {
  getRestMemberList()
})

const getRestMemberList = () => {
  loadStart()
  UserService.getRestUserList(searchParam).then((res) => {
    //  조회한 전체 Count 및 현재 페이지를 State값으로 넣어야 아래 Pagination에 반영
    totalCnt.value = Number(res.data.totalElements)

    //  조회해온 목록을 넣는다.
    RestMemberList.value = res.data.userList ? res.data.userList : []
  })
  loadDone()
}
/** Event Handler **/

/** Local Functions **/
const onSearch = (param: any) => {
  // searchParam = param
  searchParam.userSts = param.userSts
  searchParam.userNmId = param.userNmId
  searchParam.fromRestAt = param.fromRestAt
  searchParam.toRestAt = param.toRestAt
  searchParam.bizNmId = param.bizNmId
  getRestMemberList()
}

//검색조건 초기화
const onSearchReset = () => {
  searchParam.userSts = ''
  searchParam.userNmId = null
  searchParam.fromRestAt = today.add(-1, 'month').format('YYYYMMDD')
  searchParam.toRestAt = today.format('YYYYMMDD')
  searchParam.bizNmId = null
  searchParam.rowCnt = 20
  searchParam.pageNo = 1
  getRestMemberList()
}

//  PageChange
const onPageChange = (page: any) => {
  searchParam.pageNo = page.value.pageNo
  searchParam.rowCnt = page.value.rowCnt
  getRestMemberList()
}

//  페이지 사이즈 변경.
const onChangeRowsPerPage = (page: any) => {
  searchParam.pageNo = page.value.pageNo
  searchParam.rowCnt = page.value.rowCnt
  getRestMemberList()
}

//  휴면 해제
const executeRestClear = (userList) => {
  confirm('휴먼계정을 해제하시겠습니까?', '삭제', {}, (action) => {
    if (action === 'confirm') {
      UserService.execRestUserClear(userList).then((res) => {
        alert('선택하신 회원을 휴면 해제하였습니다.', '알림', null, () => {})
        //  목록 다시 조회(휴면 목록에서 빠지기 때문에 다시 페이지를 처음으로 조회
        getRestMemberList()
      })
    }
  })
}

//  email 발송.
const sendEmail = (userList) => {
  confirm('이메일을 발송 하시겠습니까?', '삭제', {}, (action) => {
    if (action === 'confirm') {
      UserService.sendMailRestUser(userList).then((res) => {
        alert('선택하신 회원에게 Mail 발송 하였습니다.', '알림', null, () => {})
        getRestMemberList()
      })
    }
  })
}
</script>

<style scoped lang="scss"></style>
