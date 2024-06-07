import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import moment from "moment";
import { AiOutlineCloseCircle } from "react-icons/ai";
const inputStyle = {
  border: "1px solid lightgray",
  borderRadius: "8px",
  padding: "5px",
  outline: "none",
  width: "240px",
};

const inputFocusStyle = {
  border: "1px solid",
  borderColor: "#a6ce39",
  borderRadius: "5px",
  padding: "5px",
  width: "240px",
  outline: "none",
};

function CustomFutureDatePicker({
  name,
  placeholder,
  type,
  style,
  max,
  label,
  disabled
}) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD"); // Format date to MM/DD/YYYY
  };

  const handleDateChange = (update) => {
    let d = moment(update).format("YYYY-MM-DD");
    console.log("update: " + update);
    console.log("d: " + d);
    if (update) {
      console.log("Selected Start Date:", formatDate(update[0]));
      console.log("Selected End Date:", formatDate(update[1]));
      setValue(name, formatDate(update[0]) + " " + formatDate(update[1]), {
        shouldValidate: true,
      });
    } else {
      setValue(name, "", {
        shouldValidate: true,
      });
    }
    setDateRange(update);
  };

  const customClearIcon = <AiOutlineCloseCircle color="red" />;

  // Custom calendar class name
  const customCalendarClassName = {
    selected: "custom-selected-date", // Class for the selected date
  };

  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const error = errors[name];
  useEffect(() => {
    console.log("start end date: " + startDate, endDate);
  }, [startDate, endDate]);

  return (
    <Box>
      <FormControl {...style} isInvalid={!!error}>
        <FormLabel>{label}</FormLabel>
        <Box>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <DatePicker
                {...field}
                placeholderText={placeholder}
                selectsRange
                disabled = {disabled}
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                // maxDate={new Date()}
                isClearable
                customInput={
                  <input
                    style={endDate ? inputFocusStyle : inputStyle}
                    type={type}
                  />
                }
                customCloseIcon={customClearIcon} // Set the custom clear button icon
                //  customCloseIcon={customClearIcon} // Set the custom clear button icon
                calendarClassName={customCalendarClassName}
              />
            )}
          />
        </Box>
        <FormErrorMessage>{error && error?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}

export default CustomFutureDatePicker;
