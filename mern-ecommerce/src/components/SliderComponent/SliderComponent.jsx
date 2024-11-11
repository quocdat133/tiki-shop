import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./style";

const SliderComponent = ({ arrayImages }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <WrapperSliderStyle {...settings}>
      {arrayImages.map((image) => {
        return (
          <Image
            key={image}
            src={image}
            alt={`${image}`}
            preview={false}
            width="100%"
            height="300px"
          />
        );
      })}
    </WrapperSliderStyle>
  );
};

export default SliderComponent;
