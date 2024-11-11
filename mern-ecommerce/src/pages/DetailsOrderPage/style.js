import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const WrapperInfoUser = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const WrapperLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 2px solid rgb(26, 148, 255);
  margin-bottom: 8px;
`;

export const WrapperContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .name-info {
    font-size: 15px;
    font-weight: 500;
    color: #222;
  }

  .address-info,
  .phone-info {
    font-size: 14px;
    color: #666;

    span {
      margin-left: 4px;
      color: #333;
    }
  }

  .delivery-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .name-delivery {
      font-weight: 600;
      color: rgb(26, 148, 255);
      background: rgba(26, 148, 255, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }
  }

  .delivery-fee {
    display: flex;
    justify-content: space-between;
    color: #666;

    span {
      color: #333;
    }
  }

  .payment-info {
    font-weight: 500;
    color: #333;
  }

  .status-payment {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
    width: fit-content;
    background: ${(props) => (props.isPaid ? "#e6f7e6" : "#fff3e6")};
    color: ${(props) => (props.isPaid ? "#52c41a" : "#faad14")};
  }
`;

export const WrapperStyleContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  > div:first-child {
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    background: #fafafa;
  }
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  width: 670px;
  gap: 16px;

  img {
    border-radius: 8px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  > div {
    font-size: 14px;
    color: #333;
  }
`;

export const WrapperItem = styled.div`
  width: 200px;
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: center;

  &:last-child {
    color: ${(props) => (props.isPrice ? "rgb(255, 66, 78)" : "#333")};
    font-weight: ${(props) => (props.isPrice ? "600" : "normal")};
  }
`;

export const WrapperItemLabel = styled.div`
  width: 200px;
  font-size: 14px;
  color: #666;
  text-align: center;

  &:last-child {
    font-weight: 500;
    color: #333;
  }
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 40px;
  padding: 16px 0;
  margin-top: 8px;

  &:last-child {
    border-top: 1px solid #f0f0f0;
    margin-top: 16px;
    padding-top: 24px;

    ${WrapperItemLabel} {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    ${WrapperItem} {
      font-size: 18px;
      font-weight: 600;
      color: rgb(255, 66, 78);
    }
  }
`;
