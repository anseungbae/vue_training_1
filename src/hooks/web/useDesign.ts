import variables from '@/styles/variables.module.scss'

export const useDesign = () => {
  const scssVariables = variables

  /**
   * @param scope 이름
   * @returns class-name
   */
  const getPrefixCls = (scope: string) => {
    return `${scssVariables.namespace}-${scope}`
  }

  return {
    variables: scssVariables,
    getPrefixCls
  }
}
