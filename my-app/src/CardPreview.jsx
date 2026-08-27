import React from 'react';

// Using placeholders instead of missing local image imports
const rectangle46 = "/IMG_2571.PNG";
const vector59 = "https://via.placeholder.com/20x20/FF0000/FFFFFF?text=V";
const vector60 = "https://via.placeholder.com/50x30/00FF00/FFFFFF?text=V";
const vector61 = "https://via.placeholder.com/10x10/0000FF/FFFFFF?text=V";
const vector62 = "https://via.placeholder.com/10x10/FFFF00/FFFFFF?text=V";
const vector63 = "https://via.placeholder.com/10x10/FF00FF/FFFFFF?text=V";
const vector64 = "https://via.placeholder.com/10x10/00FFFF/FFFFFF?text=V";
const vector65 = "https://via.placeholder.com/50x20/FFFFFF/000000?text=V";

const decorativeVectors = [
  {
    src: vector59,
    className: "absolute top-[439px] left-[194px] w-[15px] h-6",
  },
  {
    src: vector60,
    className: "absolute top-[436px] left-[155px] w-[51px] h-[31px]",
  },
  {
    src: vector61,
    className: "absolute top-[449px] left-[186px] w-[3px] h-[5px]",
  },
  {
    src: vector62,
    className: "absolute top-[444px] left-[196px] w-1 h-[7px]",
  },
  {
    src: vector63,
    className: "absolute top-[452px] left-[163px] w-1.5 h-[11px]",
  },
  {
    src: vector64,
    className: "absolute top-[446px] left-[164px] w-0.5 h-[3px]",
  },
  {
    src: vector65,
    className: "absolute top-[443px] left-[99px] w-14 h-[23px]",
  },
];

export default function CardPreview() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <main
        className="relative h-[650px] w-[1004px] overflow-hidden"
        aria-label="Grand prize promotional graphic"
      >
        <section
          className="absolute top-0 left-0 h-[650px] w-[1004px] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]"
          aria-label="Promotional overlay"
        >
          <img
            className="absolute top-0 left-0 h-[650px] w-[1004px] object-cover"
            alt=""
            aria-hidden="true"
            src={rectangle46}
          />
          <div
            className="absolute top-[606px] left-[796px] h-4 w-24 bg-[#dde0f3] blur-[2px]"
            aria-hidden="true"
          />

          <div
            className="absolute top-[469px] left-[775px] h-[127px] w-[135px] rounded-sm bg-[#d9d9d9]"
            aria-hidden="true"
          />
          {/* decorativeVectors removed to fix broken image icons */}

          {/* Text removed */}
        </section>
      </main>
    </div>
  );
}
