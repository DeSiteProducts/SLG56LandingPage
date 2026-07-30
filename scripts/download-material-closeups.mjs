import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const outputDir = path.join(process.cwd(), "public", "materials");
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

function commonsFile(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
}

const images = [
  {
    slug: "pea-gravel",
    url: commonsFile("Small pebbles.jpg"),
  },
  {
    slug: "golf-course-sand",
    url: commonsFile("Gfp-grainy-sand-texture.jpg"),
  },
  {
    slug: "recycled-concrete",
    url: "https://images.unsplash.com/photo-1773614359232-8eef10578150?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    slug: "winter-sand",
    url: commonsFile("Snow and sand ground texture Helsinki.jpg"),
  },
  {
    fileName: "loam-sandy",
    slug: "loam",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Sandy_loam_2.JPG",
  },
  {
    slug: "septic-stone",
    url: "https://www.photos-public-domain.com/wp-content/uploads/2018/09/gray-gravel-texture.jpg",
  },
  {
    slug: "decorative-rock",
    url: "https://images.unsplash.com/photo-1759695330673-e1bf32e4271f?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    slug: "drainage-rock",
    url: "https://www.photos-public-domain.com/wp-content/uploads/2011/01/gray-gravel-rock-texture.jpg",
  },
  {
    slug: "pipe-bedding",
    url: commonsFile("Crushed Granite Texture.jpg"),
  },
  {
    slug: "recycled-asphalt",
    url: "https://asphapro.com/blog/images/asphalt-millings-texture.webp",
  },
  {
    slug: "bark-mulch",
    url: "https://www.photos-public-domain.com/wp-content/uploads/2011/01/bark-mulch-texture.jpg",
  },
  {
    slug: "wood-grindings",
    url: "https://www.photos-public-domain.com/wp-content/uploads/2018/07/wood-chips-texture.jpg",
  },
  {
    slug: "rocks",
    url: "https://www.photos-public-domain.com/wp-content/uploads/2018/09/rounded-rocks-texture.jpg",
  },
  {
    slug: "sand",
    url: "https://images.unsplash.com/photo-1638524138127-6b6b919e65f4?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    slug: "compost",
    url: "https://images.unsplash.com/photo-1592484773536-263bf52e81fc?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    slug: "gravel",
    url: "https://images.unsplash.com/photo-1657199926989-04cae721c772?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    slug: "dirt",
    url: "https://images.unsplash.com/photo-1534189899631-018d5a28514b?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    fileName: "topsoil-rich",
    slug: "topsoil",
    url: "https://images.pexels.com/photos/29555030/pexels-photo-29555030.jpeg?cs=srgb&dl=pexels-araf-29555030.jpg&fm=jpg",
  },
];

async function downloadImage(url) {
  const tmpFolder = await mkdtemp(path.join(tmpdir(), "slg-material-"));
  const tmpFile = path.join(tmpFolder, "source-image");

  try {
    await execFileAsync(
      "curl",
      [
        "-L",
        "--fail",
        "--retry",
        "4",
        "--retry-all-errors",
        "--retry-delay",
        "2",
        "-A",
        userAgent,
        "-o",
        tmpFile,
        url,
      ],
      { timeout: 90000 },
    );

    return await readFile(tmpFile);
  } finally {
    await rm(tmpFolder, { force: true, recursive: true });
  }
}

const targetSlugs = new Set(process.argv.slice(2));

for (const image of images) {
  if (targetSlugs.size > 0 && !targetSlugs.has(image.slug)) {
    continue;
  }

  const sourceBuffer = await downloadImage(image.url);

  await sharp(sourceBuffer)
    .rotate()
    .resize(900, 640, { fit: "cover", position: "attention" })
    .jpeg({ mozjpeg: true, quality: 84 })
    .toFile(path.join(outputDir, `${image.fileName ?? image.slug}.jpg`));
}
