import fs from "fs";
import path from "path";
import sharp from "sharp";
import { convert } from "pdf-poppler";

const TEMP_DIR = path.join(process.cwd(), "temp");

export const pdfToImage = async (pdfBuffer) => {
	try {
		if (!fs.existsSync(TEMP_DIR)) {
			fs.mkdirSync(TEMP_DIR, { recursive: true });
		}

		const tempPdfPath = path.join(TEMP_DIR, `pdf-${Date.now()}.pdf`);
		const outputImagePath = path.join(TEMP_DIR, `pdf-${Date.now()}`);

		fs.writeFileSync(tempPdfPath, pdfBuffer);

		const options = {
			format: "jpeg",
			out_dir: TEMP_DIR,
			out_prefix: path.basename(outputImagePath),
			page: null,
		};

		await convert(tempPdfPath, options);

		const images = fs.readdirSync(TEMP_DIR)
			.filter((file) => file.startsWith(path.basename(outputImagePath)) && file.endsWith(".jpg"))
			.map((file) => {
				const imageBuffer = fs.readFileSync(path.join(TEMP_DIR, file));

				return sharp(imageBuffer)
					.resize(200)
					.jpeg({ quality: 50 })
					.toBuffer();
			});

		const compressedImages = await Promise.all(images);

		fs.unlinkSync(tempPdfPath);

		return compressedImages;
	} catch (error) {
		console.error("Ошибка при конвертации PDF:", error);
		throw new Error("Не удалось обработать PDF.");
	}
};
