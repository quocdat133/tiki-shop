import styled from "styled-components";
import InputComponent from "../InputComponent/InputComponent";

export const WrapperInputStyle = styled(InputComponent)`
  border-radius: 0;
  margin-bottom: 10px;
  border: none;
  border-bottom: 1px solid #e5e5e5;
  outline: none;
  &:focus {
    background-color: rgb(232, 240, 254);
  }
`;
