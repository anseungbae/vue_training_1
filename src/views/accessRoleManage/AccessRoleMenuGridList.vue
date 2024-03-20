<template>
  <div class="grid-box">
    <div class="grid-header-box">
      <p class="subtitle-font">메뉴</p>
      <el-button class="grid-button" @click="onSaveBtnClick">저장</el-button>
    </div>
    <DataGrid
      ref="memberGridRef"
      style="height: 550px"
      class="ag-theme-quartz px-5 py-3"
      :columnDefs="colDefsRight"
      :rowData="getGridItems"
      @onGridReady="onGridReady"
      @onGridCellClick="onGridCellClick"
      :groupDefaultExpanded="groupDefaultExpanded"
      :getRowId="getRowId"
      :autoGroupColumnDef="autoGroupColumnDef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'

import { AgGridVue } from 'ag-grid-vue3' // Vue Grid Logic

/** Local Variable **/
const props = defineProps({
  dataProp: {
    type: Object
  }
})
const colDefsRight = ref([
  {
    field: 'menuName',
    headerName: '메뉴',

    cellStyle: {
      filter: 'text',
      sortable: true,
      cursor: 'pointer'
    }
  },
  {
    field: 'accessYn',
    headerName: '접근권한',

    cellClass: 'centered',
    width: 150,
    suppressSizeToFit: true,
    cellRenderer: (params) => {
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.checked = params.value === 'Y'
      return input
    }
  }
])
const gridItems = ref(null)
const gridApi = ref(null)
const groupDefaultExpanded = ref(null)
const getDataPath = ref(null)
const getRowId = ref(null)
const autoGroupColumnDef = ref(null)
/** Service API **/

/** Event Handler **/
const getGridItems = computed(() => {
  return gridItems.value || []
})

onMounted(() => {
  setPopupInfo()
  groupDefaultExpanded.value = 0

  autoGroupColumnDef.value = {
    headerName: 'No.',
    valueGetter: 'node.rowIndex + 1',
    width: 100,
    suppressSizeToFit: true,
    cellRendererParams: {
      suppressCount: false
    }
  }
})

watch(props, () => {
  setPopupInfo()
})

/** Local Functions **/
const onGridReady = (params) => {
  gridApi.value = params?.api
}
const setPopupInfo = () => {
  console.log('setPopupInfo', props.dataProp)
  gridItems.value = props.dataProp //  조회해온 목록을 넣는다.
}

// 그리드 클릭시
const onGridCellClick = (event) => {
  if (event.colDef.field === 'emailId' || event.colDef.field === 'userName') {
    // memberDetailPopRef.value.open(event.data.userId);
  } else if (event.colDef.field === 'userId') {
    //memberCsListPopRef.value.open(event.data.userId);
  } else {
    console.log('~~~~~~ etc Cell Click : ')
  }
}

// 저장버튼
const onSaveBtnClick = () => {
  console.log('~~~~~~ etc Cell Click : ')
}
</script>
<!--
  export const roleList = [
  { value: '', label: '전체' },
  { value: 'admin', label: '관리자', text: '관리자' },
  { value: 'manager', label: '담당자', text: '담당자' },
  { value: 'member', label: '회원', text: '회원' },
];


  import { SectionBody, SectionxHeader } from '@/components/Page/Section';
import Grid from '@toast-ui/react-grid';
import React, { useEffect, useRef, useState } from 'react';
import { OptColumn } from 'tui-grid/types/options';
import { Button } from 'antd';
import { Box } from '@mui/material';
import {ComboboxRenderer} from "@/components/Grid/renderer/ComboboxRenderer";
import {roleList} from "@/assets/data/code";
import {CheckboxRenderer} from "@/components/Grid/renderer/CheckboxRenderer";
import RoleService from "@/api/roleService";

export const AccessRoleMenuGridList = (props) => {
  const { title, data, selectAccessRightId, alert } = props;
  const [isNoData, setNoData] = useState(true);

  const accessRoleMenuGrid = useRef(null);

  useEffect(() => {
    setNoData(!(data && data.length > 0));
  }, [data]);

  const columns: OptColumn[] = [
    { name: 'menuName', header: '메뉴' },
    { name: 'accessYn', header: '접근권한', align: 'center', width:80,
      renderer: {
        type: CheckboxRenderer,
        options: {
          checkedValue: 'Y',
          disabledValue: 'Y',
          disabledCheckKey: 'accessYn',
        },
      },
    },
  ];

  const handleAccessRoleMenuSaveBtnOnClick = () => {

    //  선택된 항목이 있을 경우.
    if(props.selectAccessRightId){
      const accessRoleMenuGridChangeInfo = accessRoleMenuGrid.current.getInstance().getModifiedRows();
      if(accessRoleMenuGridChangeInfo
          && accessRoleMenuGridChangeInfo.updatedRows
          && accessRoleMenuGridChangeInfo.updatedRows.length > 0){
        //  변경된 항목이 있다.
        //  파라미터 설정시 기존에 accessRightId 값이 없으므로 값을 넣어서 파라미터 전송.
        const paramSaveList = [];
        accessRoleMenuGridChangeInfo.updatedRows.map(updateInfo => {
          paramSaveList.push({
            accessRightId: selectAccessRightId,
            menuId: updateInfo.menuId,
            accessYn: updateInfo.accessYn
          });
        });

        const param = {
          saveList: paramSaveList
        }
        RoleService.saveAccessRoleMenuMap(param).then((res) => {
          console.log('saveAccessRoleMenuMap ', res.data);
          if(res.data.saveStatus){
            alert.info('저장하였습니다.');
            //  저장 후 목록 다시 가져오게 처리.
            props.SaveAccessRoleMenuMapComplete();
          }else{
            alert.info(res.data.message);
          }
        }).catch(error => alert.error(error));


      }else{
        //  변경된 항목이 없을 경우.
        alert.info('변경된 항목이 없습니다.');
      }
    }else{
      //  변경된 항목이 없을 경우.
      alert.info('추가된 접근권한을 저장 후 메뉴목록을 저장 해주세요.');
    }

  }

  return (
    <Box sx={{
      width: '70%',
      height:'100%',
      backgroundColor: '#ff6600',
    }}>
      <SectionxHeader title={title}>
        <div style={{ display: 'flex' }}>
          <Button className='dark-button' onClick={handleAccessRoleMenuSaveBtnOnClick}>
            등록
          </Button>
        </div>
      </SectionxHeader>
      <SectionBody>
        {/*<div style={{ display: 'flex', alignItems: 'center' }}>*/}
        {/*    <Combobox data={rowsPerPage} label='10개씩' />*/}
        {/*    <div style={{ marginLeft: '6px' }} />*/}
        {/*    <span className='num-result'>전체 80개중</span>*/}
        {/*    <div style={{ marginLeft: '6px' }} />*/}
        {/*    <span className='result-current-page'>10~20개</span>*/}
        {/*</div>*/}
        <div style={{ marginTop: '10px' }} />
        <div
          style={{
            minHeight: 500,
            height: '100%',
          }}
        >
          <Grid
              ref={accessRoleMenuGrid}
              header={{
                height: 36,
                align: 'center',
              }}
              rowHeight={36}
              rowHeaders={['rowNum']}
              minRowHeight={36}
              bodyHeight='fitToParent'
              data={data}
              columns={columns}
              usageStatistics={false}
              treeColumnOptions={{
                name:'menuName',
                useIcon: true,
                useCascadingCheckbox: true,
                indentWidth: 25,
              }}
          />
        </div>
      </SectionBody>
    </Box>
  );
};

  -->

<style lang="scss" scoped></style>
