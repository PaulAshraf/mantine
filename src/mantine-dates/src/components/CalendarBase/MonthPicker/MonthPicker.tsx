import React from 'react';
import { DefaultProps, Selectors, UnstyledButton, MantineSize } from '@mantine/core';
import { getMonthsNames } from '../../../utils';
import { CalendarHeader, CalendarHeaderStylesNames } from '../CalendarHeader/CalendarHeader';
import { isMonthInRange } from './is-month-in-range/is-month-in-range';
import { formatYear } from '../format-year';
import useStyles from './MonthPicker.styles';

export type MonthPickerStylesNames = Selectors<typeof useStyles> | CalendarHeaderStylesNames;

export interface MonthPickerProps
  extends DefaultProps<MonthPickerStylesNames>,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value: { year: number; month: number };
  onChange(value: number): void;
  locale: string;
  year: number;
  onYearChange(year: number): void;
  onNextLevel(): void;
  size?: MantineSize;
  minDate?: Date;
  maxDate?: Date;
  __staticSelector?: string;
  nextYearLabel?: string;
  previousYearLabel?: string;
  preventFocus?: boolean;
  yearLabelFormat?: string;
  __stopPropagation?: boolean;
}

export function MonthPicker({
  className,
  styles,
  classNames,
  value,
  onChange,
  locale,
  year,
  onYearChange,
  onNextLevel,
  size,
  minDate,
  maxDate,
  __staticSelector = 'MonthPicker',
  nextYearLabel,
  previousYearLabel,
  preventFocus,
  unstyled,
  yearLabelFormat = 'YYYY',
  __stopPropagation,
  ...others
}: MonthPickerProps) {
  const { classes, cx } = useStyles(
    { size },
    { classNames, styles, unstyled, name: __staticSelector }
  );
  const range = getMonthsNames(locale);
  const minYear = minDate instanceof Date ? minDate.getFullYear() : undefined;
  const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : undefined;

  const months = range.map((month, index) => (
    <UnstyledButton<'button'>
      key={month}
      unstyled={unstyled}
      onClick={() => onChange(index)}
      className={cx(classes.monthPickerControl, {
        [classes.monthPickerControlActive]: index === value.month && year === value.year,
      })}
      disabled={!isMonthInRange({ date: new Date(year, index), minDate, maxDate })}
      onMouseDown={(event) => preventFocus && event.preventDefault()}
      data-mantine-stop-propagation={__stopPropagation || undefined}
    >
      {month}
    </UnstyledButton>
  ));

  return (
    <div className={cx(classes.monthPicker, className)} {...others}>
      <CalendarHeader
        label={formatYear(year, yearLabelFormat)}
        hasNext={typeof maxYear === 'number' ? year < maxYear : true}
        hasPrevious={typeof minYear === 'number' ? year > minYear : true}
        onNext={() => onYearChange(year + 1)}
        onPrevious={() => onYearChange(year - 1)}
        onNextLevel={onNextLevel}
        size={size}
        classNames={classNames}
        styles={styles}
        __staticSelector={__staticSelector}
        nextLabel={nextYearLabel}
        previousLabel={previousYearLabel}
        preventFocus={preventFocus}
        unstyled={unstyled}
        __stopPropagation={__stopPropagation}
      />
      <div className={classes.monthPickerControls}>{months}</div>
    </div>
  );
}

MonthPicker.displayName = '@mantine/dates/MonthPicker';
