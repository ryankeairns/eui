import React, {
  FunctionComponent,
  MouseEventHandler,
  HTMLAttributes,
  ReactNode,
} from 'react';
import classNames from 'classnames';
import { CommonProps, ExclusiveUnion, keysOf, PropsOf } from '../common';
import chroma from 'chroma-js';
import { euiPaletteColorBlind } from '../../services/color/eui_palettes';
import { EuiInnerText } from '../inner_text';
import { EuiIcon, IconColor, IconType } from '../icon';

type IconSide = 'left' | 'right';

type WithButtonProps = {
  /**
   * Will apply an onclick to the badge itself
   */
  onClick: MouseEventHandler<HTMLButtonElement>;

  /**
   * Aria label applied to the onClick button
   */
  onClickAriaLabel: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick' | 'color'>;

type WithSpanProps = Omit<HTMLAttributes<HTMLSpanElement>, 'onClick' | 'color'>;

interface WithIconOnClick {
  /**
   * Will apply an onclick to icon within the badge
   */
  iconOnClick: MouseEventHandler<HTMLButtonElement>;

  /**
   * Aria label applied to the iconOnClick button
   */
  iconOnClickAriaLabel: string;
}

export type EuiBadgeProps = {
  /**
   * Accepts any string from our icon library
   */
  iconType?: IconType;

  /**
   * The side of the badge the icon should sit
   */
  iconSide?: IconSide;

  /**
   * Accepts either our palette colors (primary, secondary ..etc) or a hex value `#FFFFFF`, `#000`.
   */
  color?: IconColor;
  /**
   * Will override any color passed through the `color` prop.
   */
  isDisabled?: boolean;

  /**
   * Props passed to the close button.
   */
  closeButtonProps?: Partial<PropsOf<EuiIcon>>;
} & CommonProps &
  ExclusiveUnion<WithIconOnClick, {}> &
  ExclusiveUnion<WithSpanProps, WithButtonProps>;

// TODO - replace with variables once https://github.com/elastic/eui/issues/2731 is closed
const colorInk = '#000';
const colorGhost = '#fff';

const colorToHexMap: { [color in IconColor]: string } = {
  // TODO - replace with variable once https://github.com/elastic/eui/issues/2731 is closed
  default: '#d3dae6',
  // Brighten vis palette slightly for better text contrast
  primary: chroma(euiPaletteColorBlind()[1])
    .brighten(0.5)
    .hex(),
  secondary: chroma(euiPaletteColorBlind()[0])
    .brighten(0.5)
    .hex(),
  accent: chroma(euiPaletteColorBlind()[2])
    .brighten(0.5)
    .hex(),
  warning: chroma(euiPaletteColorBlind()[5])
    .brighten(0.5)
    .hex(),
  danger: chroma(euiPaletteColorBlind()[9])
    .brighten(0.5)
    .hex(),
};

export const COLORS = keysOf(colorToHexMap);

const iconSideToClassNameMap: { [side in IconSide]: string } = {
  left: 'euiBadge--iconLeft',
  right: 'euiBadge--iconRight',
};

export const ICON_SIDES = keysOf(iconSideToClassNameMap);

export const EuiBadge: FunctionComponent<EuiBadgeProps> = ({
  children,
  color = 'default',
  iconType,
  iconSide = 'left',
  className,
  isDisabled,
  onClick,
  iconOnClick,
  onClickAriaLabel,
  iconOnClickAriaLabel,
  closeButtonProps,
  ...rest
}) => {
  checkValidColor(color);

  const optionalColorClass = null;
  let optionalCustomStyles: object | undefined = undefined;
  let textColor = null;
  const wcagContrastBase = 4.5; // WCAG AA contrast level
  let wcagContrast = null;
  let colorHex = null;

  // Check if a valid color name was provided
  if (COLORS.indexOf(color) > -1) {
    // Get the hex equivalent for the provided color name
    colorHex = colorToHexMap[color];

    // Set dark or light text color based upon best contrast
    textColor = setTextColor(colorHex);

    optionalCustomStyles = {
      backgroundColor: colorHex,
      color: textColor,
    };
  } else if (color !== 'hollow') {
    // This is a custom color that is neither from the base palette nor hollow
    // Let's do our best to ensure that it provides sufficient contrast

    // Set dark or light text color based upon best contrast
    textColor = setTextColor(color);

    // Check the contrast
    wcagContrast = getColorContrast(textColor, color);

    if (wcagContrast < wcagContrastBase) {
      // It's low contrast, so lets show a warning in the console
      console.warn(
        'Warning: ',
        color,
        ' badge has low contrast of ',
        wcagContrast.toFixed(2),
        '. Should be above ',
        wcagContrastBase,
        '.'
      );
    }

    optionalCustomStyles = { backgroundColor: color, color: textColor };
  }

  const classes = classNames(
    'euiBadge',
    {
      'euiBadge-isClickable': onClick && !iconOnClick,
      'euiBadge-isDisabled': isDisabled,
      'euiBadge--hollow': color === 'hollow',
    },
    iconSideToClassNameMap[iconSide],
    optionalColorClass,
    className
  );

  const closeClassNames = classNames(
    'euiBadge__icon',
    closeButtonProps && closeButtonProps.className
  );

  let optionalIcon: ReactNode = null;
  if (iconType) {
    if (iconOnClick) {
      if (!iconOnClickAriaLabel) {
        console.warn(
          'When passing the iconOnClick props to EuiBadge, you must also provide iconOnClickAriaLabel'
        );
      }
      optionalIcon = (
        <button
          className="euiBadge__iconButton"
          aria-label={iconOnClickAriaLabel}
          disabled={isDisabled}
          title={iconOnClickAriaLabel}
          onClick={iconOnClick}
          color={color}>
          <EuiIcon
            type={iconType}
            size="s"
            {...closeButtonProps}
            className={closeClassNames}
          />
        </button>
      );
    } else {
      optionalIcon = (
        <EuiIcon type={iconType} size="s" className="euiBadge__icon" />
      );
    }
  }

  if (onClick && !onClickAriaLabel) {
    console.warn(
      'When passing onClick to EuiBadge, you must also provide onClickAriaLabel'
    );
  }

  if (onClick && iconOnClick) {
    return (
      <span className={classes} style={optionalCustomStyles}>
        <span className="euiBadge__content">
          <EuiInnerText>
            {(ref, innerText) => (
              <button
                className="euiBadge__childButton"
                disabled={isDisabled}
                aria-label={onClickAriaLabel}
                onClick={onClick}
                ref={ref}
                title={innerText}
                color={color}
                {...rest}>
                {children}
              </button>
            )}
          </EuiInnerText>
          {optionalIcon}
        </span>
      </span>
    );
  } else if (onClick) {
    return (
      <EuiInnerText>
        {(ref, innerText) => (
          <button
            disabled={isDisabled}
            aria-label={onClickAriaLabel}
            className={classes}
            onClick={onClick}
            style={optionalCustomStyles}
            ref={ref}
            title={innerText}
            {...rest}>
            <span className="euiBadge__content">
              <span className="euiBadge__text">{children}</span>
              {optionalIcon}
            </span>
          </button>
        )}
      </EuiInnerText>
    );
  } else {
    return (
      <EuiInnerText>
        {(ref, innerText) => (
          <span
            className={classes}
            style={optionalCustomStyles}
            ref={ref}
            title={innerText}
            {...rest}>
            <span className="euiBadge__content">
              <span className="euiBadge__text">{children}</span>
              {optionalIcon}
            </span>
          </span>
        )}
      </EuiInnerText>
    );
  }
};

function getColorContrast(textColor: string, color: string) {
  const contrastValue = chroma.contrast(textColor, color);
  return contrastValue;
}

function setTextColor(bgColor: string) {
  const textColor =
    getColorContrast(colorInk, bgColor) > getColorContrast(colorGhost, bgColor)
      ? colorInk
      : colorGhost;

  return textColor;
}

function checkValidColor(color: null | IconColor | string) {
  const validHex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

  if (
    color != null &&
    !validHex.test(color) &&
    !COLORS.includes(color) &&
    color !== 'hollow'
  ) {
    console.warn(
      'EuiBadge expects a valid color. This can either be a three or six ' +
        `character hex value, hollow, or one of the following: ${COLORS}`
    );
  }
}
