//----------RECORD data------------//
class processingData {
    constructor() {
    };
    //Add
    addObject(newObject, saveArr) {
        //except point
        if (JSON.stringify(saveArr).indexOf(JSON.stringify(newObject)) === -1) {
            saveArr.push(newObject);
        } else {
            return "This object already exist"
        };
    };
    //----Create Object
    //Point
    createPoint(arrPointX, arrPointY) {
        let AllPointObj = [];
        for (let index = 0; index <= arrPointX.length - 1; index++) {
            let PointObj = new Point([arrPointX[index], arrPointY[index]]);
            AllPointObj.push(PointObj);
        };
        return AllPointObj;
    };
    //Line
    createLine(PointList, lineColor) {
        let AllLineObj = [];
        for (let index = 0; index <= PointList.length - 2; index++) {
            let Point1 = PointList[index];
            let Point2 = PointList[index + 1];
            let LineObj = new Line(Point1, Point2, lineColor);
            AllLineObj.push(LineObj);
        };
        //Save in allline
        // processingData.prototype.addObject(ObjLine,processingData.allLine);
        return AllLineObj;
    }

    inputRawData(Type, Arr1, Arr2, lineColor = PaintIn.currentColor) {
        switch (Type) {
            case "line":
                {
                    // if ((Math.abs(Arr1[0] - Arr1[Arr1.length - 1]) < 3) &&
                    //     (Math.abs(Arr2[0] - Arr2[Arr2.length - 1]) < 3) &&
                    //     (Arr1.length >= 3)) {
                    //     //First point === endpoint
                    //     Arr1[Arr1.length - 1] = Arr1[0];
                    //     Arr2[Arr1.length - 1] = Arr2[0];
                    //     // create Point
                    //     let AllPointObj = this.createPoint(Arr1, Arr2);
                    //     // create line
                    //     let AllLineObj = this.createLine(AllPointObj, lineColor);
                    //     // create area
                    //     let area = new Area(AllLineObj);
                    //     //save point
                    //     for (let Point of AllPointObj) {
                    //         processingData.prototype.addObject(Point, processingData.allPoint);
                    //     };
                    //     //save line
                    //     for (let Line of AllLineObj) {
                    //         processingData.prototype.addObject(Line, processingData.allLine);
                    //     };
                    //     //save area
                    //     processingData.prototype.addObject(area, processingData.allArea);
                    // } {
                    // create Point
                    let AllPointObj = this.createPoint(Arr1, Arr2);
                    // create line
                    let AllLineObj = this.createLine(AllPointObj, lineColor);
                    //save line
                    for (let line of AllLineObj) {
                        processingData.prototype.addObject(line, processingData.allLine);
                    };
                };
                this.updateStorage();
                break;
            case "rect":
                let Arr1_ = [Arr1[0], Arr1[1], Arr1[1], Arr1[0], Arr1[0]];
                let Arr2_ = [Arr2[0], Arr2[0], Arr2[1], Arr2[1], Arr2[0]];
                // create Point
                let AllPointObj = this.createPoint(Arr1_, Arr2_);
                // create line
                let AllLineObj = this.createLine(AllPointObj, lineColor);
                // //save area
                for (let line of AllLineObj) {
                    processingData.prototype.addObject(line, processingData.allLine);
                };
                // processingData.prototype.addObject(area, processingData.allArea);
                this.updateStorage();
                break;
        };
    }

    intersectionCheck(Line1, Line2) {
        var x1 = Line1.Point[0].x;
        var y1 = Line1.Point[0].y;
        var x2 = Line1.Point[1].x;
        var y2 = Line1.Point[1].y;

        var x3 = Line2.Point[0].x;
        var y3 = Line2.Point[0].y;
        var x4 = Line2.Point[1].x;
        var y4 = Line2.Point[1].y;

        var A = [[x2 - x1, -(x4 - x3)], [y2 - y1, -(y4 - y3)]];
        var B = [(x3 - x1), (y3 - y1)];
        try {
            var T = math.lusolve(A, B);
        } catch (err) {
            //singular matrix
            return {
                Coord: [Point1x, Point1y],
                Exist: false
            }
        };

        if ((T[0][0] <= 1 && T[0][0] >= 0) && (T[1][0] >= 0 && T[1][0] <= 1)) {
            var Point1x = x1 + (x2 - x1) * T[0][0];
            var Point1y = y1 + (y2 - y1) * T[0][0];
            return {
                Coord: [math.round(Point1x, 8), math.round(Point1y, 8)],
                Exist: true
            }
        } else {
            return {
                Coord: [Point1x, Point1y],
                Exist: false
            };
        }
    }

