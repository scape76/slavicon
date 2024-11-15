import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { usePrevNextButtons } from "./carousel-button";
import { GodBasic } from "@/routes/collection";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TWEEN_SCALE_FACTOR_BASE = 0.35;
const TWEEN_OPACITY_FACTOR_BASE = 0.6;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type PropType = {
  collection: GodBasic[];
  options?: EmblaOptionsType;
};

const GodsCarousel: React.FC<PropType> = (props) => {
  const { collection, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenScaleFactor = useRef(0);
  const tweenOpacityFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  const [currentGod, setCurrentGod] = useState(props.collection[0].name);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number") as HTMLElement;
    });
  }, []);

  const setTweenFactors = useCallback((emblaApi: EmblaCarouselType) => {
    tweenScaleFactor.current =
      TWEEN_SCALE_FACTOR_BASE * emblaApi.scrollSnapList().length;
    tweenOpacityFactor.current =
      TWEEN_OPACITY_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const onGodChange = (emplaApi: EmblaCarouselType) => {
    const indx = emplaApi.selectedScrollSnap();
    setCurrentGod(props.collection[indx % props.collection.length]!.name);
  };

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const DEFAULT_SCALE = 1.2;

          const tweenScaleValue =
            DEFAULT_SCALE - Math.abs(diffToTarget * tweenScaleFactor.current);

          const tweenOpacityValue =
            1 - Math.abs(diffToTarget * tweenOpacityFactor.current);

          const scale = numberWithinRange(
            tweenScaleValue,
            0,
            DEFAULT_SCALE
          ).toString();
          const opacity = numberWithinRange(tweenOpacityValue, 0, 1);

          const tweenNode = tweenNodes.current[slideIndex];
          tweenNode.style.transform = `scale(${scale})`;
          tweenNode.style.opacity = `${opacity}`;
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactors(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactors)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale)
      .on("select", onGodChange);
  }, [emblaApi, tweenScale]);

  return (
    <div className="embla flex-1 relative">
      <div className="embla__viewport h-full pb-10" ref={emblaRef}>
        <div className="embla__container h-full">
          {[...collection, ...collection].map((god, i) => (
            <div
              className="embla__slide h-full flex-[0_0_100%] sm:flex-[0_0_70%] md:flex-[0_0_65%] lg:flex-[0_0_50%] xl:flex-[0_0_35%]"
              key={god.name + i}
            >
              <div className="relative">
                <div className="embla__slide__number flex-col items-center text-center h-full relative">
                  <div className="flex flex-col gap-2 absolute top-24 left-[50%] -translate-x-[50%]">
                    <h2 className="text-2xl lg:text-3xl">{god.name}</h2>
                    <h3 className="text-lg lg:text-2xl text-muted-foreground">
                      {god.knownAs}
                    </h3>
                  </div>
                  <Link to={`/collection/${god.name}`}>
                    <img
                      src={god.image}
                      alt={god.name}
                      className="max-h-full"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls absolute bottom-24 left-[50%] -translate-x-[46%]">
        <div className="embla__buttons flex gap-6 items-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Link
            to={`/collection/${currentGod}`}
            className="bg-gradient-to-r from-black/0 via-black/80 to-black/0 shadow-inner px-6 py-2 hover:via-black/50"
          >
            Explore
          </Link>
          <Button
            size="icon"
            variant="ghost"
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { GodsCarousel };
