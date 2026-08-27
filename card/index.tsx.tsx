import rectangle46 from "./rectangle-46.png";
import vector59 from "./vector-59.svg";
import vector60 from "./vector-60.svg";
import vector61 from "./vector-61.svg";
import vector62 from "./vector-62.svg";
import vector63 from "./vector-63.svg";
import vector64 from "./vector-64.svg";
import vector65 from "./vector-65.svg";

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

export const Box = (): JSX.Element => {
  return (
    <main
      className="relative h-[650px] w-[1004px]"
      aria-label="Grand prize promotional graphic"
    >
      <section
        className="fixed top-[-6776px] left-[-15569px] h-[650px] w-[1008px] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]"
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
        <a
          className="absolute top-[602px] left-[796px] w-[131px] [font-family:'Montserrat-Bold',Helvetica] text-[17px] leading-[normal] font-bold tracking-[0] text-[#2b89e1]"
          href="https://los-xo.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit los-xo.com"
        >
          los-xo.com
        </a>
        <div
          className="absolute top-[469px] left-[775px] h-[127px] w-[135px] rounded-sm bg-[#d9d9d9]"
          aria-hidden="true"
        />
        {decorativeVectors.map((vector) => (
          <img
            key={vector.src}
            className={vector.className}
            alt=""
            aria-hidden="true"
            src={vector.src}
          />
        ))}

        {/* Text removed */}
      </section>
    </main>
  );
};
