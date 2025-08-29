import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function MenuSwiper({ menu, onAdd }) {
  return (
    <Swiper slidesPerView={2} spaceBetween={16}>
      {menu.map((item) => (
        <SwiperSlide key={item._id}>
          <div className="p-4 bg-white rounded-2xl shadow-lg flex flex-col gap-2">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <p className="text-blue-600 font-semibold">${item.price}</p>
            <button onClick={() => onAdd(item)}>Add to Cart</button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
