import React from "react";
import StyledTextForm from "./StyledTextForm";
import { useField } from "formik";
import StyledTextInput from "./StyledTextInput";
import Select from '@mui/material/Select';
import StyledText from "./StyledText";

const styles = {
  error: {
    color: 'red'
  },
  groupForm: {
    paddingBottom:20
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#F4F7FC'
  },
};

const StyledGroupForm = ({ style = {}, label, placeholder, name, keyboardType='default', select=false, children, ...props}) => {
  const inputStyle = { 
    ...styles.textInput, 
    ...style
  };

  const [field, meta, helpers] = useField(name)

  const inputWidget = select ? 
    <Select
      placeholder={placeholder}
      searchPlaceholder={placeholder}
      boxStyles={meta.error && {borderColor: 'red'}}
      onChange={(val) => {
        helpers.setValue(val);
      }}
      data = {select}
      save='key'
    /> : 
    <StyledTextInput
      error = {meta.error}
      placeholder={placeholder}
      onChange={text => helpers.setValue(text)}
      onBlur={() => helpers.setTouched(true)}
      value={field.value}
    />
  return(
    <div style={styles.groupForm} {...props}>
      <StyledTextForm> {label} </StyledTextForm>
      {inputWidget}
      {meta.error && <StyledText style={styles.error}> {meta.error} </StyledText>}
    </div>
  )
}

export default StyledGroupForm;