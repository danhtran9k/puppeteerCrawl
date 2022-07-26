const puppeteer = require("puppeteer");
const fs = require("fs");
const download = require("image-downloader");

const urlDoc = "https://hupedu-my.sharepoint.com/:b:/g/personal/tt_adr_hup_edu_vn/EcHSWVqDc7FBtTPRCBiJvmUBSTctaUfm9zAPwWQtxjj20w?e=wreg3X";
querySelectStr = (pageNum) => `canvas[aria-label='Page ${pageNum}']`;
// const selectorPageNav = "div[data-bind='text:ofPagesLabel']";

const convertBase64ToBlob = (base64) => {
	const parts = base64.split(";base64,");
	const imageType = parts[0].split(":")[1];
	const decodedData = window.atob(parts[1]);
	const uInt8Array = new Uint8Array(decodedData.length);
	for (let i = 0; i < decodedData.length; ++i) {
		uInt8Array[i] = decodedData.charCodeAt(i);
	}
	return new Blob([uInt8Array], { type: imageType });
};

const getFile = (b64data) => {
	try {
		const blob = convertBase64ToBlob(b64data);
		const fileURL = URL.createObjectURL(blob);
		return fileURL;
	} catch (error) {
		console.error(error);
		return null;
		a;
	}
};

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	page.setViewport({ width: 1280, height: 1250 });
	await page.goto(urlDoc, { waitUntil: "networkidle2" });

	const arrDataUrl = await page.evaluate(async () => {
		const pageDataLoad = "div.page";
		const attributeDataLoad = "data-loaded";
		const canvasSelector = ".canvasWrapper>canvas";
		const wait = async () => await new Promise((res) => setTimeout(res, 100));

		const arrPage = document.querySelectorAll(pageDataLoad);
		const result = [];
		for (const singlePage of arrPage) {
			singlePage.scrollIntoView();
			while (!singlePage.getAttribute(attributeDataLoad)) {
				await wait();
			}
			await wait();
			const pageNum = singlePage.getAttribute("data-page-number");
			const canvasPage = singlePage.querySelector(canvasSelector);
			result.push({ pageNum, dataUrl: canvasPage.toDataURL() });
		}
		return result;
	});

	arrDataUrl.forEach(({ pageNum, dataUrl }) => {
		const fileName = `${pageNum}.png`;
		const saveDir = "./test/";
		const option = { url: dataUrl, dest: saveDir + fileName };
		// download
		// 	.image(option)
		// 	.then(({ filename }) => {
		// 		console.log("Saved to", filename); // saved to /path/to/dest/photo.jpg
		// 	})
		// 	.catch((err) => console.error(err));
		const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
		fs.writeFile(`./test/${pageNum}.png`, base64Data, "base64", function (err) {
			console.log("🚀 index-L57-err", err);
		});
	});
	// await browser.close();
})();
