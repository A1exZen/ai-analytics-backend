import fs from "fs";
import path from "path";
import sharp from "sharp";
import { convert } from "pdf-poppler";

const TEMP_DIR = path.join(process.cwd(), "temp");

export const pdfToImage = async (pdfBuffer) => {
	try {
		// Создаем папку, если её нет
		if (!fs.existsSync(TEMP_DIR)) {
			fs.mkdirSync(TEMP_DIR, { recursive: true });
		}

		const tempPdfPath = path.join(TEMP_DIR, `pdf-${Date.now()}.pdf`);
		const outputImagePath = path.join(TEMP_DIR, `pdf-${Date.now()}`);

		// Записываем PDF во временный файл
		fs.writeFileSync(tempPdfPath, pdfBuffer);

		// Опции для конвертации PDF в изображения (JPG)
		const options = {
			format: "jpeg",
			out_dir: TEMP_DIR,
			out_prefix: path.basename(outputImagePath),
			page: null, // Конвертировать все страницы
		};

		// Конвертируем PDF в изображения
		await convert(tempPdfPath, options);

		// Получаем список сгенерированных изображений
		const images = fs.readdirSync(TEMP_DIR)
			.filter((file) => file.startsWith(path.basename(outputImagePath)) && file.endsWith(".jpg"))
			.map((file) => {
				const imageBuffer = fs.readFileSync(path.join(TEMP_DIR, file));

				// Сжимаем изображение (уменьшаем размер и качество)
				return sharp(imageBuffer)
					.resize(200)  // Уменьшаем размер изображения (200px по большей стороне)
					.jpeg({ quality: 50 })  // Снижаем качество JPEG (до 50%)
					.toBuffer();
			});

		// Ожидаем, пока все изображения будут сжаты
		const compressedImages = await Promise.all(images);

		// Удаляем временный PDF файл
		fs.unlinkSync(tempPdfPath);

		return compressedImages; // Возвращаем массив сжатых изображений
	} catch (error) {
		console.error("Ошибка при конвертации PDF:", error);
		throw new Error("Не удалось обработать PDF.");
	}
};
