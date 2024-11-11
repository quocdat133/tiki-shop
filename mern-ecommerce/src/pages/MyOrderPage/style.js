import styled from "styled-components";
import { Row } from "antd";

export const WrapperHeader = styled(Row)`
  padding: 16px 120px;
  background: linear-gradient(to right, rgb(26, 148, 255), rgb(24, 144, 255));
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const WrapperTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 12px;
  font-size: 13px;

  &:hover {
    opacity: 0.9;
    cursor: pointer;
  }
`;

export const WrapperHeaderSmall = styled.span`
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  opacity: 0.9;
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 8px 12px;
  margin: 0;
  transition: all 0.3s ease;

  &:hover {
    color: rgb(26, 148, 255);
    background-color: #f5f5f5;
  }
`;

export const WrapperStatus = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #f0f0f0;

  div {
    margin: 8px 0;
    color: #333;
    font-size: 14px;

    span {
      margin-right: 8px;
      font-weight: 500;
    }
  }
`;

export const WrapperHeaderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fafafa;
  }

  img {
    border-radius: 8px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

export const WrapperFooterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #f0f0f0;

  > div:first-child {
    display: flex;
    gap: 8px;
    align-items: center;

    span:first-child {
      font-size: 14px;
      color: rgb(255, 66, 78);
      margin-right: 8px;
    }

    span:last-child {
      font-size: 16px;
      font-weight: 700;
      color: rgb(255, 66, 78);
    }
  }

  > div:last-child {
    display: flex;
    gap: 12px;

    button {
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    }
  }
`;

export const WrapperContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5fa;
  padding: 24px 0;

  h4 {
    font-size: 20px;
    font-weight: 500;
    color: #333;
    margin-bottom: 24px;
    text-transform: uppercase;
  }
`;

export const WrapperItemOrder = styled.div`
  padding: 9px 16px;
  background: #fff;
  margin-top: 12px;
`;

export const WrapperListOrder = styled.div``;
