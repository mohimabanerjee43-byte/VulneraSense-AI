async function loadComponents() {

    const root = document.getElementById("app");

    const page =
        document.body.dataset.page || "dashboard";

    const isRoot =
        location.pathname.endsWith("/") ||
        location.pathname.endsWith("index.html");

    const prefix = isRoot ? "" : "../";


    const html = `

    <div class="app-shell">

        <aside class="sidebar">

            <div class="brand">

                <div class="logo">
                    V
                </div>

                <div>

                    <b>VulneraSense</b>

                    <small>
                        AI Support Prototype
                    </small>

                </div>

            </div>


            <nav class="nav">

                <a href="${prefix}index.html">
                    ⌂ Dashboard
                </a>

                <a href="${prefix}pages/assessment.html">
                    ◉ Assessment
                </a>

                <a href="${prefix}pages/results.html">
                    ◈ Results
                </a>

                <a href="${prefix}pages/recommendations.html">
                    ✦ Recommendations
                </a>

                <a href="${prefix}pages/resources.html">
                    ▣ Resources
                </a>

            </nav>


            <div class="safety-box">

                <strong>
                    ✓ Prototype safety mode
                </strong>

                <p>
                    Not a diagnosis.
                    High-risk outputs require
                    trained human review.
                </p>

            </div>

        </aside>


        <main class="main">

            <header class="topbar">

                <div>

                    <p class="eyebrow">
                        AI-ASSISTED VULNERABILITY SCREENING
                    </p>

                    <h1 id="pageTitle">
                        Support Assessment Dashboard
                    </h1>

                </div>


                <div class="status">

                    <span></span>

                    Prototype Online

                </div>

            </header>


            <div id="pageContent"></div>


            <footer>

                VulneraSense AI Prototype ·
                Educational / Hackathon Demonstration ·
                Not a medical or legal diagnostic system

            </footer>

        </main>

    </div>

    `;


    root.innerHTML = html;


    const titles = {

        dashboard:
            "Support Assessment Dashboard",

        assessment:
            "AI Vulnerability Assessment",

        results:
            "Assessment Results",

        recommendations:
            "Recommended Support Path",

        resources:
            "Support Resources"
    };


    document.getElementById("pageTitle")
        .textContent =
        titles[page];


    document
        .querySelectorAll(".nav a")
        .forEach(a => {

            if (a.href === location.href) {

                a.classList.add("active");

            }

        });

}


document.addEventListener(
    "DOMContentLoaded",
    loadComponents
);