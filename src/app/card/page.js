'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './card.css';

export default function CardDetails() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper"
            >
                <SwiperSlide className="card-slide">
                    <img src="/images/card.png" alt="Visa Front" className="card-img" />
                </SwiperSlide>
                <SwiperSlide className="card-slide">
                    <img src="/images/visa2.png" alt="Visa Back" className="card-img" />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
