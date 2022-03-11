(() => {
    const dropZone = document.querySelector(".drop-zone");
    const fileInput = document.querySelector('#file');

    const browseBtn = document.querySelector('.browse-btn');
    const submitBtn = document.querySelector('#submitBtn');

    const progressBarBack = document.querySelector('.background-container');
    const progressRepo = document.querySelector('.percent');
    const smallProgress = document.querySelector('.small-bar');
    const progressContainer = document.querySelector('.progress-container');

    const fileUrl = document.querySelector('#fileURL');
    const sharingContainer = document.querySelector('.sharing-container');

    const copyURLBtn = document.getElementById('copyURLBtn');
    const toast = document.querySelector('.toast');

    const sendBtn = document.querySelector('.send-btn-container button');
    let uuid;

    function eventListeners(){
        fileInput.addEventListener('change',()=>{
            submitBtn.click();
        })
    
        submitBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            console.log('clicked');
            upload();
    
        })
        copyURLBtn.addEventListener('click',copyToClipboard);

        sendBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            if($('#fromEmail').val() && $('#toEmail').val()){
                sendMail();
            }
        });
    }

    function dropEvents() {
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (!dropZone.classList.contains("dragged"))
                dropZone.classList.add("dragged");
        });

        dropZone.addEventListener("dragleave", (e) => {
            if (dropZone.classList.contains("dragged"))
                dropZone.classList.remove("dragged");
        });

        dropZone.addEventListener("drop", (e) => {
            if (dropZone.classList.contains("dragged"))
                dropZone.classList.remove("dragged");
            e.preventDefault();
            let files = e.dataTransfer.files;
            if(files.length) {
                fileInput.files = files;
                submitBtn.click();
            }
        });
        
    }
    function fileInputWorks(){
        browseBtn.addEventListener('click',()=>{
            fileInput.click();
        });
    }


    const upload = ()=>{
        progressContainer.style.display='flex';
        let data = new FormData();
        data.append("file",$('#file')[0].files[0]);
        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                // Upload progress
                // xhr.upload.onprogress = uploadProgress;
                uploadProgress();
               return xhr;
            },
            type:'POST',
            url:'http://localhost:3000/files/upload',
            data: data,
            contentType:false,
            processData: false,
            success:function(data){
                data=JSON.parse(JSON.stringify(data));
                uuid=data.uuid;
                showLink(data.downloadLink);
                console.log(data.downloadLink);
            },
            error:function(err){
                console.log('Error with this ..',err);
            }

        })
    }
    function uploadProgress(e){
        let uploadProgressManual = [0,37,39,45,89,100];
        let count=500;
        uploadProgressManual.forEach(val=>{
            // let percent = Math.round((e.loaded/e.total)*100);
            setTimeout(()=>{
                percent = val;
                progressBarBack.style.width = `${percent}%`;
                smallProgress.style.width = `${percent}%`;
                progressRepo.innerText = percent;
                if(percent === 100) {
                    setTimeout(()=>{
                        progressContainer.style.display="none";
                        sharingContainer.style.display="block";
                        showToast('Download Link Ready');
                        reset();
                    },1000);
                }
            },count);
            count+=500;
        })
    }
    function showLink(link){
        console.log(link);
        fileUrl.value = link;
    }

    function copyToClipboard(){
        fileUrl.select();
        document.execCommand('copy');
    }

    let toastTimer;
    const showToast = (msg) => {
        clearTimeout(toastTimer);
        toast.innerText = msg;
        toast.classList.add("show");
        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        },  2000);
    };


    function sendMail(){
        
        $.ajax({
            type:'post',
            url:`http://localhost:3000/files/send-mail/${uuid}`,
            data:$('#emailForm').serialize(),
            success:function(data){
                console.log(data.message);
                showToast(data.message);
            },
            error:function(err){
                showToast(err);
                console.log('Errror', err);
            }
        })
    }
    function reset(){
        fileInput.value="";
        progressBarBack.style.width = `0%`;
        smallProgress.style.width = `0%`;
        progressRepo.innerText = 0;
    }

    function render(){
        eventListeners();
        dropEvents();
        fileInputWorks();
    }
    render();
})();
