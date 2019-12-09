$(document).ready(function() {

    $('#scrape').on("click", loadScrapedResultsIntoDB);
    $('.save').on("click", saveArticle);
    $('.commentBtn').on("click", shownote);
    $('#add-note').on("click", addnote);
    $("#close-note").on("click", () => {
        $("#addnote").fadeOut(300);
    });


    function loadScrapedResultsIntoDB() {
        $.get("/scraped", () => {
            console.log("this is scraped");
        }).done(() => {
            window.location.reload();
        });
    };

    function shownote(event) {
        const id = $(this).attr("value");
        $("#addnote").fadeIn(300).css("display", "flex");
        $("#add-note").attr("value", id);

        $.get("/" + id, function(data) {
            $("#headline").text(data.headline);

            $.get("/note/" + id, (data) => {

                console.log(data + 'Showing note');

                if (data) {
                    $("#note-title").val(data.title);
                    $("#note-body").val(data.body);
                } else {
                    console.log('showing note not working')
                }
            });

        });

    }

    function addnote() {
        const id = $(this).attr("value");
        const obj = {
            title: $("#note-title").val().trim(),
            body: $("#note-body").val().trim()
        };
        $.post("/note/" + id, obj, (data) => {
            console.log("made it");
            window.location.href = "/";
        });
    }

    function saveArticle() {
        const id= $(this).attr("value");
        const saved = ($(this).data("saved"));

        $.post(`/saved/${id}`, (data) => {
            console.log("saved");

            if (saved === false) {
                window.location.href = "/saved"; 
           } else {
                window.location.href = "/";
           }
        });
    }

});