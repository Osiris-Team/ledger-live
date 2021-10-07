import React from "react";
import { components, ControlProps, OptionTypeBase, ValueContainerProps } from "react-select";
import SelectInput, { Props as SelectInputProps } from "@components/form/input/SelectInput";
import Text from "@components/asorted/Text";
import { ValueContainer } from "@components/form/input/SelectInput/ValueContainer";
import { ChevronBottomMedium, ChevronTopMedium } from "@assets/icons";
import FlexBox from "@components/layout/Flex";
import { useTheme } from "styled-components";

export type Props = SelectInputProps & { label: string };

function DropdownControl<T, M extends boolean = false>(props: ControlProps<T, M>) {
  const {
    selectProps: { label },
    children,
  } = props;

  return (
    <components.Control {...props}>
      <Text ff="Inter|SemiBold" fontSize={3} color="palette.neutral.c80" mr={2}>
        {label}
      </Text>
      {children}
    </components.Control>
  );
}

function DropdownValueContainer<T extends OptionTypeBase = { label: string; value: string }>(
  props: ValueContainerProps<T, false>,
) {
  const ChevronIcon = props.selectProps.menuIsOpen ? ChevronTopMedium : ChevronBottomMedium;

  return (
    <ValueContainer
      {...props}
      render={() => (
        <FlexBox>
          <Text ff="Inter|SemiBold" fontSize={3} mr={2}>
            <FlexBox>{props.children}</FlexBox>
          </Text>
          <FlexBox alignItems="center" color="palette.neutral.c100">
            <ChevronIcon size={12} />
          </FlexBox>
        </FlexBox>
      )}
    />
  );
}

function DropdownIndicatorsContainer() {
  return null;
}

export default function Dropdown(props: Props): JSX.Element {
  const theme = useTheme();

  return (
    <SelectInput
      placeholder=""
      isSearchable={false}
      styles={{
        singleValue: (provided) => ({
          ...provided,
          color: theme.colors.palette.neutral.c100,
          margin: 0,
          top: undefined,
          position: undefined,
          overflow: undefined,
          maxWidth: undefined,
          transform: undefined,
        }),
        input: () => ({ display: "none" }),
      }}
      {...props}
      components={{
        Control: DropdownControl,
        ValueContainer: DropdownValueContainer,
        IndicatorsContainer: DropdownIndicatorsContainer,
      }}
    />
  );
}