    areaDetect(Line_List) {
        PaintIn.onOffButton(PaintIn.currentValueDetectArea, "areaDetect");
        this.isCancled = false;

        let Line_List_copy = [...Line_List];
        processingData.allLine = [];
        processingData.allArea = [];

        let AreaResult = [];
        let PointFlowResult = [];

        let arrEndLineX = [];
        let arrEndLineY = [];
        let arrEndLineColor = [];
        for (let i = 0; i <= Line_List_copy.length - 1; i++) {
            let arrIntersPoint = [];
            let arrSubLineX = [];
            let arrSubLineY = [];
            let EndLine1X = [];
            let EndLine1Y = [];
            let EndLine2X = [];
            let EndLine2Y = [];
            for (let ii = 0; ii <= Line_List_copy.length - 1; ii++) {
                if (ii === i) {
                    continue;
                } else {
                    var IntersPoint = this.intersectionCheck(Line_List_copy[i], Line_List_copy[ii]);
                    if (IntersPoint.Exist && JSON.stringify(arrIntersPoint).indexOf(IntersPoint.Coord) === -1) {
                        arrIntersPoint.push(IntersPoint.Coord);
                        console.log("IntersPoint");
                    }
                }
            }
            if (arrIntersPoint.length === 0) continue;
            //sort by distance from endpoint
            let endPoint1 = Line_List_copy[i].Point[0].point;
            let endPoint2 = Line_List_copy[i].Point[1].point;
            arrIntersPoint.sort(function (value1, value2) {
                var distance1 = math.norm(math.subtract(value1, endPoint1));
                var distance2 = math.norm(math.subtract(value2, endPoint1));
                return distance1 - distance2
            })
            //create line bw inters point
            for (let index = 0; index <= arrIntersPoint.length - 1; index++) {
                //
                arrSubLineX.push(arrIntersPoint[index][0]);
                arrSubLineY.push(arrIntersPoint[index][1]);
                //
            }
            //keep end line
            if (JSON.stringify(endPoint1) !== JSON.stringify(arrIntersPoint[0])) {
                EndLine1X.push(endPoint1[0], arrIntersPoint[0][0]);
                EndLine1Y.push(endPoint1[1], arrIntersPoint[0][1]);
                arrEndLineX.push(EndLine1X);
                arrEndLineY.push(EndLine1Y);
                arrEndLineColor.push(Line_List_copy[i].color);
            }
            if (JSON.stringify(endPoint2) !== JSON.stringify(arrIntersPoint[arrIntersPoint.length - 1])) {
                EndLine2X.push(arrIntersPoint[arrIntersPoint.length - 1][0], endPoint2[0]);
                EndLine2Y.push(arrIntersPoint[arrIntersPoint.length - 1][1], endPoint2[1]);
                arrEndLineX.push(EndLine2X);
                arrEndLineY.push(EndLine2Y);
                arrEndLineColor.push(Line_List_copy[i].color);
            }
            //
            processingData.prototype.inputRawData("line", arrSubLineX, arrSubLineY, Line_List_copy[i].color);

        }
        // save end line
        for (let i = 0; i <= arrEndLineX.length - 1; i++) {
            processingData.prototype.inputRawData("line", arrEndLineX[i], arrEndLineY[i], arrEndLineColor[i]);
        };
        if (processingData.allLine.length === 0) {
            processingData.allLine = [...Line_List_copy];
            return;
        }
        //-----------------//
        let segmentLine = [...processingData.allLine];
        let exceptIndex = [];
        for (let index1 = 0; index1 <= segmentLine.length - 1; index1++) {
            if (exceptIndex.indexOf(index1) !== -1) {
                continue;
            }
            let arrLineFlow = [];
            let arrPointFlow = [];
            arrLineFlow.push(segmentLine[index1]);
            arrPointFlow.push(segmentLine[index1].Point[0].point);
            arrPointFlow.push(segmentLine[index1].Point[1].point);
            let orientation = "";
            while (true) {
                let arrNextLine = [];
                let arrNextPoint = [];
                let point1OfLine1 = arrLineFlow[arrLineFlow.length - 1].Point[0].point;
                let point2OfLine1 = arrLineFlow[arrLineFlow.length - 1].Point[1].point;
                for (let index2 = 0; index2 <= segmentLine.length - 1; index2++) {
                    if (index2 === index1) continue;
                    let point1OfNext = segmentLine[index2].Point[0].point;
                    let point2OfNext = segmentLine[index2].Point[1].point;

                    if (JSON.stringify(point2OfLine1) === JSON.stringify(point1OfNext) &&
                        JSON.stringify(point1OfLine1) !== JSON.stringify(point2OfNext)) {
                        arrNextPoint.push(point2OfNext);
                        arrNextLine.push(segmentLine[index2]);
                    } else if (JSON.stringify(point2OfLine1) === JSON.stringify(point2OfNext) &&
                        JSON.stringify(point1OfLine1) !== JSON.stringify(point1OfNext)) {
                        //swap
                        let swap = segmentLine[index2].Point[0];
                        segmentLine[index2].Point[0] = segmentLine[index2].Point[1];
                        segmentLine[index2].Point[1] = swap;

                        arrNextLine.push(segmentLine[index2]);
                        arrNextPoint.push(segmentLine[index2].Point[1].point);
                    }
                }
                if (arrNextLine.length === 0) break;
                arrNextLine.sort(function (a, b) {
                    let pointa = a.Point[1].point
                    let pointb = b.Point[1].point

                    let OA = math.subtract(point1OfLine1, point2OfLine1);
                    let OB = math.subtract(pointa, point2OfLine1);
                    let OC = math.subtract(pointb, point2OfLine1);

                    let degree1 = math.atan2(OA[1], OA[0]) - math.atan2(OB[1], OB[0]);
                    let degree2 = math.atan2(OA[1], OA[0]) - math.atan2(OC[1], OC[0]);

                    if (degree1 < 0) degree1 += 2 * math.PI;
                    if (degree2 < 0) degree2 += 2 * math.PI;
                    return degree2 - degree1
                });

                let AO = math.subtract(point2OfLine1, point1OfLine1);
                let OB = math.subtract(arrNextLine[0].Point[1].point, point2OfLine1);
                if (arrLineFlow.length === 1) {
                    //set orientation
                    if (math.round(math.cross([AO[0], AO[1], 0], [OB[0], OB[1], 0])[2], 3) >= 0) {
                        orientation = "CW";
                    } else orientation = "CCW"
                }
                if (orientation === "CW") {
                    arrLineFlow.push(arrNextLine[arrNextLine.length - 1]);
                    arrPointFlow.push(arrNextLine[arrNextLine.length - 1].Point[1].point);
                } else if (orientation === "CCW") {
                    arrLineFlow.push(arrNextLine[0]);
                    arrPointFlow.push(arrNextLine[0].Point[1].point);
                }
                if (JSON.stringify(arrPointFlow[arrPointFlow.length - 1]) === JSON.stringify(arrLineFlow[0].Point[0].point)) {
                    //get resutl;
                    console.log("getResult")
                    AreaResult.push(arrLineFlow);
                    PointFlowResult.push(arrPointFlow);
                    //delete 
                    for (let line of arrLineFlow) {
                        exceptIndex.push(segmentLine.indexOf(line));
                    }
                    break;
                }
            }
        }
        //create area object       
        for (let i = 0; i <= AreaResult.length - 1; i++) {
            let areaObj = new Area(AreaResult[i], PointFlowResult[i]);
            processingData.prototype.addObject(areaObj, processingData.allArea);
        }
        //
        this.updateStorage()
        PaintIn.renderObject(processingData.allObject);
        return AreaResult
    }
    setObjName(obj) {
    }

