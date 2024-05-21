import React from "react";
import TextField from "@mui/material/TextField";

const styles = {
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e8ed",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#F4F7FC'
  },
  error: {
    borderColor: 'red'
  }
};

const StyledTextInput = ({ style = {}, error, ...props }) => {
  const inputStyle = [
    styles.textInput, 
    style,
    error && styles.error
  ];

  return <TextField style={inputStyle} {...props} />;
}

export default StyledTextInput;