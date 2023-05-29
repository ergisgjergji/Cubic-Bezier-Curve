function calculateBezierCurvePoints([p0, p1, p2, p3]) {
    let curvePoints = [];

    for (var t = 0; t <= 1; t += 0.001) {
        var x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        var y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

        x = x.toFixed(7)
        y = y.toFixed(7)

        curvePoints.push(x + " " + y);
    }

    return curvePoints;
}