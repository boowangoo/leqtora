const video_prev_elm = document.querySelector(".video-preview");
const video_img_elm = video_prev_elm.querySelector(".video-preview-img");
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

function fetchVideoPreview(slider_val, slider_max) {
    fetch(`/video_preview/?slider=${slider_val}&max=${slider_max}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const frame_id = data.frame.padStart(9, "0");
            video_img_elm.src = `/handle_preview_img/${data.user_id}/${frame_id}/`;
            const times = timeFormat(data.frame, data.frame_cnt, data.fps);
            label_elm.innerHTML = `
                ${times.curr} / ${times.max}
                <br>
                (${data.frame} / ${data.frame_cnt})
            `;
        });
}
fetchVideoPreview(slider_elm.value, slider_max);

slider_elm.addEventListener("input", () => {
    sliderDebounce(250, () => {
        fetchVideoPreview(slider_elm.value, slider_max);
    });
});

