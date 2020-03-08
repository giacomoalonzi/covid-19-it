import React, { useLayoutEffect, useState } from 'react'
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
const breakpointTablet = typeof window !== `undefined` ? window.matchMedia('(min-width:62em)') : null

const params = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    preloadImages: true,
    shouldSwiperUpdate: true,
    autoHeight: false,
    pagination: false,
    "768": {
      slidesPerView: 2,
      spaceBetween: 8,
    },
  }

const CardCarousel = ({ children }) => {
  const [isMobile, setIsMobile] = useState(!breakpointTablet.matches)

  useLayoutEffect(() => {
    
    function updateSize() {
      setIsMobile(!breakpointTablet.matches)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const  renderChildren = (): Array<Function> => {
    return children.map((child, key) => (
      <div className="card-carousel__item" key={key}>
        {child}
      </div>
    ))
  }
  return (
    <div className="card-carousel">
      <div className="card-carousel__wrap">
        {isMobile ? <Swiper {...params}>{renderChildren()}</Swiper> : renderChildren()}
      </div>
  </div>
  )
}

export default CardCarousel