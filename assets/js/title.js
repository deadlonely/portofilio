var titles = [
  "@",
  "@d",
  "@de",
  "@dea",
  "@dead",
  "@deadl",
  "@deadlo",
  "@deadlon",
  "@deadlone",
  "@deadlonel",
  "@deadlonely",
  "@deadlonel",
  "@deadlone",
  "@deadlon",
  "@deadlo",
  "@deadl",
  "@dead",
  "@dea",
  "@de",
  "@d",
  "@",
];

function changeTitle() {
  var index = 0;

  setInterval(function() {
      document.title = titles[index];
      index = (index + 1) % titles.length;
  }, 1000);
}

changeTitle();
