import React, { Component } from 'react';

// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

// import TextDialog from '../../Dialog/TextDialog'

import "../slider.scss"

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

class ImgSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  } 

  render(){ 
    const data = this.props.data
    const img_class = this.props.img_class

    return (
      <Swiper 
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
      >
        {data.map((item, idx) => (
          <div key={idx}>
            {/* Добавляем слайд */}
            <SwiperSlide key={idx}>
              <img className={img_class} src={item} alt='' ></img>
            </SwiperSlide>
          </div>
        ))}
      </Swiper>
    )
  }
};

export default ImgSlider;