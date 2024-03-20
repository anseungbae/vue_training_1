import { type Action, ElLoading, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

export const usePageLoading = () => {
  const loadInstance = ref<ComponentRef<typeof ElLoading>>()
  const that = this
  const loadStart = () => {
    loadInstance.value = ElLoading.service({
      target: that,
      // body: true,
      background: 'rgba(256, 256, 256, 0.5)',
      lock: true
      // fullscreen: true
    })
  }
  const loadDone = () => {
    loadInstance.value.close()
  }

  return {
    loadStart,
    loadDone
  }
}

export const useAlert = () => {
  const alert = (
    msg: string = '',
    title: string = '',
    options: any = null,
    callback: Function = null
  ) => {
    ElMessageBox.alert(msg, title, {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '확인',
      dangerouslyUseHTMLString: true,
      callback: (action: Action) => {
        if (callback) {
          callback()
        }
      }
    })
  }
  const confirm = (
    msg: string = '',
    title: string = '',
    options: any = null,
    callback: Function = null
  ) => {
    ElMessageBox.confirm(msg, title, {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      dangerouslyUseHTMLString: true,
      callback: (action: Action) => {
        console.log('~~~~~~~~~~~~~~~~~~~~~~ action : ', action)
        if (callback) {
          callback(action)
        }
      }
    })
  }
  return {
    alert,
    confirm
  }
}
