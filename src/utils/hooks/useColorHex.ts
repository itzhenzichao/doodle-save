import { useMemo } from 'react';
import type { ColorPickerProps, GetProp } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';

type Color = GetProp<ColorPickerProps, 'value'>;

export const useColorHex = (color: Color, fallback = '#ffffff') =>
  useMemo<string>(
    () =>
      typeof color === 'string'
        ? color
        : color instanceof AggregationColor
          ? color.toHexString()
          : fallback,
    [color, fallback],
  );
