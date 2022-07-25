querySelectStr = (pageNum) => `canvas[aria-label='Page ${pageNum}']`;
// const selectorPageNav = "div[data-bind='text:ofPagesLabel']";

const pageDataLoad = "div.page";
const attributeDataLoad = "data-loaded";

const wait = async () => await new Promise((res) => setTimeout(res, 300))
const arrPage = document.querySelectorAll(pageDataLoad);
const awaitScroll = async () => {
	for (const singlePage of arrPage) {
		singlePage.scrollIntoView();
		await wait()
	}
};
