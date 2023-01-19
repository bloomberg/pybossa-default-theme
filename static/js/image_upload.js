// onImageUpload callback

const TaskPresenterImageUploader = {
    MAX_FILE_SIZE_MB: 5,
    uploadImages: (files, short_name, summernote) => {
        let fd = new FormData();
        Array.from(files).forEach(file => {
            if (file.size / 1024 / 1024 < TaskPresenterImageUploader.MAX_FILE_SIZE_MB) {
                fd.append("image", file);
            }
            else {
                alert("Images must be less than " + TaskPresenterImageUploader.MAX_FILE_SIZE_MB + " MB.")
            }
        });

        $.ajax({
            type: 'POST',
            url: '/project/' + short_name + "/tasks/taskpresenterimageupload",
            data: fd,
            processData: false,
            contentType: false,
        }).done(response => {
            response.imgurls.forEach(imgurl => {
                let image = $('<img>').attr('src', imgurl).on('load', () => {
                    image.css('width', Math.min(summernote.width(), image.width()))
                });
                summernote.summernote("insertNode", image[0]);
            })
        }).fail(response => {
            console.error("upload image failed. response:", response)
        })
    }
}
