export default $('.slider').slick({
  dots: false,
  infinite: false,
  speed: 300,
  centerMode: true,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        infinite: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        dots: false,
      },
    },
    {
      breakpoint: 300,
      settings: {
        dots: false,
      },
    },
  ],
});