    InterPolationFunction(arrX, arrY) {
        let allFunc = [];
        let sizeMatrix = arrX.length;
        let A = math.zeros(sizeMatrix, sizeMatrix);
        let B = math.zeros(sizeMatrix, 1);
        //calc h
        let h = [];
        for (let i = 0; i <= arrX.length - 2; i++) {
            h.push(arrX[i + 1] - arrX[i]);
        }
        ////create A matrix
        A.subset(math.index(0, 0), 1);
        A.subset(math.index(sizeMatrix - 1, sizeMatrix - 1), 1);
        //start at row 1
        for (let row = 1; row <= sizeMatrix - 2; row++) {
            A.subset(math.index(row, row - 1), h[row - 1]);
            A.subset(math.index(row, row), 2 * (h[row - 1] + h[row]));
            A.subset(math.index(row, row + 1), h[row]);
        }
        ////create B matrix
        B.subset(math.index(0, 0), 0);
        B.subset(math.index(sizeMatrix - 1, 0), 0);
        for (let row = 1; row <= sizeMatrix - 2; row++) {
            B.subset(math.index(row, 0), 3 * ((arrY[row + 1] - arrY[row]) / h[row] - (arrY[row] - arrY[row - 1]) / h[row - 1]));
        };
        //solve C
        let c = math.lusolve(A, B); //is matrix
        //get all function 
        for (let i = 0; i <= arrX.length - 2; i++) {
            let a = arrY[i];
            let b = (arrY[i + 1] - arrY[i]) / h[i] - h[i] * (c.subset(math.index(i + 1, 0)) + 2 * c.subset(math.index(i, 0))) / 3;
            let d = (c.subset(math.index(i + 1, 0)) - c.subset(math.index(i, 0))) / (3 * h[i]);
            allFunc.push([a, b, c.subset(math.index(i, 0)), d])
        }
        //get all point in each range
        let arrXOutPut = [];
        let arrYOutPut = [];
        for (let i = 0; i <= allFunc.length - 1; i++) {
            //create range
            let xRange = math.range(arrX[i], arrX[i + 1], (arrX[i + 1] - arrX[i]) / 50);
            let yRange = [];
            for (let x of xRange._data) {
                let y = allFunc[i][0] + allFunc[i][1] * (x - arrX[i]) + allFunc[i][2] * ((x - arrX[i]) ** 2) +
                    allFunc[i][3] * ((x - arrX[i]) ** 3);
                yRange.push(y);
            }
            arrYOutPut.push(...yRange);
            arrXOutPut.push(...xRange._data);
        }
        //
        console.log(allFunc)
        return [arrXOutPut, arrYOutPut]
    }
    saveObj() {
        let data = JSON.stringify(processingData.allObject);
        var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "data.txt");
    }
    updateStorage() {
        processingData.allPoint = [];
        processingData.allObject = [];
        for (let area of processingData.allArea) {
            processingData.allObject.push(area);
            for (let line of area.Line) {
                this.addObject(line, processingData.allLine);
            }
        }
        for (let line of processingData.allLine) {
            processingData.allObject.push(line);
            for (let point of line.Point) {
                this.addObject(point, processingData.allPoint);
            }
        }
        for (let point of processingData.allPoint) {
            processingData.allObject.push(point)
        }
        //sort [Area, Line, Point]
        processingData.allObject.sort((a, b) => {
            let a_ = 0;
            let b_ = 0;
            switch (a.className) {
                case "Point":
                    a_ = 3;
                    break;
                case "Line":
                    a_ = 2;
                    break;
                case "Area":
                    a_ = 1;
                    break;
            }
            switch (b.className) {
                case "Point":
                    b_ = 3;
                    break;
                case "Line":
                    b_ = 2;
                    break;
                case "Area":
                    b_ = 1;
                    break;
            }
            return b_ - a_
        })
    }
    createData(inputData) {
        //delete old data
        PaintIn.clearAll();

        for (let i = 0; i <= inputData.length - 1; i++) {
            if (inputData[i].className === "Line") {
                let point1 = inputData[i].Point[0];
                let point2 = inputData[i].Point[1];
                let allPointObj = this.createPoint([point1.x, point2.x], [point1.y, point2.y]);
                let lineObj = this.createLine(allPointObj, inputData[i].lineColor);
                this.addObject(lineObj[0], processingData.allLine);
            } else if (inputData[i].className === "Area") {
                let allLineObj = [];
                for (let line of inputData[i].Line) {
                    let point1 = line.Point[0];
                    let point2 = line.Point[1];
                    let allPointObj = this.createPoint([point1.x, point2.x], [point1.y, point2.y]);
                    let lineObj = this.createLine(allPointObj);
                    allLineObj.push(lineObj[0]);
                }
                let areaObj = new Area(allLineObj, inputData[i].PointFlow);
                this.addObject(areaObj, processingData.allArea)
            }
        }
        //update storage
        this.updateStorage()
        //update screen
        PaintIn.renderObject(processingData.allObject);
    }
};
// Point class
class Point {
    constructor(Arr) {
        this.point = Arr;
        this.x = Arr[0];
        this.y = Arr[1];
        this.className = "Point";
    };
    //Method
    isInPoint(mouse) {
        return (((mouse[0] - this.x) ** 2 + (mouse[1] - this.y) ** 2) < 3 ** 2) ? true : false
    }
};

