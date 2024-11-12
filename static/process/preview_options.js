const crop_dirs = ["top", "bottom", "left", "right"];
const crop_elms = crop_dirs.map(dir => document.querySelector(".video-crop-" + dir));

console.log(crop_elms);

function cropVideo(slider_ratio, dir) {
    console.log(`cropVideo(${slider_ratio}, ${dir})`);
    const canvas_width = video_canvas_elm.width;
    const canvas_height = video_canvas_elm.height;
    console.log(`canvas_width: ${canvas_width}, canvas_height: ${canvas_height}`);

    const crop_width = (dir === "left" || dir === "right") ? Math.round(canvas_width * slider_ratio) : canvas_width;
    const crop_height = (dir === "top" || dir === "bottom") ? Math.round(canvas_height * slider_ratio) : canvas_height;
    console.log(`crop_width: ${crop_width}, crop_height: ${crop_height}`);
    
    const crop_x = (dir === "right") ? canvas_width - crop_width : 0;
    const crop_y = (dir === "bottom") ? canvas_height - crop_height : 0;

    // make black on the canvas context, based on the slider ratio and direction (top, bottom, left, right)
    video_canvas_ctx.fillStyle = "black";
    video_canvas_ctx.fillRect(crop_x, crop_y, crop_width, crop_height);
}

function cropAll() {
    crop_elms.forEach((elm, i) => {
        const slider_ratio = Number(elm.value) / Number(elm.max);
        cropVideo(slider_ratio, crop_dirs[i]);
    });
}

crop_elms.forEach((elm, i) => {
    elm.addEventListener("input", () => {
        reloadFrame();
    });
});