const svg = document.getElementById("svg");
const svgNS = "http://www.w3.org/2000/svg";

const points = [
    { x: 50, y: 200 },
    { x: 150, y: 120 },
    { x: 350, y: 100 },
    { x: 450, y: 200 },
];

updateCurve()

points.forEach((point, pointIndex) => {
    let pointElem = document.createElement("div");
    pointElem.className = "control-point";
    pointElem.style.left = `${point.x}px`;
    pointElem.style.top = `${point.y}px`;

    document.body.appendChild(pointElem);

    pointElem.addEventListener("mousedown", (e) => drag(pointElem, pointIndex));
});


const drag = (pointElem, pointIndex) => {
    const movePoint = (e) => {
        const svgPoint = svg.createSVGPoint();

        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;

        const { x, y } = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

        pointElem.style.left = x - 5 + "px";
        pointElem.style.top = y - 5 + "px";

        points[pointIndex].x = x;
        points[pointIndex].y = y;

        svg.querySelectorAll("path").forEach(p => p.remove())
        updateCurve();
    };

    const stopDrag = () => {
        window.removeEventListener("mousemove", movePoint);
        window.removeEventListener("mouseup", stopDrag);
    };

    window.addEventListener("mousemove", movePoint);
    window.addEventListener("mouseup", stopDrag);
};

try {
    drawCubicBezierCurve(p0, p1, p2, p3)
}
catch (e) { }


function updateCurve() {
    drawCubicBezierCurve(points[0], points[1], points[2], points[3])
}


function drawCubicBezierCurve(p0, p1, p2, p3) {
    var curvePoints = calculateBezierCurvePoints(p0, p1, p2, p3);
    var maxCurvePoints = 30;

    var subCurves = parseInt(curvePoints.length / maxCurvePoints);
    if (curvePoints.length % maxCurvePoints > 0)
        subCurves += 1;

    var startPoint;
    for (let i = 0; i < subCurves; i++) {
        startPoint = (i == 0) ? curvePoints[0] : curvePoints[(i * maxCurvePoints) - 1]

        var subCurvePoints = curvePoints.slice(i * maxCurvePoints, (i + 1) * maxCurvePoints);

        var path = document.createElementNS(svgNS, "path");
        path.setAttribute("stroke", "blue");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("d", "M " + startPoint + " " + startPoint + " C " + subCurvePoints.join(" "));

        svg.appendChild(path);
    }
}

function calculateBezierCurvePoints(p0, p1, p2, p3) {
    var points = [];

    for (var t = 0; t <= 1; t += 0.01) {
        var x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        var y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

        x = x.toFixed(5)
        y = y.toFixed(5)

        points.push(x + " " + y);
    }

    return points;
}