import { useState, useRef, useEffect } from "react"
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from "react-icons/fa"
import howItWorksVideo from "../../../assets/copy_7E6192E0-A60E-4005-9A63-E4DD9B773EAE.mov" // Video file
import howItWorksImage from "../../../assets/how it works.png" // Poster/thumbnail image

const HowItWorks = ({ forwardedRef }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef(null)
  const progressBarRef = useRef(null)

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        // Attempt to play and handle any autoplay restrictions
        const playPromise = videoRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.error("Play was prevented:", error)
              setIsPlaying(false)
            })
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  // Handle video progress change
  const handleProgressChange = (e) => {
    if (videoRef.current) {
      const newTime = (e.target.value / 100) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Handle fullscreen
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen()
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen()
      }
    }
  }

  // Format time to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Update time display
  useEffect(() => {
    const video = videoRef.current

    const updateTime = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setVideoLoaded(true)
    }

    const handleError = () => {
      console.error("Error loading video")
      setVideoError(true)
    }

    if (video) {
      video.addEventListener("timeupdate", updateTime)
      video.addEventListener("loadedmetadata", handleLoadedMetadata)
      video.addEventListener("error", handleError)

      return () => {
        video.removeEventListener("timeupdate", updateTime)
        video.removeEventListener("loadedmetadata", handleLoadedMetadata)
        video.removeEventListener("error", handleError)
      }
    }
  }, [])

  // Show/hide controls based on mouse movement
  useEffect(() => {
    let timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  return (
    <section ref={forwardedRef} className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <span className="text-white">How it </span>
          <span className="text-[#a855f7]">works</span>
        </h2>

        <div
          className="relative rounded-lg overflow-hidden group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Fallback image for browsers that don't support video or if video fails to load */}
          {videoError && (
            <img
              src={howItWorksImage || "/placeholder.svg?height=720&width=1280"}
              alt="How it works"
              className="w-full rounded-lg"
            />
          )}

          {!videoError && (
            <video
              ref={videoRef}
              className="w-full rounded-lg cursor-pointer"
              src={howItWorksVideo || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
              poster={howItWorksImage || "/placeholder.svg?height=720&width=1280"}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlayPause}
              muted={isMuted}
              preload="metadata"
              playsInline // Better mobile support
            />
          )}

          {/* Play button overlay (only when paused) */}
          {!isPlaying && !videoError && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlayPause}
            >
              <button
                className="bg-[#a855f7]/80 hover:bg-[#a855f7] rounded-full p-5 transition-colors"
                aria-label="Play video"
              >
                <FaPlay className="text-white text-xl" />
              </button>
            </div>
          )}

          {/* Video controls - only show if video is loaded and no error */}
          {!videoError && (
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
            >
              {/* Progress bar */}
              <div className="mb-2">
                <input
                  ref={progressBarRef}
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / (duration || 1)) * 100}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#a855f7]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlayPause}
                    className="text-white hover:text-[#a855f7] transition-colors"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-[#a855f7] transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <FaVolumeMute className="text-xl" /> : <FaVolumeUp className="text-xl" />}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-[#a855f7] transition-colors"
                  aria-label="Fullscreen"
                >
                  <FaExpand className="text-xl" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

