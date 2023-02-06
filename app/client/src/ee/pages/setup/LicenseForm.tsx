import React, { useEffect } from "react";
import { validateLicense } from "@appsmith/actions/tenantActions";
import { Text, TextType, Size } from "design-system-old";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  REQUIRED_LICENSE_KEY,
  ADD_KEY,
  ACTIVATE_INSTANCE,
  createMessage,
} from "@appsmith/constants/messages";
import { hasInvalidLicenseKeyError } from "@appsmith/selectors/tenantSelectors";
import { isEmptyString } from "utils/formhelpers";
import { StyledForm, StyledInput, InputWrapper, StyledButton } from "./styles";

export type LicenseFormProps = {
  label?: string;
  placeholder?: string;
  actionBtnText?: string;
};

export const LicenseForm = (props: LicenseFormProps) => {
  const { actionBtnText, label, placeholder } = props;
  const dispatch = useDispatch();
  const isInvalid = useSelector(hasInvalidLicenseKeyError);
  const {
    formState: { errors },
    getFieldState,
    getValues,
    handleSubmit,
    register,
    setError,
  } = useForm();

  const isFieldTouched = getFieldState("licenseKey").isTouched;

  useEffect(() => {
    const values = getValues();

    if (isFieldTouched && isInvalid && !isEmptyString(values?.licenseKey)) {
      setError("licenseKey", {
        type: "invalid",
      });
    }
  }, [isInvalid, isFieldTouched, errors]);

  const checkLicenseStatus = (formValues: any) => {
    const { licenseKey } = formValues;

    if (isEmptyString(licenseKey)) {
      setError("licenseKey", {
        type: "required",
        message: createMessage(REQUIRED_LICENSE_KEY),
      });
    }

    if (licenseKey) {
      dispatch(validateLicense(licenseKey));
    }
  };

  const formError = errors?.licenseKey?.message ? true : false;
  return (
    <StyledForm
      className={`license-form`}
      onSubmit={handleSubmit(checkLicenseStatus)}
      showError={formError}
    >
      {label && <label className="license-input-label">{label}</label>}
      <InputWrapper>
        <StyledInput
          className={`license-input `}
          placeholder={placeholder ?? createMessage(ADD_KEY)}
          {...register("licenseKey")}
        />
        {errors.licenseKey && (
          <Text className="input-error-msg" type={TextType.P3}>
            {errors.licenseKey.message}
          </Text>
        )}
      </InputWrapper>
      <StyledButton
        fill
        size={Size.large}
        tag="button"
        text={actionBtnText ?? createMessage(ACTIVATE_INSTANCE)}
        type="submit"
      />
    </StyledForm>
  );
};
