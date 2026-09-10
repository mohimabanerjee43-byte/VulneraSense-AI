function drawRiskChart(score) {

    const canvas =
        document.getElementById(
            "riskChart"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.clientWidth;


    const height =
        220;


    canvas.width =
        width * 2;


    canvas.height =
        height * 2;


    ctx.scale(2, 2);


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    ctx.strokeStyle =
        "#dfe5ee";


    ctx.lineWidth = 1;


    [40, 80, 120, 160, 200]
        .forEach(y => {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                width,
                y
            );

            ctx.stroke();

        });


    ctx.fillStyle =
        "#5370b5";


    ctx.fillRect(

        25,

        200 - score * 1.5,

        70,

        score * 1.5

    );


    ctx.fillStyle =
        "#6f7d98";


    ctx.font =
        "10px Arial";


    ctx.fillText(
        "SVI",
        48,
        215
    );


    ctx.fillText(
        score + "/100",
        35,
        Math.max(
            15,
            190 - score * 1.5
        )
    );

}