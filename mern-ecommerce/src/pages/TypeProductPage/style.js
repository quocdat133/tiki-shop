import styled from "styled-components";
import { Col } from "antd";

export const WrapperProducts = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const WrapperNavbar = styled(Col)`
  background: #fff;
  padding: 10px;
  padding-right: 20px;
  border-radius: 4px;
  height: fit-content;
  margin-top: 20px;
  width: 200px;
  margin-right: 10px;
`;
