import './hero-slider.css'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export type SlideData = {
  id: string
  title: string
  subtext: string
  mediaSrc?: string
  mediaAlt?: string
}

interface HeroSliderIslandProps {
  slides: SlideData[]
  fadeDuration?: number
  autoplayDelay?: number
  showIndicator?: boolean
  baseHeading: string
  baseSubtext?: string | null
}

export default function HeroSliderIsland({
  slides,
  fadeDuration = 700,
  autoplayDelay = 5000,
  showIndicator = true,
  baseHeading,
  baseSubtext,
}: HeroSliderIslandProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, autoplayDelay)

    return () => clearInterval(timer)
  }, [slides.length, autoplayDelay])

  // GSAP Crossfade
  useGSAP(
    () => {
      if (slides.length <= 1) return

      slidesRef.current.forEach((el, index) => {
        if (!el) return
        if (index === currentIndex) {
          gsap.to(el, {
            opacity: 1,
            zIndex: 2,
            duration: fadeDuration / 1000,
            ease: 'power2.inOut',
          })
        } else {
          gsap.to(el, {
            opacity: 0,
            zIndex: 1,
            duration: fadeDuration / 1000,
            ease: 'power2.inOut',
          })
        }
      })
    },
    { dependencies: [currentIndex, fadeDuration, slides.length], scope: containerRef }
  )

  if (slides.length === 0) {
    return (
      <div className="hero-slider__fallback">
        <h1 className="hero-slider__base-heading">{baseHeading}</h1>
        {baseSubtext && <p className="hero-slider__base-subtext">{baseSubtext}</p>}
      </div>
    )
  }

  return (
    <div className="hero-slider" ref={containerRef}>
      <div className="hero-slider__media-track">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => {
              slidesRef.current[index] = el
            }}
            className="hero-slider__slide"
            style={{ opacity: index === 0 ? 1 : 0, zIndex: index === 0 ? 2 : 1 }}
          >
            {slide.mediaSrc && (
              <img
                src={slide.mediaSrc}
                alt={slide.mediaAlt || slide.title}
                className="hero-slider__img"
              />
            )}
            <div className="hero-slider__overlay" />
            <div className="hero-slider__content">
              <div className="hero-slider__content-inner">
                {/* Base heading from block stays consistent or can be integrated */}
                {index === 0 && baseHeading && (
                  <div className="hero-slider__base-context">
                    <span className="hero-slider__base-heading-mini">{baseHeading}</span>
                  </div>
                )}
                <h2 className="hero-slider__title">{slide.title}</h2>
                {slide.subtext && <p className="hero-slider__subtext">{slide.subtext}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showIndicator && slides.length > 1 && (
        <div className="hero-slider__controls">
          <div className="hero-slider__indicator">
            <span className="hero-slider__current">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="hero-slider__separator">/</span>
            <span className="hero-slider__total">
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>
          <div className="hero-slider__nav">
            <button
              className="hero-slider__btn"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
            >
              Prev
            </button>
            <button
              className="hero-slider__btn"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              aria-label="Next slide"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