// Line class
class Line {
    constructor(Point1, Point2, lineColor, name) {
        this.Point = [Point1, Point2];
        //
        this.length = math.norm(math.subtract(Point1.point, Point2.point))
        this.color = lineColor;
        this.className = "Line";
        this.name = name;
    }
    //Method
    isInLine(Mouse) {
        let A_to_mouse = math.norm(math.subtract(this.Point[0].point, Mouse));
        let mouse_to_B = math.norm(math.subtract(Mouse, this.Point[1].point));
        return (A_to_mouse + mouse_to_B - this.length <= 0.1) ? true : false
    };

};
//Area
class Area {
    constructor(LineList, pointFlow) {
        this.Line = LineList;
        this.PointFlow = pointFlow;
        //perimeter
        this.Perimeter = 0;
        for (let Line of LineList) {
            this.Perimeter += Line.length;
        };
        //area 
        let S = 0;
        for (let i = 0; i <= LineList.length - 1; i++) {
            let Point1 = LineList[i].Point[0].point;
            let Point2 = LineList[i].Point[1].point;
            //
            if (i === LineList.length - 1) {
                if (JSON.stringify(LineList[0].Point).indexOf(JSON.stringify(Point1)) !== -1) {
                    let swap = Point1;
                    Point1 = Point2;
                    Point2 = swap;
                };
            } else {
                if (JSON.stringify(LineList[i + 1].Point).indexOf(JSON.stringify(Point1)) !== -1) {
                    let swap = Point1;
                    Point1 = Point2;
                    Point2 = swap;
                };
            };
            S += 1 / 2 * (Point1[0] * Point2[1] - Point1[1] * Point2[0]);
        };
        this.Area = math.abs(S);
        //center
        let arrX = [];
        let arrY = [];
        for (let Line of LineList) {
            arrX.push(Line.Point[0].x);
            arrY.push(Line.Point[0].y);
        };
        let CenterX = math.sum(arrX) / arrX.length;
        let CenterY = math.sum(arrY) / arrY.length;
        this.Center = [CenterX, CenterY];
        //class Name
        this.className = "Area";
    };
    isInArea([xMouse, yMouse]) {
        let count = 0;
        for (let Line of this.Line) {
            let x1 = Line.Point[0].x;
            let y1 = Line.Point[0].y;
            let x2 = Line.Point[1].x;
            let y2 = Line.Point[1].y;
            if (
                yMouse < y1 != yMouse < y2 &&
                xMouse < (x2 - x1) * (yMouse - y1) / (y2 - y1) + x1
            ) {
                count += 1;
            };
        };
        return count % 2 === 0 ? false : true
    };
};
processingData.allObject = [];
processingData.allLine = [];
processingData.allPoint = [];
processingData.allArea = [];
processingData.allAreaCenter = [];
//----------------------------//

function getNearest(listPoints, currentPoint) {
    var distance = function (a, b) {
        return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    }
    var tree = new kdTree(listPoints, distance, ["x", "y"]);
    return nearest = tree.nearest(currentPoint, 1);
};

var input;

function inputData(x, y, obj) {
    if (PaintIn.currentValue.value === "On") {
        input = new CanvasInput({
            canvas: document.getElementById('myCanvas'),
            x: x,
            y: y,
            fontSize: 18,
            fontFamily: 'Arial',
            fontColor: '#212121',
            fontWeight: 'bold',
            width: 25,
            height: 25,
            padding: 0,
            borderColor: '#000',
            borderRadius: 3,

            onsubmit: function () {
                PaintIn.drawText(obj, this.value());
                obj.name = this.value();
            },
        });
    }
};






