// @ts-nocheck
/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import React from "react";

// import {
  // ,
  //  } from "@bluprintjs/core/src/components/common";
// import { DISPLAYNAME_PREFIX } from "../../common/props";
import {
  Icon,
  Popover,
  PopoverInteractionKind,
  Text,
  Menu,
  Classes, Position,
  AbstractPureComponent2,
  DISPLAYNAME_PREFIX,
  Collapse
} from "@blueprintjs/core";

// export interface IMenuItemProps extends IActionProps, ILinkProps {
//     // override from IActionProps to make it required
//     /** Item text, required for usability. */
//     text: React.ReactNode;

//     /** Whether this menu item should appear with an active state. */
//     active?: boolean;
//     /**
//      * Children of this component will be rendered in a __submenu__ that appears when hovering or
//      * clicking on this menu item.
//      *
//      * Use `text` prop for the content of the menu item itself.
//      */
//     children?: React.ReactNode;

//     /**
//      * Whether this menu item is non-interactive. Enabling this prop will ignore `href`, `tabIndex`,
//      * and mouse event handlers (in particular click, down, enter, leave).
//      */
//     disabled?: boolean;

//     /**
//      * Right-aligned label text content, useful for displaying hotkeys.
//      *
//      * This prop actually supports JSX elements, but TypeScript will throw an error because
//      * `HTMLAttributes` only allows strings. Use `labelElement` to supply a JSX element in TypeScript.
//      */
//     label?: string;

//     /**
//      * A space-delimited list of class names to pass along to the right-aligned label wrapper element.
//      */
//     labelClassName?: string;

//     /**
//      * Right-aligned label content, useful for displaying hotkeys.
//      */
//     labelElement?: React.ReactNode;

//     /**
//      * Whether the text should be allowed to wrap to multiple lines.
//      * If `false`, text will be truncated with an ellipsis when it reaches `max-width`.
//      * @default false
//      */
//     multiline?: boolean;

//     /**
//      * Props to spread to `Popover`. Note that `content` and `minimal` cannot be
//      * changed and `usePortal` defaults to `false` so all submenus will live in
//      * the same container.
//      */
//     popoverProps?: Partial<IPopoverProps>;

//     /**
//      * Whether an enabled item without a submenu should automatically close its parent popover when clicked.
//      * @default true
//      */
//     shouldDismissPopover?: boolean;

//     /**
//      * Name of the HTML tag that wraps the MenuItem.
//      * @default "a"
//      */
//     tagName?: keyof JSX.IntrinsicElements;

//     /**
//      * A space-delimited list of class names to pass along to the text wrapper element.
//      */
//     textClassName?: string;
// }

export class MenuItem extends AbstractPureComponent2 {
    static get defaultProps() {
      return {
        disabled: false,
        multiline: false,
        popoverProps: {},
        shouldDismissPopover: true,
        text: "",
        dropdownType: 'popover',
      };
    };
    static get displayName() {
      return `${DISPLAYNAME_PREFIX}.MenuItem`;
    }
    
    constructor(props) {
        super(props);
        this.state = {
          isCollapseActive: this.props.callapseActive || false,
        };
      }

    render() {
        const {
            active,
            className,
            children,
            disabled,
            icon,
            intent,
            labelClassName,
            labelElement,
            itemClassName,
            multiline,
            popoverProps,
            shouldDismissPopover,
            text,
            textClassName,
            tagName = "a",
            dropdownType,
            caretIconSize = 16,
            hasSubmenu,
            ...htmlProps
        } = this.props;
        

        const intentClass = Classes.intentClass(intent);
        const anchorClasses = classNames(
            Classes.MENU_ITEM,
            intentClass,
            {
                [Classes.ACTIVE]: active,
                [Classes.INTENT_PRIMARY]: active && intentClass == null,
                [Classes.DISABLED]: disabled,
                // prevent popover from closing when clicking on submenu trigger or disabled item
                [Classes.POPOVER_DISMISS]: shouldDismissPopover && !disabled && !hasSubmenu,
            },
            className,
        );
 
        const handleAnchorClick = (event) => {
          htmlProps.onClick && htmlProps.onClick(event);

          if (dropdownType === 'collapse') {
            this.setState({ isCollapseActive: !this.state.isCollapseActive });
          }          
        };
        
        // Render icon if provided
        const iconElement = icon ? (
          typeof icon === 'string' ? <Icon icon={icon} /> : icon
        ) : undefined;
        
        const target = React.createElement(
            tagName,
            {
                ...htmlProps,
                ...(disabled ? DISABLED_PROPS : {}),
                className: anchorClasses,
                onClick: handleAnchorClick,
            },
            iconElement,
            <Text className={classNames(Classes.FILL, textClassName, "menu-item__text")} ellipsize={!multiline}>
                {text}
            </Text>,
            this.maybeRenderLabel(labelElement),
            hasSubmenu ? <Icon icon="caret-right" iconSize={caretIconSize} /> : undefined,
        );

        const liClasses = classNames({ [Classes.MENU_SUBMENU]: hasSubmenu }, itemClassName);
        return <li className={liClasses}>{
          (dropdownType === 'collapse') ?
            this.maybeRenderCollapse(target, children) :
            this.maybeRenderPopover(target, children)
        }</li>;
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.callapseActive!==this.props.callapseActive){
        //Perform some operation
        this.setState({ isCollapseActive: nextProps.callapseActive });
      }
    }

    maybeRenderLabel(labelElement) {
        const { label, labelClassName } = this.props;
        if (label == null && labelElement == null) {
            return null;
        }
        return (
            <span className={classNames(Classes.MENU_ITEM_LABEL, labelClassName)}>
                {label}
                {labelElement}
            </span>
        );
    }

    maybeRenderCollapse(target, children) {
      if (children == null) {
        return target;
      }
      return (
        <>
          {target}
          <Collapse isOpen={this.state.isCollapseActive} keepChildrenMounted={true}>
            { children }
          </Collapse>
        </>
       );
    }

    maybeRenderPopover(target, children) {
        if (children == null) {
            return target;
        }
        const { disabled, popoverProps } = this.props;
        return (
            <Popover
                autoFocus={false}
                captureDismiss={false}
                disabled={disabled}
                enforceFocus={false}
                hoverCloseDelay={0}
                interactionKind={PopoverInteractionKind.HOVER}
                modifiers={SUBMENU_POPOVER_MODIFIERS}
                position={Position.RIGHT_TOP}
                usePortal={false}
                {...popoverProps}
                content={<Menu>{children}</Menu>}
                minimal={true}
                popoverClassName={classNames(Classes.MENU_SUBMENU, popoverProps.popoverClassName)}
                target={target}
            />
        );
    }
}

const SUBMENU_POPOVER_MODIFIERS =  {
    // 20px padding - scrollbar width + a bit
    flip: { boundariesElement: "viewport", padding: 20 },
    // shift popover up 5px so MenuItems align
    offset: { offset: -5 },
    preventOverflow: { boundariesElement: "viewport", padding: 20 },
};

// props to ignore when disabled
const DISABLED_PROPS = {
    href: undefined,
    onClick: undefined,
    onMouseDown: undefined,
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    tabIndex: -1,
};
