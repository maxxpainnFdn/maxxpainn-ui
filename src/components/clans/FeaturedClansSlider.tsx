import { ChevronLeft, ChevronRight, Star, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BlazeSlider, { BlazeConfig } from 'blaze-slider'
import 'blaze-slider/dist/blaze.css'
import ApiQuery from "../apiQuery/ApiQuery";

export default function FeaturedClansSlider() {

  // 1. Store the Blaze instance in a Ref so it persists across re-renders
  const sliderInstRef = useRef<BlazeSlider | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalDots, setTotalDots] = useState(0)
  const [clansDataArr, setClansDataArr] = useState([])

  const config: BlazeConfig = {
    all: {
      slidesToShow: 1,
      loop: true,
      draggable: true,
      enableAutoplay: true,
      autoplayInterval: 8_000,
      slideGap: "15px", // Added for spacing
      stopAutoplayOnInteraction: true,
    },
    "(min-width: 360px)": { slidesToShow: 1 },
    "(min-width: 480px)": { slidesToShow: 2 },
    "(min-width: 768px)": { slidesToShow: 3 },
  };

  useEffect(() => {
    return () => {
      // Cleanup
      sliderInstRef.current?.destroy()
    }
  }, [])


    const initializeSlider = () => {

      if (!sliderRef.current) return;

      // Initialize Blaze
      const slider = new BlazeSlider(sliderRef.current, config)
      sliderInstRef.current = slider;

      //console.log("blaze===>", slider)

      setTotalDots(slider.totalSlides)

      // 2. LOGIC FIX: Blaze passes (pageIndex, firstVisibleIndex, lastVisibleIndex)
      // 'pageIndex' IS the dot index. No math needed here.
      slider.onSlide((pageIndex) => {
        setCurrentIndex(pageIndex)
      })
    }

    const sponsoredClans = [
      { id: 1, name: "Tech Innovators Hub", members: "12.5K", badge: "⭐" },
      { id: 2, name: "Digital Marketing Pros", members: "8.2K", badge: "🚀" },
      { id: 3, name: "Startup Founders Network", members: "15.3K", badge: "💼" },
      { id: 4, name: "AI & Machine Learning", members: "20.1K", badge: "🤖" },
      { id: 5, name: "Web3 Builders", members: "9.7K", badge: "🌐" },
    ];

    // on click
    const onDotClicked = (index: number) => {

      const slider = sliderInstRef.current;

      if(!slider) return;

      const stateIndex = slider.stateIndex
      const loop = slider.config.loop

      const diff = Math.abs(index - stateIndex)
      const inverseDiff = slider.states.length - diff

      const isDiffLargerThanHalf = diff > slider.states.length / 2
      const scrollOpposite = isDiffLargerThanHalf && loop

      // if target state is ahead of current state
      if (index > stateIndex) {
        // but the diff is too large
        if (scrollOpposite) {
          // scroll in opposite direction to reduce scrolling
          slider.prev(inverseDiff)
        } else {
          // scroll normally
          slider.next(diff)
        }
      }

      // if target state is before current state
      else {
        // but the diff is too large
        if (scrollOpposite) {
          // scroll in opposite direction
          slider.next(inverseDiff)
        } else {
          // scroll normally
          slider.prev(diff)
        }
      }
    }

    const goToSlider = (dir: string) => {

        const slider = sliderInstRef.current;

        if(!slider) return;

        if(dir == "prev") {
            slider.prev()
        } else {
            slider.next()
        }
    }

    const onQuerySucess = (dataArr) => {
        setClansDataArr(dataArr)
        setTimeout(() => {
            initializeSlider()
        }, 600)
    }

    return (
        <ApiQuery
            uri="/clans"
            onSuccess={onQuerySucess}
            showError={false}
            loaderProps={{ className: "overflow-hidden p-1 pb-10" }}
        >
            <div className="flex-1 relative bg-gradient-to-br mb-10 from-purple-900/20 via-pink-900/20 to-purple-900/20 rounded-2xl border border-purple-500/20 p-6 overflow-hidden backdrop-blur-xl shadow-2xl shadow-purple-500/10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 blur-3xl" />
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg backdrop-blur-sm">
                                <Zap className="w-4 h-4 text-purple-400 fill-purple-400" />
                            </div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent uppercase tracking-wide">
                            Featured
                            </span>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToSlider("prev")}
                                className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 hover:text-purple-200 transition-all backdrop-blur-sm"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => goToSlider("next")}
                                className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 hover:text-purple-200 transition-all backdrop-blur-sm"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Carousel Container */}
                    <div className="blaze-slider" ref={sliderRef}>
                        <div className="blaze-container">
                            <div className="blaze-track">
                                {sponsoredClans.map((clan) => (
                                    <div key={clan.id}
                                        className="group"
                                    >
                                        <div className="
                                            flex items-center gap-4 p-4
                                            bg-gradient-to-br from-black/40 via-black/30 to-black/40
                                            rounded-xl border border-purple-500/20
                                            hover:border-purple-400/50
                                            hover:shadow-xl hover:shadow-purple-500/20
                                            cursor-pointer transition-all duration-300
                                            backdrop-blur-md
                                            hover:scale-[1.02]
                                            relative overflow-hidden
                                        ">
                                            {/* Hover glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                                                {clan.badge}
                                            </div>

                                            <div className="relative flex-1 min-w-0">
                                                <h3 className="font-bold text-white truncate mb-1 group-hover:text-purple-200 transition-colors">
                                                    {clan.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-purple-300/80 text-sm">
                                                <Users className="w-4 h-4" />
                                                <span className="font-medium">{clan.members}</span>
                                                    <span className="text-purple-400/60">members</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-5">
                        {Array.from({ length: totalDots }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => onDotClicked(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === currentIndex
                                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 w-8 shadow-lg shadow-purple-500/50'
                                    : 'bg-purple-500/30 w-2 hover:bg-purple-400/50 hover:w-4'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ApiQuery>
    )
}
