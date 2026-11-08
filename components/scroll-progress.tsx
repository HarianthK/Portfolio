// A CSS scroll-driven animation, so the bar costs no JavaScript; without support it is simply absent.
export function ScrollProgress() {
  return (
    <div
      aria-hidden
      className="scroll-progress fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-accent to-primary"
    />
  )
}
