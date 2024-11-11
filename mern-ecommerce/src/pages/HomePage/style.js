import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  height: 44px;
  font-size: 14px;
  font-weight: 400;
  color: rgb(128, 128, 137);
  white-space: nowrap;
`;

export const WrapperProducts = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  color: #fff;
  &:hover {
    color: #fff;
    span {
      color: #fff;
    }
  }

  width: 100%;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) => (props.disabled ? "#fff" : "transparent")};
`;
