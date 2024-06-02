import React from "react"
import theme from "./theme";

const styles = {
  text: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  colorSecondary: {
    color: theme.colors.secondary,
  },
  colorNormal: {
    color: theme.colors.normal,
  },
  bold: {
    fontWeight: theme.fontWeights.bold,
  },
  subheading: {
    fontSize: theme.fontSizes.subheading,
  },
  textAlignCenter: {
    textAlign: 'center',
  }
};

export default function StyledText({align, children, color, fontSize, fontWeight, style, ...restOfProps }) {
  const textStyles = [
    styles.text,
    color === 'primary' && styles.colorPrimary,
    color === 'secondary' && styles.colorSecondary,
    color === 'normal' && styles.colorNormal,
    align === 'center' && styles.textAlignCenter,
    fontSize === 'subheading' && styles.subheading,
    fontWeight === 'bold' && styles.bold,
    style
  ]
  return (
    <div style={textStyles} {...restOfProps}>
      {children}
    </div>
  );
}