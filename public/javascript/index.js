const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");

const sharingContainer = document.querySelector(".sharing-container");
const fileURLInput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");

const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");

const host = window.location.href;
const uploadURL = `${host}api/files/upload`;
const emailURL = `${host}api/files/send`;
const maxAllowedSize = 100 * 1024 * 1024; //100mb
// const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover", (e) => {
	e.preventDefault();
	if (!dropZone.classList.contains("dragged")) {
		dropZone.classList.add("dragged");
	}
});

dropZone.addEventListener("dragleave", () => {
	dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
	e.preventDefault();
	dropZone.classList.remove("dragged");
	files = e.dataTransfer.files;
	console.log(files);
	if (files.length) {
		fileInput.files = files;
		uploadFile();
	}
});

fileInput.addEventListener("change", () => {
	uploadFile();
});

browseBtn.addEventListener("click", () => {
	fileInput.click();
});

copyBtn.addEventListener("click", () => {
	fileURLInput.select();
	document.execCommand("copy");
	showToast("Link Copied");
});

const uploadFile = () => {
	if (fileInput.files.length > 1) {
		resetFileInput();
		showToast("Only Upload 1 file!");
		return;
	}
	const file = fileInput.files[0];
	if (file.size > maxAllowedSize) {
		showToast("Can't Upload more than 100MB");
		resetFileInput();
		return;
	}
	progressContainer.style.display = "block";

	const formData = new FormData();
	formData.append("uploadedFile", file);

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			console.log(xhr.responseText);
			onUploadSuccess(JSON.parse(xhr.response));
		}
	};
	xhr.upload.onprogress = updateProgress;

	xhr.upload.onerror = () => {
		resetFileInput();
		showToast(`Error in upload: ${xhr.statusText}`);
	};

	xhr.open("POST", uploadURL);
	xhr.send(formData);
};

const updateProgress = (e) => {
	const percent = Math.round((e.loaded / e.total) * 100);
	//	console.log(percent);
	console.log(e);
	bgProgress.style.width = `${percent}%`;
	percentDiv.innerText = percent;
	progressBar.style.transform = `scaleX(${percent / 100})`;
};

const onUploadSuccess = ({ file: url }) => {
	console.log("reeached here");
	console.log(url);
	resetFileInput();
	emailForm[2].removeAttribute("disabled");
	progressContainer.style.display = "none";
	sharingContainer.style.display = "block";
  const urlShrink = url.substring(10, url.length)
	// fileURLInput.value = "https://cloud-share.nikhilpn1.repl.co/" + urlShrink;
	fileURLInput.value = url;
};

const resetFileInput = () => {
	fileInput.value = "";
};

emailForm.addEventListener("submit", (e) => {
	e.preventDefault();

	emailForm[2].setAttribute("disabled", "true");

	console.log("Submit Form");
	const url = fileURL.value;
	console.log("url: ", url);
	const formData = {
		uuid: url.split("/").splice(-1, 1)[0],
		receiversEmail: emailForm.elements["to-email"].value,
		sendersEmail: emailForm.elements["from-email"].value,
	};

	console.log(formData);

	fetch(emailURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	})
		.then((res) => res.json())
		.then(({ success }) => {
			if (success) {
				sharingContainer.style.display = "none";
				showToast("Email sent");
			}
		});
});

let toastTimer;
const showToast = (msg) => {
	toast.innerHTML = msg;
	toast.style.transform = "translate(-50%,0)";
	clearInterval(toastTimer);
	toastTimer = setTimeout(() => {
		toast.style.transform = "translate(-50%,60px)";
	}, 2000);
};