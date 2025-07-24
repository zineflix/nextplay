const popunderUrl = "https://boredomcuff.com/patqeje8gt?key=29974444ccf8e9ef6e0d81c1334915b3"; // Replace with your actual direct link

function openPopunder() {
  const features = "width=200,height=150,left=9999,top=9999";
  let popunder = window.open(popunderUrl, '_blank', features);

  if (popunder) {
    popunder.blur();
    window.focus();
    try {
      popunder.opener.window.focus();
    } catch (e) {}
  }
}

function initPopunderOnInteraction() {
  openPopunder();
  setInterval(openPopunder, 60000); // Every 60 seconds
  document.removeEventListener('click', initPopunderOnInteraction);
}

document.addEventListener('click', initPopunderOnInteraction);
