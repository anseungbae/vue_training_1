export default {
  data() {
    return {
      // 전체화면 여부
      fullscreen: false
    }
  },

  watch: {
    // 전체 화면으로 전환 후 스크롤 업데이트
    async fullscreen() {
      await this.$nextTick()
      this.$tabs.adjust()
    }
  }
}
