const animation = {
  fadeOut: {
    opacity: 0,
    transition: { duration: 0.3 },
  },

  slideOut: {
    x: "-100%",
    transition: { duration: 0.3 },
  },

  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideIn: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: { duration: 2 },
  },
  scale: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    transition: { duration: 0.3 },
  },
};

export default animation;
