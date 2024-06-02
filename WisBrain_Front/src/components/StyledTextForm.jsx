import React from "react";

const styles = {
  textInput: {
    color: '#66727F',
    fontSize: 15,
    paddingBottom: 10,
  },
};

const StyledTextForm = ({ style = {}, ...props }) => {
  const inputStyle = { 
    ...styles.textInput, 
    ...style
  };

  return <div style={inputStyle} {...props} />;
}

export default StyledTextForm;