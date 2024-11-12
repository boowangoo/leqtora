const video_prev_elm = document.querySelector(".video-preview");
const video_canvas_elm = video_prev_elm.querySelector(".video-preview-canvas");
const video_canvas_ctx = video_canvas_elm.getContext("2d");
const video_prev_ctrl_elm = video_prev_elm.querySelector(".video-preview-control");
const label_elm = video_prev_ctrl_elm.querySelector("label");
const slider_elm = video_prev_ctrl_elm.querySelector(".video-slider");
const slider_max = slider_elm.getAttribute("max");

let debounce_timer;
function sliderDebounce(delay_ms, evt_listener) {
    clearTimeout(debounce_timer);
    debounce_timer = setTimeout(() => {
        evt_listener();
    }, delay_ms);
}

function timeFormat(frame, frame_cnt, fps) {
    const tot_sec_curr = Math.round(frame / fps);
    const tot_sec_max = Math.round(frame_cnt / fps);

    const sec_curr = (tot_sec_curr % 60).toString().padStart(2, "0");
    const min_curr = (Math.floor(tot_sec_curr / 60) % 60).toString().padStart(2, "0");
    const hr_curr = Math.floor(tot_sec_curr / 3600).toString().padStart(2, "0");

    const sec_max = (tot_sec_max % 60).toString().padStart(2, "0");
    const min_max = (Math.floor(tot_sec_max / 60) % 60).toString().padStart(2, "0");
    const hr_max = Math.floor(tot_sec_curr / 3600).toString().padStart(2, "0");

    return {
        curr: `${hr_curr}:${min_curr}:${sec_curr}`,
        max: `${hr_max}:${min_max}:${sec_max}`
    };
}

let curr_frame_src = undefined;
function reloadFrame() {
    const img = new Image();
    img.src = curr_frame_src;
    img.onload = () => {
        video_canvas_elm.width = img.naturalWidth;
        video_canvas_elm.height = img.naturalHeight;
        video_canvas_ctx.drawImage(img, 0, 0);
        cropAll(video_canvas_ctx);
    };
}


let frame_cnt = undefined;
let fps = undefined;
const video_dim = {
    width: undefined,
    height: undefined,
};
async function fetchVideoPreview(frame) {
    const info_flg = (!frame_cnt) ? "1" : "0";
    await fetch(`/video_preview/?frame=${frame}&info=${info_flg}`)
        .then(response => response.json())
        .then(data => {
            if (info_flg === "1") {
                frame_cnt = data.frame_cnt;
                fps = data.fps;
                video_dim.width = data.width;
                video_dim.height = data.height;
            } else {
                curr_frame_src = `/handle_preview_img/${data.user_id}/${data.frame_id}/`;
                reloadFrame();
            }
        });
}

async function renderSliderLabel() {
    const slider_val = Number(slider_elm.value);
    if (!frame_cnt) {
        await fetchVideoPreview(0);
    }
    const frame = Math.floor(frame_cnt * (slider_val / 512));
    const times = timeFormat(frame, frame_cnt, fps);
    label_elm.innerHTML = `
        ${times.curr} / ${times.max}
        (${frame} / ${frame_cnt} frames)
    `;
    return frame;
}

slider_elm.addEventListener("input", () => {
    renderSliderLabel().then(frame => {
        sliderDebounce(250, () => {
            fetchVideoPreview(frame);
        });
    });
});
slider_elm.dispatchEvent(new Event("input"));