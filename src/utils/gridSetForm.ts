import { dateToString } from './gridFormatter'
import { ref } from 'vue'
//  Grid 컬럼 정의 시작
const pageColDefs = ref([
  {
    field: 'number',
    headerName: 'No.',
    valueGetter: 'node.rowIndex + 1',
    sortable: false,
    width: 60,
    cellStyle: {
      width: 60,
      filter: 'text',
      textAlign: 'center'
    }
  },
  {
    field: 'pageName',
    headerName: '페이지명',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellEditorParams: { maxLength: 50 },
    width: 150,
    cellStyle: {
      width: 150,
      filter: 'text'
    }
  },
  {
    field: 'pageUrl',
    headerName: '페이지 URL',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellEditorParams: { maxLength: 150 },
    width: 300,
    cellStyle: {
      width: 300,
      filter: 'text'
    }
  },
  {
    field: 'pageDesc',
    headerName: '페이지설명',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellEditorParams: { maxLength: 200 },
    flex: 1,
    cellStyle: {
      filter: 'text'
    }
  },
  {
    field: 'useYn',
    headerName: '사용여부',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellStyle: {
      width: 100,
      filter: 'text'
    }
  }
]) //  Grid 컬럼 정의 끝
export function pageColDef() {
  return pageColDefs.value
}
