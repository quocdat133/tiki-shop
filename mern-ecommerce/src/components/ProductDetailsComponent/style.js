import styled from "styled-components";
import { Col, Image, InputNumber } from "antd";

export const WrapperStyleImageSmall = styled(Image)`
  height: 64px;
  width: 64px;
`;

export const WrapperStyleColImage = styled(Col)`
  display: flex;
  flex-basis: unset;
`;

export const WrapperStyleNameProduct = styled.h1`
  color: rgb(36, 36, 36);
  font-size: 24px;
  font-weight: 300;
  line-height: 32px;
  word-break: break-word;
`;

export const WrapperStyleTextSell = styled.span`
  font-style: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;

export const WrapperPriceProduct = styled.div`
  background-color: rgb(250, 250, 250);
  border-radius: 4px;
`;

export const WrapperPriceTextProduct = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin-right: 8px;
  font-weight: 500;
  color: rgb(255, 66, 78);
  padding: 10px;
  margin-top: 10px;
`;

export const WrapperAddressProduct = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.address-change {
    color: rgb(11, 16, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
`;

export const WrapperQualityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  border-radius: 4px;
  width: 100px;
  border: 1px solid #ccc;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number {
    width: 40px;
    border-top: none;
    border-bottom: none;
    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
`;
