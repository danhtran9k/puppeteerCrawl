const puppeteer = require("puppeteer");
const urlDoc = "https://hupedu-my.sharepoint.com/:b:/g/personal/tt_adr_hup_edu_vn/EcHSWVqDc7FBtTPRCBiJvmUBSTctaUfm9zAPwWQtxjj20w?e=wreg3X";
querySelectStr = (pageNum) => `canvas[aria-label='Page ${pageNum}']`;
// const selectorPageNav = "div[data-bind='text:ofPagesLabel']";
const pageDataLoad = "div.page";
const attributeDataLoad = "data-loaded";

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
	}
};

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	page.setViewport({ width: 1280, height: 1250 });
	await page.goto(urlDoc, { waitUntil: "networkidle2" });

	// const totalPage = await page.$eval(selectorPageNav, (ele) => ele.innerHTML.split(" ")[1]);

	const pages = await page.$$eval(pageDataLoad, (arrPage) => {
		for (const singlePage of arrPage) {
			const loaded = singlePage.getAttribute(attributeDataLoad);
			console.log("🚀 index-L41-loaded", loaded);
		}
	});

	// await browser.close();
})();
