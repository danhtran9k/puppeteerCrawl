const puppeteer = require("puppeteer");
const fs = require("fs");
const download = require("image-downloader");

const urlDoc = "https://hupedu-my.sharepoint.com/:b:/g/personal/tt_adr_hup_edu_vn/EcHSWVqDc7FBtTPRCBiJvmUBSTctaUfm9zAPwWQtxjj20w?e=wreg3X";
querySelectStr = (pageNum) => `canvas[aria-label='Page ${pageNum}']`;
// const selectorPageNav = "div[data-bind='text:ofPagesLabel']";

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
