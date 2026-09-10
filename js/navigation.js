function goTo(page) {

    const root =
        location.pathname.endsWith("/") ||
        location.pathname.endsWith("index.html")
            ? ""
            : "../";


    const map = {

        dashboard:
            root + "index.html",

        assessment:
            root + "pages/assessment.html",

        results:
            root + "pages/results.html",

        recommendations:
            root + "pages/recommendations.html",

        resources:
            root + "pages/resources.html"

    };


    location.href = map[page];
}


document.addEventListener(
    "click",
    function (event) {

        const target =
            event.target.closest("[data-go]");

        if (!target) return;

        goTo(target.dataset.go);

    }
);