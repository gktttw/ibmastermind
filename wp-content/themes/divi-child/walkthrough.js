
// Define the tour!
var tour = {
    id: "hello-hopscotch",
    steps: [
      {
        title: "ABOUT",
        content: "abotujasdlkalds",
        target: "menu-item-173",
        placement: 'bottom'
      },
      {
        title: "membership",
        content: "membershitpasdklfjals;kf",
        target: "menu-item-25678",
        placement: "bottom"
      },
      {
        title: "training mode",
        content: "Training!Training!Training!Training!Training!",
        target: "menu-item-25566",
        placement: "bottom"
      },
      {
        title: "exam mode",
        content: "EXAM!EXAM!EXAM!EXAM!EXAM!EXAM!EXAM!",
        target: "menu-item-170",
        placement: "bottom"
      }
    ],
	// showPrevButton: true,
  // scrollTopMargin: 100
};

var execute = data.execute;

if (execute === true) {
  forceTour();
}

function forceTour() {
  hopscotch.startTour(tour);
}