import { h, VNode, VNodeChild } from 'vue'
import type { TreeNode } from 'treemate'
import { keep, keysOf } from '../../_utils'
import NMenuOptionGroup, { menuItemGroupProps } from './MenuOptionGroup'
import NSubmenu, { submenuProps } from './Submenu'
import NMenuOption, { menuItemProps } from './MenuOption'
import { MenuOption, MenuGroupOption } from './interface'
import { MenuSetupProps } from './Menu'

const groupPropKeys = keysOf(menuItemGroupProps)
const itemPropKeys = keysOf(menuItemProps)
const submenuPropKeys = keysOf(submenuProps)

export function itemRenderer (
  tmNode: TreeNode<MenuOption, MenuGroupOption>,
  menuProps: MenuSetupProps
): VNode {
  const { labelField } = menuProps
  const { rawNode, key, level, isGroup } = tmNode
  const props = {
    ...rawNode,
    title: (rawNode.title || rawNode[labelField]) as
      | string
      | (() => VNodeChild)
      | undefined,
    extra: rawNode.titleExtra || rawNode.extra,
    key,
    internalKey: key, // since key can't be used as a prop
    level,
    root: level === 0,
    isGroup
  }

  if (tmNode.children) {
    if (tmNode.isGroup) {
      return h(
        NMenuOptionGroup,
        keep(props, groupPropKeys, { tmNodes: tmNode.children, key })
      )
    }
    return h(
      NSubmenu,
      keep(props, submenuPropKeys, {
        key,
        rawNodes: tmNode.rawNode[menuProps.childrenField] as any,
        tmNodes: tmNode.children,
        tmNode
      })
    )
  } else {
    return h(
      NMenuOption,
      keep(props, itemPropKeys, {
        key,
        tmNode
      })
    )
  }
}
