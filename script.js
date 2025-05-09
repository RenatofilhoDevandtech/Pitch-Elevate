document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const slides = document.querySelectorAll(".slide")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const slideCounter = document.getElementById("slideCounter")
  const progressBar = document.getElementById("progressBar")
  const skipLink = document.querySelector(".skip-link")
  const increaseTextBtn = document.getElementById("increaseText")
  const decreaseTextBtn = document.getElementById("decreaseText")
  const toggleContrastBtn = document.getElementById("toggleContrast")
  const toggleSound = document.getElementById("toggleSound")
  const demoButton = document.getElementById("demoButton")
  const demoContainer = document.getElementById("demoContainer")
  const indicatorDots = document.getElementById("indicatorDots")

  // Variables
  let currentSlide = 0
  const totalSlides = slides.length
  let fontSizeBase = 16
  let soundEnabled = false
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 30) // Launch date is 30 days from now

  // Initialize
  createIndicatorDots()
  updateSlideCounter()
  updateProgressBar()
  startCountdown()
  startCounters()

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide()
      if (soundEnabled) playSound("click")
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide()
      if (soundEnabled) playSound("click")
    })
  }

  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault()
      document.querySelector(".slide.active .content").focus()
      if (soundEnabled) playSound("click")
    })
  }

  // Demo button
  if (demoButton && demoContainer) {
    demoButton.addEventListener("click", () => {
      demoContainer.classList.toggle("active")
      if (soundEnabled) playSound("click")
    })
  }

  // Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextSlide()
      if (soundEnabled) playSound("click")
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      prevSlide()
      if (soundEnabled) playSound("click")
    }
  })

  // Accessibility Controls
  if (increaseTextBtn) {
    increaseTextBtn.addEventListener("click", () => {
      changeFontSize(1)
      if (soundEnabled) playSound("click")
    })
  }

  if (decreaseTextBtn) {
    decreaseTextBtn.addEventListener("click", () => {
      changeFontSize(-1)
      if (soundEnabled) playSound("click")
    })
  }

  if (toggleContrastBtn) {
    toggleContrastBtn.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast")
      if (soundEnabled) playSound("click")
    })
  }

  if (toggleSound) {
    toggleSound.addEventListener("click", function () {
      soundEnabled = !soundEnabled
      this.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>'
      if (soundEnabled) playSound("click")
    })
  }

  // Touch Events for Mobile
  let touchStartX = 0
  let touchEndX = 0

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  })

  function handleSwipe() {
    const swipeThreshold = 50
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left
      nextSlide()
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right
      prevSlide()
    }
  }

  // Functions
  function showSlide(index) {
    // Hide all slides
    slides.forEach((slide) => {
      slide.classList.remove("active")
    })

    // Show the current slide
    slides[index].classList.add("active")

    // Update counter and progress
    updateSlideCounter()
    updateProgressBar()
    updateIndicatorDots()

    // Announce slide change for screen readers
    const liveRegion = document.createElement("div")
    liveRegion.setAttribute("aria-live", "polite")
    liveRegion.setAttribute("class", "sr-only")
    liveRegion.textContent = `Slide ${index + 1} de ${totalSlides}`
    document.body.appendChild(liveRegion)

    // Remove the live region after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)

    // Play sound if enabled
    if (soundEnabled) {
      playSound("slide")
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides
    showSlide(currentSlide)
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    showSlide(currentSlide)
  }

  function updateSlideCounter() {
    if (slideCounter) {
      slideCounter.textContent = `${currentSlide + 1}/${totalSlides}`
    }
  }

  function updateProgressBar() {
    if (progressBar) {
      const progress = ((currentSlide + 1) / totalSlides) * 100
      progressBar.style.width = `${progress}%`
    }
  }

  function createIndicatorDots() {
    if (!indicatorDots) return

    // Clear existing dots
    indicatorDots.innerHTML = ""

    // Create new dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div")
      dot.classList.add("indicator-dot")
      if (i === currentSlide) {
        dot.classList.add("active")
      }

      // Add click event to each dot
      dot.addEventListener("click", () => {
        currentSlide = i
        showSlide(currentSlide)
        if (soundEnabled) playSound("click")
      })

      indicatorDots.appendChild(dot)
    }
  }

  function updateIndicatorDots() {
    if (!indicatorDots) return

    const dots = indicatorDots.querySelectorAll(".indicator-dot")
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("active")
      } else {
        dot.classList.remove("active")
      }
    })
  }

  function changeFontSize(delta) {
    fontSizeBase = Math.max(12, Math.min(24, fontSizeBase + delta))
    document.documentElement.style.setProperty("--font-size-base", `${fontSizeBase}px`)
  }

  function startCounters() {
    const counters = document.querySelectorAll(".counter")

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target")
      let count = 0
      const duration = 2000 // 2 seconds
      const increment = target / (duration / 16) // 60fps

      const updateCount = () => {
        if (count < target) {
          count += increment
          counter.textContent = Math.min(Math.ceil(count), target)
          requestAnimationFrame(updateCount)
        } else {
          counter.textContent = target
        }
      }

      updateCount()
    })
  }

  function startCountdown() {
    function updateCountdown() {
      const now = new Date().getTime()
      const distance = launchDate - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (document.getElementById("days")) {
        document.getElementById("days").innerHTML = days.toString().padStart(2, "0")
      }
      if (document.getElementById("hours")) {
        document.getElementById("hours").innerHTML = hours.toString().padStart(2, "0")
      }
      if (document.getElementById("minutes")) {
        document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, "0")
      }
      if (document.getElementById("seconds")) {
        document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, "0")
      }
    }

    updateCountdown()
    setInterval(updateCountdown, 1000)
  }

  function playSound(type) {
    let sound

    switch (type) {
      case "click":
        sound = new Audio(
          "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD09PT09PUxMTExMTFlZWVlZWWdnZ2dnZ3V1dXV1dYODg4ODg5GRkZGRkZ+fn5+fn62tra2trbq6urq6usLCwsLCwtDQ0NDQ0NjY2NjY2Obm5ubm5vT09PT09P///////////////8BAAAAA//tAxAABTgSwlpDQAA3ISXL0ChAB4AFAQAAkOALEs7LjMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQxNYDwAABpAAAACAAADSAAAAEzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz/+xDE1gPAAAGkAAAAIAAANIAAAARMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM",
        )
        break
      case "hover":
        sound = new Audio(
          "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD09PT09PUxMTExMTFlZWVlZWWdnZ2dnZ3V1dXV1dYODg4ODg5GRkZGRkZ+fn5+fn62tra2trbq6urq6usLCwsLCwtDQ0NDQ0NjY2NjY2Obm5ubm5vT09PT09P///////////////8BAAAAA//tAxAABTgSwlpDQAA3ISXL0ChAB4AFAQAAkOALEs7LjMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQxNYDwAABpAAAACAAADSAAAAEzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz/+xDE1gPAAAGkAAAAIAAANIAAAARMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM",
        )
        break
      case "slide":
        sound = new Audio(
          "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD09PT09PUxMTExMTFlZWVlZWWdnZ2dnZ3V1dXV1dYODg4ODg5GRkZGRkZ+fn5+fn62tra2trbq6urq6usLCwsLCwtDQ0NDQ0NjY2NjY2Obm5ubm5vT09PT09P///////////////8BAAAAA//tAxAABTgSwlpDQAA3ISXL0ChAB4AFAQAAkOALEs7LjMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQxNYDwAABpAAAACAAADSAAAAEzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz/+xDE1gPAAAGkAAAAIAAANIAAAARMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM",
        )
        break
    }

    if (sound) {
      sound.volume = 0.2
      sound.play()
    }
  }

  // Add focus styles for keyboard navigation
  const focusableElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.classList.add("focus-visible")
    })

    element.addEventListener("blur", function () {
      this.classList.remove("focus-visible")
    })
  })

  // Initialize the first slide
  showSlide(currentSlide)
})
