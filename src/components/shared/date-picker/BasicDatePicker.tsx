import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateDTO } from "interface/common";
import { TextFieldStyled } from "components/styled";

interface propsType {
  label?: string;
  placeholder?: string;
  value: DateDTO | null;
  onChange: (e: DateDTO | null) => void;
  error?: boolean;
  views?: ("day" | "month" | "year")[];
}

// type propsType = Omit<DatePickerProps, "renderInput"> & {
//   label: string;
//   helperText: string;
//   value: DateDTO | null;
//   onChange: (e: DateDTO | null) => void;
// };

export default function BasicDatePicker(props: propsType) {
  const [val, setval] = React.useState<DateDTO | null>(props.value);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={props.views ? props.views : ["day", "year", "month"]}
        value={val ? `${val.month + "/" + val.day + "/" + val.year}` : val}
        onChange={(e: Date | null) => {
          if (e) {
            const data: DateDTO = {
              year: e.getFullYear(),
              month: e.getMonth() + 1,
              day: e?.getDate(),
            };
            props.onChange(data);
            setval(data);
          } else {
            props.onChange(e);
            setval(e);
          }
        }}
        renderInput={(params) => (
          <TextFieldStyled
            fullWidth
            sx={{
              ".MuiFormLabel-root": {
                marginTop: 2.2,
              },
            }}
            {...params}
            inputProps={{
              ...params.inputProps,
              placeholder: props.placeholder,
            }}
            error={props.error}
          />
        )}
      />
    </LocalizationProvider>
  );
}
