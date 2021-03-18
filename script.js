const input = document.getElementById('input');
const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

let image = null;


const stage = new Konva.Stage({
  container: 'container',
  width: 200,
  height: 200
});
let oldScale = 1;
let scaleBy = 1.01;
const crown = new Konva.Layer();
const imageLayer = new Konva.Layer();

function draw(scale) {

  var simpleText = new Konva.Text({
    x: stage.width() / 2,
    y: 15,
    text: '👑',
    fontSize: 50,
    fontFamily: 'Calibri',
    fill: 'green',
    draggable: true,
  });
  simpleText.rotate(20);


  const ki = new Konva.Image({
    image,
    width: image.width* scale,
    height: image.height*scale,
    x: stage.width() / 2 - 200 / 2,
    y: stage.height() / 2 - 200 / 2,
    draggable: true,
  });
  imageLayer.add(ki);
  imageLayer.add(simpleText);
  stage.add(imageLayer);
  stage.add(crown);
}



stage.on('wheel', (e) => {
  e.evt.preventDefault();

  const newScale =
    e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  const pointer = stage.getPointerPosition();

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  imageLayer.position(newPos);

  oldScale = newScale;
  imageLayer.destroy();
  draw(newScale);
});

input.addEventListener('change', () => {
  const files = input.files;

  if (files.length === 0) {
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", (evt) => {
    const img = new Image();
    img.src = evt.target.result;
    img.addEventListener("load", (evt) => {
      image = img;
      draw(1);
    });
  });

  reader.readAsDataURL(files[0]);
});


document.getElementById('save').addEventListener('click', () => {
  const data = document.getElementsByTagName('canvas')[0].toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById('link');
  link.setAttribute('download', 'finally-im-a-king.png');
  link.setAttribute('href', data);
  link.click();
});
