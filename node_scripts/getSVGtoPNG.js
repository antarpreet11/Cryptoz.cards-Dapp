const https = require("https");
const fs = require("fs");
const request = require("request");
const sharp = require("sharp");
const { exit } = require("process");

const svgPath = "./zoombies-nft-svgs";
const pngPath = "./zoombies-nft-pngs";
const firstPoint = 1;
const endPoind = 40;

const downloader = (url, filename) => {
  return new Promise((resolve, reject) => {
    // Check existence on remote
    request(url, function (err, resp) {
      if (resp.statusCode === 200) {
        https.get(url, function (res) {
          const fileStream = fs.createWriteStream(filename);
          res.pipe(fileStream);
          fileStream.on("finish", function () {
            fileStream.close();
            if (fs.statSync(filename).size == 0) {
              fs.unlinkSync(filename);
            } else {
              console.log("Downloaded " + filename);
            }
            resolve();
          });
        });
      } else {
        console.log(url + " not exists on server.");
        reject();
      }
    });
  });
};

try {
  // Check if directory already exists
  if (!fs.existsSync(svgPath)) {
    fs.mkdirSync(svgPath);
    console.log("SVG directory is created.");
  } else {
    console.log("SVG directory already exists.");
  }

  if (!fs.existsSync(pngPath)) {
    fs.mkdirSync(pngPath);
    console.log("PNG directory is created.");
  } else {
    console.log("PNG directory already exists.");
  }
} catch (err) {
  console.log(err);
  exit()
}

const arr = [];
// Download all SVG files
for (let i = firstPoint; i <= endPoind; i++) {
  arr.push(
    downloader(
      "https://zoombies.world/nft-image/" + i,
      svgPath + "/zoombies-nft-" + i + ".svg"
    )
  );
}

Promise.all(arr).then((res) => {
  for (let i = firstPoint; i <= endPoind; i++) {
    let path = svgPath + "/zoombies-nft-" + i + ".svg";
    if (fs.existsSync(path)) {
      resizeImage(path, i);
    }
  }
  console.log("Converted into PNG");
});

// Convert SVG to PNG
async function resizeImage(path, idx) {
  try {
    await sharp(path)
      .resize({
        width: 620,
        height: 1000,
      })
      .toFormat("png", { palette: true })
      .toFile(pngPath + "/zoombies-nft-" + idx + ".png");
  } catch (error) {
    console.log(error);
  }
}
