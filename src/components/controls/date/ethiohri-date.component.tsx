import React, { useEffect, useMemo } from "react";
import {
  FormFieldProps,
  FormContext,
  isTrue,
  isInlineView,
  isEmpty,
  FieldValueView,
  useFieldValidationResults,
} from "@openmrs/openmrs-form-engine-lib";
import styles from "../input/_input.scss";
require("./ethiohri-date.scss");
import { DatePicker, Provider, defaultTheme } from "@adobe/react-spectrum";
import {
  parseDate,
  EthiopicCalendar,
  toCalendar,
  CalendarDate,
} from "@internationalized/date";

const dateFormatter = new Intl.DateTimeFormat(window.navigator.language);

const ETHIOHRIDate: React.FC<FormFieldProps> = ({
  question,
  onChange,
  handler,
  useField,
  previousValue,
}) => {
  const [field, meta] = useField(question.id);
  const {
    setFieldValue,
    encounterContext,
    layoutType,
    workspaceLayout,
    fields,
  } = React.useContext(FormContext);

  const { errors, warnings, setErrors, setWarnings } =
    useFieldValidationResults(question);

  const isInline = useMemo(() => {
    if (
      ["view", "embedded-view"].includes(encounterContext.sessionMode) ||
      isTrue(question.readonly)
    ) {
      return isInlineView(
        question.inlineRendering,
        layoutType,
        workspaceLayout,
        encounterContext.sessionMode
      );
    }
    return false;
  }, [
    encounterContext.sessionMode,
    question.readonly,
    question.inlineRendering,
    layoutType,
    workspaceLayout,
  ]);

  const onDateChange = ([date]) => {
    let newDate = new Date(date);
    newDate.setHours(12);
    const refinedDate =
      date instanceof Date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        : newDate;
    setFieldValue(question.id, refinedDate);
    onChange(question.id, refinedDate, setErrors, setWarnings);
    question.value = handler.handleFieldSubmission(
      question,
      refinedDate,
      encounterContext
    );
  };

  useEffect(() => {
    if (!isEmpty(previousValue)) {
      const date = previousValue.value;
      const refinedDate =
        date instanceof Date ? new Date(date.setHours(0, 0, 0, 0)) : date;
      setFieldValue(question.id, refinedDate);
      onChange(question.id, refinedDate, setErrors, setWarnings);
      handler?.handleFieldSubmission(question, refinedDate, encounterContext);
    }
  }, [previousValue]);

  const { placeHolder, carbonDateformat } = useMemo(() => {
    const formatObj = dateFormatter.formatToParts(new Date());
    const placeHolder = formatObj
      .map((obj) => {
        switch (obj.type) {
          case "day":
            return "dd";
          case "month":
            return "mm";
          case "year":
            return "yyyy";
          default:
            return obj.value;
        }
      })
      .join("");
    const carbonDateformat = formatObj
      .map((obj) => {
        switch (obj.type) {
          case "day":
            return "d";
          case "month":
            return "m";
          case "year":
            return "Y";
          default:
            return obj.value;
        }
      })
      .join("");
    return { placeHolder: placeHolder, carbonDateformat: carbonDateformat };
  }, []);

  function gregToEth(gregdate) {
    if (!gregdate) return null;
    let dmy = gregdate.split("/");
    if (dmy.length == 3) {
      let year = parseInt(dmy[2], 10);
      let month = parseInt(dmy[0], 10);
      let day = parseInt(dmy[1], 10);
      let gregorianDate = new CalendarDate(year, month, day);
      let ethiopianDate = toCalendar(gregorianDate, new EthiopicCalendar());
      let finalDate =
        ethiopianDate.day +
        "/" +
        ethiopianDate.month +
        "/" +
        ethiopianDate.year;
      return finalDate;
    } else return null;
  }

  const isIsoDate = (str) => {
    var regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g;
    if (!regex.test(str)) {
      return false;
    }
    return true;
  };

  function formatDate(value) {
    if (!value) return null;
    let dmy = new Date(value).toLocaleDateString("en-US").split("/");
    if (dmy.length == 3) {
      let year = parseInt(dmy[2], 10);
      let month = parseInt(dmy[0], 10);
      let day = parseInt(dmy[1], 10);
      let finalDate = year + "-" + formatDigit(month) + "-" + formatDigit(day);
      return finalDate;
    } else {
      return null;
    }
  }

  function formatDigit(number) {
    return parseInt(number, 10).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  }

  return encounterContext.sessionMode == "view" ||
    encounterContext.sessionMode == "embedded-view" ? (
    <FieldValueView
      label={question.label}
      value={gregToEth(
        new Date(field.value).toLocaleDateString("en-US").toString()
      )}
      conceptName={question.meta?.concept?.display}
      isInline={isInline}
    />
  ) : (
    !question.isHidden && (
      <div className={`${styles.formField} ${styles.row}`}>
        <div>
          <Provider
            locale="am-AM-u-ca-ethiopic"
            theme={defaultTheme}
            height="100%"
            colorScheme="light"
          >
            <DatePicker
              value={
                formatDate(field.value) != null
                  ? isIsoDate(formatDate(field.value))
                    ? parseDate(formatDate(field.value))
                    : null
                  : null
              }
              onChange={(e) => {
                onDateChange([e]);
              }}
              id={question.id}
              label={question.label}
              // isDisabled={question.disabled}
              validationState={errors.length > 0 ? "invalid" : null}
              errorMessage={errors[0]?.message}
              maxVisibleMonths={1}
              // maxValue={today("Africa/Addis_Ababa")}
            ></DatePicker>
          </Provider>
        </div>
      </div>
    )
  );
};

export default ETHIOHRIDate;
