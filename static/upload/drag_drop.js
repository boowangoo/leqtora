const VIDEO_ICON = VAR_VIDEO_ICON;
const CAPTIONS_ICON = VAR_CAPTIONS_ICON;

function checkFileType(file, type) {
  if (type === "video") {
    if (!file.type.startsWith("video/")) {
      alert("Only video files are allowed.");
      return null;
    }
    return VIDEO_ICON;
  }
  else if (type === "captions" && !file.name.endsWith(".srt")) {
    alert("Only captions files (.srt) are allowed.");
    return null;
  }
  return CAPTIONS_ICON;
}

var uploadFiles = {};

function updateThumbnail(drop_elm, file, svg_icon) {
  // First time - remove the prompt
  if (drop_elm.querySelector(".dropzone_prompt")) {
    drop_elm.querySelector(".dropzone_prompt").remove();
  }

  thumb_elm = document.createElement("div");
  thumb_elm.classList.add("dropzone_thumb");
  thumb_elm.dataset.label = file.name;
  // add svg icon as background image, with black stroke and 20px stroke-width
  thumb_elm.style.backgroundImage = `url(${svg_icon})`;
  thumb_elm.style.backgroundSize = "contain";
  thumb_elm.style.backgroundRepeat = "no-repeat";
  thumb_elm.style.backgroundPosition = "center";

  drop_elm.appendChild(thumb_elm);
}

const drops = [
  {
    type: "video",
    elm: document.getElementById("drop-video"),
  }, {
    type: "captions",
    elm: document.getElementById("drop-captions"),
  },
]

drops.forEach((drop) => {
  // console.log("input_elm", input_elm);
  

  drop.elm.addEventListener("change", _ => {
    input_elm = drop.elm.querySelector(".dropzone_input");
    if (input_elm.files.length) {
      updateThumbnail(drop.elm, input_elm.files[0]);
    }
  });
  
  drop.elm.addEventListener("dragover", e => {
    e.preventDefault();
    drop.elm.classList.add("dropzone_over");
  });
  
  ["dragleave", "dragend"].forEach(type => {
    drop.elm.addEventListener(type, _ => {
      drop.elm.classList.remove("dropzone_over");
    });
  });
  
  drop.elm.addEventListener("drop", e => {
    e.preventDefault();

    if (e.dataTransfer.files.length == 1) {
      // console.log("input_elm.files", input_elm.files);
      input_elm = drop.elm.querySelector(".dropzone_input");
      input_elm.files = e.dataTransfer.files;
      file = input_elm.files[0];
      file_icon = checkFileType(file, drop.type);
      if (file_icon) {
        updateThumbnail(drop.elm, file, file_icon);
      }
    } else {
      alert("Only one file is allowed.");
    }
    drop.elm.classList.remove("dropzone_over");
  });
});


