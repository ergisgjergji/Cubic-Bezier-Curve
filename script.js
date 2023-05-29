const svg = document.getElementById("svg");
const svgNS = "http://www.w3.org/2000/svg";

// Size of point in pixels
const pointSize = getComputedStyle(document.documentElement).getPropertyValue('--point-size');
const pointRadius = pointSize / 2;
const controlPoints = [
    { x: 50, y: 200 },
    { x: 120, y: 120 },
    { x: 240, y: 100 },
    { x: 300, y: 200 },
];

controlPoints.forEach((point, pointIndex) => {
    let pointElem = document.createElement("div");
    pointElem.className = "control-point";
    pointElem.style.left = `${point.x - pointRadius}px`;
    pointElem.style.top = `${point.y - pointRadius}px`;

    document.body.appendChild(pointElem);

    pointElem.addEventListener("mousedown", (e) => drag(pointElem, pointIndex));
    pointElem.addEventListener("touchstart", (e) => drag(pointElem, pointIndex));
});


const drag = (pointElem, pointIndex) => {
    const movePoint_Desktop = (e) => {
        let x = e.clientX;
        let y = e.clientY;

        pointElem.style.left = x + "px";
        pointElem.style.top = y + "px";

        // Interpolate to the center of the point, thus add pointRadius in calculation
        controlPoints[pointIndex].x = x + pointRadius;
        controlPoints[pointIndex].y = y + pointRadius;

        svg.querySelectorAll("path").forEach(p => p.remove())
        drawCubicBezierCurve(controlPoints);
    };

    const movePoint_Mobile = (e) => {
        let touch = e.touches[0]
        let x = touch.clientX;
        let y = touch.clientY;

        pointElem.style.left = x + "px";
        pointElem.style.top = y + "px";

        // Interpolate to the center of the point, thus add pointRadius in calculation
        controlPoints[pointIndex].x = x + pointRadius;
        controlPoints[pointIndex].y = y + pointRadius;

        svg.querySelectorAll("path").forEach(p => p.remove())
        drawCubicBezierCurve(controlPoints);
    };

    const stopDrag = () => {
        window.removeEventListener("mousemove", movePoint_Desktop);
        window.removeEventListener("touchmove", movePoint_Mobile);

        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchend", stopDrag);
    };

    window.addEventListener("mousemove", movePoint_Desktop);
    window.addEventListener("touchmove", movePoint_Mobile);

    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
};


function drawCubicBezierCurve([p0, p1, p2, p3]) {
    var curvePoints = calculateBezierCurvePoints([p0, p1, p2, p3]);
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

drawCubicBezierCurve(controlPoints)