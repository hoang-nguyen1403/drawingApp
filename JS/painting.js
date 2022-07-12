class Paint {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.toolbar = document.getElementById("tool_left");
        this.currentValueGrid = document.getElementById('grid');

        this.currentValueBrush = document.getElementById('brush');
        this.currentValueLine = document.getElementById('line');
        this.currentValueCircle = document.getElementById('circle');
        this.currentValueRect = document.getElementById('rect');
        this.currentValueSpl = document.getElementById('spl');
        this.currentValueSelect = document.getElementById('select');
        this.currentValueDetectArea = document.getElementById('areaDetect');

        this.curValNamePoint = document.getElementById('valueNamePoint');
        this.curValNameLine = document.getElementById('valueNameLine');
        this.curValNameArea = document.getElementById('valueNameArea');

        this.curValPointLoad = document.getElementById('pointLoad');
        this.curValPressLoad = document.getElementById('pressLoad');
        this.curValLucDoc = document.getElementById('lucDoc');

        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = document.getElementById("drawing_page").clientWidth;
        this.canvas.height = document.getElementById("drawing_page").clientHeight;

        //attLine
        this.currentColor = 'black';
        this.currentWidth = 5;
        this.deltaGrid = 40;
        this.pen = '';

        this.minGrid = 5;
        this.maxGrid = 100;

        this.currentPos = {
            x: 0,
            y: 0
        }; //now position
        this.isCancled = false;
        this.currentMouseDownPos = {
            x: 0,
            y: 0
        };

        this.currentMouseMovePos = {
            x: 0,
            y: 0
        };

        this.isPainting = false;
        this.listenEvent();

        this.image = null; //can go back 
        this.choiceEvent();
        this.mouseDownPos = {
            x: 0,
            y: 0
        };
        this.arrMouseDownPosition = [];
        this.arrLineColor = [];
        this.arrLineWidth = [];
        this.arrLineX = [];
        this.arrLineY = [];
        this.arrCircleX = [];
        this.arrCircleY = [];
        this.arrRectX = [];
        this.arrRectY = [];
        this.arrGrid = [];
        this.arr = [];
        this.arrMove = []; // mouseMovePos
        this.arrSPL = [];
        this.arrSPLX = [];
        this.arrSPLY = [];

        this.getNodePos();
        this.arrRecordNode = [];

        this.drawBackground();
        //----//
        this.arrCurObj = [];
        this.arrMultiCurObj = [];
        //addValue
        this.arrCurValueObj = [];
        // this.hasInput = false;
        this.curPoint = [];
    }

    undo() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    onOffButtonDraw(currentActive, nameID) {
        if (currentActive.value === "Off") {
            currentActive.value = "On";
            this.pen = nameID;
            document.getElementById(nameID).classList.add("active");
        }
        else {
            currentActive.value = "Off";
            this.pen = '';
            document.getElementById(nameID).classList.remove("active");
        }
    }

    offButtonDraw(currentActive, nameID) {
        if (currentActive.value === "On") {
            currentActive.value = "Off";
            this.pen = '';
            document.getElementById(nameID).classList.remove("active");
        }
    }

    onOffButton(currentActive, nameID) {
        if (currentActive.value === "Off") {
            currentActive.value = "On";
            document.getElementById(nameID).classList.add("active");
        }
        else {
            currentActive.value = "Off";
            document.getElementById(nameID).classList.remove("active");
        }
    }

    offButton(currentActive, nameID) {
        if (currentActive.value === "On") {
            currentActive.value = "Off";
            document.getElementById(nameID).classList.remove("active");
        }
    }

    keyDown(event) {
        //SPACE
        if (event.keyCode === 32) {
            //reset data
            this.arrLineX = [];
            this.arrLineY = [];
            //
            this.isCancled = false;
            if (this.pen === 'line') {
                this.undo();
            };
            if (this.currentValueDetectArea.value === "On") {
                try {
                    processingData.prototype.areaDetect(processingData.allLine);
                    console.log("detect")
                }
                catch (error) {
                    //save obj
                    this.renderObject(processingData.allObject);
                    console.log("error")
                }

            };
        }
        //ESC
        if (event.keyCode === 27) {
            this.isCancled = false;
            this.offButtonDraw(this.currentValueBrush, "brush");
            this.offButtonDraw(this.currentValueLine, "line");
            this.offButtonDraw(this.currentValueRect, "rect");
            this.offButtonDraw(this.currentValueCircle, "circle");
            this.offButtonDraw(this.currentValueSpl, "spl");
            // this.offButtonDraw(this.currentValueBrush, "valueName");
            if (this.currentValueSelect.value === "On") {
                this.pen = "select";
            }
            else {
                this.pen = '';
            }
            this.arr = [];
            this.arrLineX = [];
            this.arrLineY = [];
            this.arrCircleX = [];
            this.arrCircleY = [];
            this.arrRectX = [];
            this.arrRectY = [];
            this.arrMouseDownPosition = [];
            this.arrSPL = [];

            //destroy box input

            if (this.curValNamePoint.value === "On" || this.curValNameLine.value === "On" || this.curValNameArea.value === "On") {
                try {
                    inputID.destroy();
                    this.arrCurObj = [];
                    inputID = undefined;
                }
                catch (error) {
                    this.renderObject(processingData.allObject);
                }
            }

            if (this.curValPointLoad.value === "On" || this.curValPressLoad.value === "On" || this.curValLucDoc.value === "On") {
                try {
                    inputLoad.destroy();
                    this.arrCurObj = [];
                    inputLoad = undefined;
                }
                catch (error) {
                    this.renderObject(processingData.allObject);
                }
            }

            if (this.currentValueDetectArea.value === "On") {
                try {
                    processingData.prototype.areaDetect(processingData.allLine);
                    console.log("detect")
                }
                catch (error) {
                    //save obj
                    this.renderObject(processingData.allObject);
                    console.log("error")
                }

            };
            this.renderProperty("off", "");
            this.renderObject(processingData.allObject);
        }

        //KEYUP
        if (event.keyCode === 38) {
            if (this.currentValueGrid.value == "On" && this.deltaGrid <= this.maxGrid) {
                this.deltaGrid += this.deltaGrid / 2;

                // function update object saved
                //redraw object
                this.renderObject(processingData.allLine);

                this.arrGrid = [];
                // this.addNode();
                this.getNodePos();
                // console.log(this.arrGrid.length)
                // console.log(this.arrRecordNode.length)
                this.arrRecordNode = this.removeDuplicates(this.arrRecordNode);
                // console.log(this.arrRecordNode.length)
                this.arrGrid = this.concatArr(this.arrGrid, this.arrRecordNode);
                // console.log(this.arrGrid.length)

                this.ctx.strokeStyle = 'grey';
                this.drawGrid();

            }
        }
        //KEYDOWN
        if (event.keyCode === 40) {
            if (this.currentValueGrid.value == "On" && this.deltaGrid >= this.minGrid * 2) {
                this.deltaGrid -= this.deltaGrid / 2;

                // function update object saved
                //redraw object
                this.renderObject(processingData.allLine);

                this.arrGrid = [];
                // this.addNode();
                this.getNodePos();
                // console.log(this.arrGrid.length)
                // console.log(this.arrRecordNode.length)
                this.arrRecordNode = this.removeDuplicates(this.arrRecordNode);
                this.arrGrid = this.concatArr(this.arrGrid, this.arrRecordNode);
                // console.log(this.arrGrid.length)

                this.ctx.strokeStyle = 'grey';
                this.drawGrid();
            }
        }

        //DELETE
        if (event.keyCode === 46) {
            this.deleteCurObj();
        }
        //ENTER
        // if (event.keyCode === 13 && (this.curValNamePoint.value === "On" || this.curValNameLine.value === "On" || this.curValNameArea.value === "On")) {
        //     // try {
        //     //     inputID.destroy();
        //     // }
        //     // catch {
        //     //     this.renderObject(processingData.allObject);
        //     // }
        //     // inputID = undefined;
        //     // this.renderObject(processingData.allObject);

        //     if (selectedObj === undefined) {
        //         this.renderProperty("off", selectedObj);
        //         this.arrCurObj = [];
        //         return;
        //     }
        //     this.renderObject(processingData.allObject);
        // }
    }

    concatArr(arr1, arr2) {
        return arr1.concat(arr2);
    }

    chooseBrush() {
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueSelect, "select");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueCircle, "circle");
        this.offButtonDraw(this.currentValueRect, "rect");

        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValPressLoad, "pressLoad");
        this.offButton(this.curValLucDoc, "lucDoc");
        this.onOffButtonDraw(this.currentValueBrush, "brush");
    }

    chooseLine() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSelect, "select");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueCircle, "circle");
        this.offButtonDraw(this.currentValueRect, "rect");

        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValPressLoad, "pressLoad");
        this.offButton(this.curValLucDoc, "lucDoc");
        this.onOffButtonDraw(this.currentValueLine, "line");
    }

    chooseCircle() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSelect, "select");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueRect, "rect");

        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValPressLoad, "pressLoad");
        this.offButton(this.curValLucDoc, "lucDoc");

        this.onOffButtonDraw(this.currentValueCircle, "circle");
    }

    chooseRect() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSelect, "select");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueCircle, "circle");

        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValPressLoad, "pressLoad");
        this.offButton(this.curValLucDoc, "lucDoc");

        this.onOffButtonDraw(this.currentValueRect, "rect");
    }

    chooseSpl() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSelect, "select");
        this.offButtonDraw(this.currentValueRect, "rect");
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueCircle, "circle");

        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValPressLoad, "pressLoad");
        this.offButton(this.curValLucDoc, "lucDoc");
        this.onOffButtonDraw(this.currentValueSpl, "spl");
    }
    chooseSelect() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueRect, "rect");
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueCircle, "circle");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValPressLoad, "pressLoad");
        this.offButton(this.curValLucDoc, "lucDoc");

        this.onOffButtonDraw(this.currentValueSelect, "select");

        if (this.currentValueSelect.value == "Off") {
            this.offButton(this.curValNamePoint, "valueNamePoint");
            this.offButton(this.curValNameLine, "valueNameLine");
            this.offButton(this.curValNameArea, "valueNameArea");

        }
    }
    clearAll() {
        this.isCancled = false;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // vo hieu hoa this.undo()
        // this.pen = '';
        this.arrMouseDownPosition = [];
        this.arr = [];
        this.arrLineX = [];
        this.arrLineY = [];
        this.arrCircleX = [];
        this.arrCircleY = [];
        this.arrRectX = [];
        this.arrRectY = [];
        this.arrLineColor = [];
        this.arrLineWidth = [];

        if (this.currentValueGrid.value == "On") {
            this.ctx.strokeStyle = 'grey';
            this.drawGrid();
        }
        //---// clear saved data
        processingData.allLine = [];
        processingData.allPoint = [];
        processingData.allArea = [];
        processingData.allObject = [];
    }

    choiceEvent() {
        this.toolbar.addEventListener('change', e => {
            if (e.target.id === 'line_color') {
                this.currentColor = e.target.value;
            }

            if (e.target.id === 'line_size') {
                this.currentWidth = e.target.value;
            }
            if (e.target.id === 'sizeGrid') {
                if (this.currentValueGrid.value == "On") {
                    this.deltaGrid = e.target.value;
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    // function update object saved
                    //redraw object
                    this.renderObject(processingData.allLine);

                    this.ctx.strokeStyle = 'grey';
                    this.drawGrid();
                }
                // console.log(this.currentValueGrid.value)
            }
        });
    }

    buttonGrid() {
        this.arrGrid = [];
        this.getNodePos();

        this.arrGrid = this.concatArr(this.arrGrid, this.arrRecordNode);
        // console.log(this.arrGrid.length)

        if (this.currentValueGrid.value == "Off") {
            this.currentValueGrid.value = "On";
            this.ctx.strokeStyle = 'grey';
            this.drawGrid();
        } else {
            this.currentValueGrid.value = "Off";
            // this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        // console.log(this.currentValueGrid.value)
        this.renderObject(processingData.allObject);
    }

    buttonDetectArea() {
        if (this.currentValueDetectArea.value === "Off") {
            this.currentValueDetectArea.value = "On";
            document.getElementById("areaDetect").classList.add("active");
            processingData.prototype.areaDetect(processingData.allLine);
        }
        else {
            this.currentValueDetectArea.value = "Off";
            document.getElementById("areaDetect").classList.remove("active");
        };
    }

    addPointLoad() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueRect, "rect");
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueCircle, "circle");
        this.offButton(this.currentValueSelect, "select")
        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPressLoad, "pressLoad");

        this.onOffButton(this.curValPointLoad, "pointLoad");

        this.renderObject(processingData.allObject);
    }

    addPressLoad() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueRect, "rect");
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueCircle, "circle");
        this.offButton(this.currentValueSelect, "select")
        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValLucDoc, "lucDoc");

        this.onOffButton(this.curValPressLoad, "pressLoad");

        this.renderObject(processingData.allObject);
    }

    addLucDoc() {
        this.offButtonDraw(this.currentValueBrush, "brush");
        this.offButtonDraw(this.currentValueSpl, "spl");
        this.offButtonDraw(this.currentValueRect, "rect");
        this.offButtonDraw(this.currentValueLine, "line");
        this.offButtonDraw(this.currentValueCircle, "circle");
        this.offButton(this.currentValueSelect, "select")
        this.offButton(this.curValNamePoint, "valueNamePoint");
        this.offButton(this.curValNameLine, "valueNameLine");
        this.offButton(this.curValNameArea, "valueNameArea");
        this.offButton(this.curValPointLoad, "pointLoad");
        this.offButton(this.curValPressLoad, "pressLoad");

        this.onOffButton(this.curValLucDoc, "lucDoc");

        this.renderObject(processingData.allObject);
    }

    //ID
    addValueNamePoint() {
        if (this.currentValueSelect.value === "On") {
            this.offButtonDraw(this.currentValueBrush, "brush");
            this.offButtonDraw(this.currentValueSpl, "spl");
            this.offButtonDraw(this.currentValueRect, "rect");
            this.offButtonDraw(this.currentValueLine, "line");
            this.offButtonDraw(this.currentValueCircle, "circle");

            this.onOffButton(this.curValLucDoc, "lucDoc");

            if (this.curValNamePoint.value === "On") {
                this.offButton(this.curValNameLine, "valueNameLine");
                this.offButton(this.curValNameArea, "valueNameArea");
                this.offButton(this.curValPointLoad, "pointLoad");
                this.offButton(this.curValPressLoad, "pressLoad");
                this.offButton(this.curValNamePoint, "valueNamePoint");
            }
            // if (inputID !== undefined) {
            //     inputID.destroy();
            // }
        }
    }

    addValueNameLine() {
        if (this.currentValueSelect.value === "On") {
            this.offButtonDraw(this.currentValueBrush, "brush");
            this.offButtonDraw(this.currentValueSpl, "spl");
            this.offButtonDraw(this.currentValueRect, "rect");
            this.offButtonDraw(this.currentValueLine, "line");
            this.offButtonDraw(this.currentValueCircle, "circle");

            this.onOffButton(this.curValNameLine, "valueNameLine");

            if (this.curValNameLine.value === "On") {
                this.offButton(this.curValNamePoint, "valueNamePoint");
                this.offButton(this.curValNameArea, "valueNameArea");
                this.offButton(this.curValPointLoad, "pointLoad");
                this.offButton(this.curValPressLoad, "pressLoad");
                this.offButton(this.curValLucDoc, "lucDoc");
            }

            // if (inputID !== undefined) {
            //     inputID.destroy();
            // }
        }
    }

    addValueNameArea() {
        if (this.currentValueSelect.value === "On") {
            this.offButtonDraw(this.currentValueBrush, "brush");
            this.offButtonDraw(this.currentValueSpl, "spl");
            this.offButtonDraw(this.currentValueRect, "rect");
            this.offButtonDraw(this.currentValueLine, "line");
            this.offButtonDraw(this.currentValueCircle, "circle");

            this.onOffButton(this.curValNameArea, "valueNameArea");


            if (this.curValNameArea.value === "On") {
                this.offButton(this.curValNamePoint, "valueNamePoint");
                this.offButton(this.curValNameLine, "valueNameLine");
                this.offButton(this.curValPointLoad, "pointLoad");
                this.offButton(this.curValPressLoad, "pressLoad");
                this.offButton(this.curValLucDoc, "lucDoc");
            }

            // if (inputID !== undefined) {
            //     inputID.destroy();
            // }
        }
    }

    listenEvent() {
        this.canvas.addEventListener('mousedown', (event) => this.mouseDown(event));
        this.canvas.addEventListener('mouseup', (event) => this.mouseUp(event));
        this.canvas.addEventListener('mousemove', (event) => this.mouseMove(event));
        document.addEventListener('keydown', (event) => this.keyDown(event));
        // this.canvas.addEventListener('mouseDown', (event) => this.changeColorLine(event));
        //up file event
        document.getElementById('openFile').addEventListener('change', function () {
            var fr = new FileReader();
            fr.onload = function () {
                let inputData = JSON.parse(fr.result);
                processingData.prototype.createData(inputData);
            }
            fr.readAsText(this.files[0]);
        });
        //make canvas responsive
        onresize = (event) => {
            PaintIn.canvas.width = document.getElementById("drawing_page").clientWidth;
            PaintIn.canvas.height = document.getElementById("drawing_page").clientHeight;
            PaintIn.renderObject(processingData.allObject);
        }
    }

    getMousePosition(event) {
        let rect = this.canvas.getBoundingClientRect();
        if (this.pen === "brush" || this.pen === "line" || this.pen === "circle" || this.pen === "rect" || this.pen === "spl" || this.pen === "select" || this.curValNamePoint.value === "On" || this.curValNameLine.value === "On" || this.curValNameArea.value === "On" || this.curValPointLoad.value === "On" || this.curValPressLoad.value === "On" || this.curValLucDoc.value === "On") {
            return {
                x: (event.clientX - rect.left),
                y: (event.clientY - rect.top)
            };
        };
    }

    mouseDown(event) {
        this.isPainting = true;
        this.image = new Image;
        this.image.src = this.canvas.toDataURL("image/bmp ", 1.0);
        this.mouseDownPos = this.getMousePosition(event); //start
        this.arrMouseDownPosition.push(this.mouseDownPos);
        this.currentPos = this.getMousePosition(event);

        if (this.currentValueGrid.value == "On" && this.arrGrid.length != 0 && this.currentPos != undefined) {
            // console.log(this.arrGrid.length)
            //choose the nearest mouseDown
            this.arr.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0]);

            if (this.pen === 'line') {
                for (let i = 0; i < this.arr.length; i++) {
                    this.mouseDownPos = this.arr[i];
                }
                this.arrLineX.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0].x);
                this.arrLineY.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0].y);
                this.arrLineColor.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0]);
                this.arrLineWidth.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0]);
                // console.log('arrLine', this.arrLineX)
            };
            if (this.pen === 'circle') {
                this.arrCircleX.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0].x);
                this.arrCircleY.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0].y);
                for (let i = 1; i < this.arr.length; i += 2) {
                    this.mouseDownPos = this.arr[i + 1];
                }
                // console.log('arrCircle', this.arrCircleX)
            };

            if (this.pen === 'rect') {
                this.arrRectX.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0].x);
                this.arrRectY.push(getNearest(this.arrGrid, this.mouseDownPos)[0][0].y);
                for (let i = 1; i < this.arr.length; i += 2) {
                    this.mouseDownPos = this.arr[i + 1];
                }
                this.arrRectColor = this.arrRect;
                // console.log('arrRect', this.arrRectX)
            };

            if (this.pen === 'spl') {
                this.arrSPLX.push(this.mouseDownPos.x);
                this.arrSPLY.push(this.mouseDownPos.y);
                this.drawSPLine();
            };
        }
        else {
            if (this.pen === 'line') {
                this.arrLineX.push(this.mouseDownPos.x);
                this.arrLineY.push(this.mouseDownPos.y);
                this.arrLineColor.push(this.currentColor);
                this.arrLineWidth.push(this.currentWidth);
                // console.log('arrLine', this.arrLineX)
            };

            if (this.pen === 'circle') {
                this.arrCircleX.push(this.mouseDownPos.x);
                this.arrCircleY.push(this.mouseDownPos.y);
                for (let i = 1; i < this.arrMouseDownPosition.length; i += 2) {
                    this.mouseDownPos = this.arrMouseDownPosition[i + 1];
                }
                // console.log('arrCircle', this.arrCircleX)

            };

            if (this.pen === 'rect') {
                this.arrRectX.push(this.mouseDownPos.x);
                this.arrRectY.push(this.mouseDownPos.y);
                for (let i = 1; i < this.arrMouseDownPosition.length; i += 2) {
                    this.mouseDownPos = this.arrMouseDownPosition[i + 1];
                }
            }

            if (this.pen === 'spl') {
                this.arrSPLX.push(this.mouseDownPos.x);
                this.arrSPLY.push(this.mouseDownPos.y);
            }
        };

        //Load
        if (this.curValPointLoad.value === "On" || this.curValPressLoad.value === "On" || this.curValLucDoc.value === "On") {
            if (inputLoad === undefined) {
                //normal last multicurrent obj
                this.renderObject(processingData.allObject);
                //trace obj
                let selectedObj = processingData.allObject.find(obj => obj.isIn([this.currentPos.x, this.currentPos.y]));
                this.arrCurObj[0] = selectedObj;
                if (selectedObj === undefined) {
                    this.renderProperty("off", selectedObj);
                    this.arrCurObj = [];
                    return;
                }
                //render Prop
                switch (selectedObj.className) {
                    case "Point":
                        if (this.curValPointLoad.value === "On") {
                            this.renderProperty("point", selectedObj);
                            this.drawPoint(selectedObj, "green");
                            if (inputLoad === undefined) {
                                inputForce(selectedObj.x, selectedObj.y, selectedObj);
                            }
                        }
                    case "Line":
                        if (this.curValPressLoad.value === "On" || this.curValLucDoc.value === "On") {
                            this.renderProperty("line", selectedObj);
                            this.drawLine(selectedObj.Point[0], selectedObj.Point[1], "#0000ff", selectedObj.width);
                            if (inputLoad === undefined) {
                                let xM1 = (selectedObj.Point[1].x - selectedObj.Point[0].x) / 2;
                                let yM1 = (selectedObj.Point[1].y - selectedObj.Point[0].y) / 2;
                                let xBox = 25 / 2;
                                let yBox = 25 / 2;
                                let xM2 = (selectedObj.Point[0].x + xM1) - xBox;
                                let yM2 = (selectedObj.Point[0].y + yM1) - yBox;
                                inputForce(xM2, yM2, selectedObj);
                            }
                        }
                        break;
                }
            }
            return
        }

        //addName
        if (this.pen === "select" && (this.curValNameLine.value === "On" || this.curValNamePoint.value === "On" || this.curValNameArea.value === "On")) {
            if (inputID === undefined) {
                //normal last multicurrent obj
                this.renderObject(processingData.allObject);
                //trace obj
                let selectedObj = processingData.allObject.find(obj => obj.isIn([this.currentPos.x, this.currentPos.y]));
                this.arrCurObj[0] = selectedObj;
                if (selectedObj === undefined) {
                    this.renderProperty("off", selectedObj);
                    this.arrCurObj = [];
                    return;
                }
                //render Prop
                switch (selectedObj.className) {
                    case "Point":
                        if (this.curValNamePoint.value === "On") {
                            this.renderProperty("point", selectedObj);
                            this.drawPoint(selectedObj, "green");
                            if (inputID === undefined) {
                                this.addNamePoint(selectedObj);
                            }
                        }
                    case "Line":
                        if (this.curValNameLine.value === "On") {
                            this.renderProperty("line", selectedObj);
                            this.drawLine(selectedObj.Point[0], selectedObj.Point[1], "#0000ff", selectedObj.width);
                            if (inputID === undefined) {
                                this.addNameLine(selectedObj);
                            }
                        }
                        break;
                    case "Area":
                        if (this.curValNameArea.value === "On") {
                            this.renderProperty("Area", selectedObj);
                            this.fillArea(selectedObj, "#b6d8e7");
                            if (inputID === undefined) {
                                this.addNameArea(selectedObj);
                            }
                        }
                        break;
                }
            }
            return
        }
        //select
        if (this.pen === "select") {
            if (window.event.ctrlKey) {
                //normal last current obj
                if (this.arrCurObj[0] instanceof Line) {
                    this.drawLine(this.arrCurObj[0].Point[0], this.arrCurObj[0].Point[1], this.arrCurObj[0].color);
                } else if ((this.arrCurObj[0] instanceof Area)) {
                    this.fillArea(this.arrCurObj[0]);
                } else if ((this.arrCurObj[0] instanceof Point)) {
                    this.drawPoint(this.arrCurObj[0]);
                };
                //turn off single mode
                this.arrCurObj = [];
                //trace obj
                let selectedObj = processingData.allObject.find(obj => obj.isIn([this.currentPos.x, this.currentPos.y]));
                if (selectedObj === undefined) return;
                if (this.arrMultiCurObj.indexOf(selectedObj) !== -1) {
                    this.arrMultiCurObj.splice(this.arrMultiCurObj.indexOf(selectedObj), 1);
                    switch (selectedObj.className) {
                        case "Point":
                            this.drawPoint(selectedObj);
                            break
                        case "Line":
                            this.drawLine(selectedObj.Point[0], selectedObj.Point[1], selectedObj.color, selectedObj.width);
                            break;
                        case "Area":
                            this.fillArea(selectedObj);
                            break;
                    }
                } else {//add
                    this.arrMultiCurObj.push(selectedObj);
                    //highlight obj
                    switch (selectedObj.className) {
                        case "Point":
                            this.drawPoint(selectedObj, "green");
                            //
                            break
                        case "Line":
                            this.drawLine(selectedObj.Point[0], selectedObj.Point[1], "#0000ff", selectedObj.width);
                            //
                            break;
                        case "Area":
                            this.fillArea(selectedObj, "#b6d8e7");
                            //
                            break;
                    }
                }
                //render prop
                if (this.arrMultiCurObj.length !== 0) {
                    this.renderProperty("multi", this.arrMultiCurObj);
                } else {
                    this.renderProperty("off", this.arrMultiCurObj);
                }
            } else {
                //normal last multicurrent obj
                this.renderObject(processingData.allObject);
                //turn off multi mode
                this.arrMultiCurObj = [];
                //trace obj
                let selectedObj = processingData.allObject.find(obj => obj.isIn([this.currentPos.x, this.currentPos.y]));
                if (selectedObj === undefined) {
                    this.renderProperty("off", selectedObj);
                    this.arrCurObj = [];
                    return;
                }
                if (JSON.stringify(this.arrCurObj[0]) === JSON.stringify(selectedObj)) {
                    this.renderProperty("off", selectedObj);
                    this.arrCurObj = [];
                } else {
                    this.arrCurObj[0] = selectedObj;
                    //render Prop
                    switch (selectedObj.className) {
                        case "Point":
                            this.renderProperty("point", selectedObj);
                            this.drawPoint(selectedObj, "green");
                            //
                            // if (this.curValNamePoint.value === "On") {
                            //     if (inputID !== undefined && inputID.value() === '') {
                            //         inputID.destroy();
                            //     }
                            //     this.addNamePoint(selectedObj);
                            // }
                            break
                        case "Line":
                            this.renderProperty("line", selectedObj);
                            this.drawLine(selectedObj.Point[0], selectedObj.Point[1], "#0000ff", selectedObj.width);
                            //
                            // if (this.curValNameLine.value === "On") {
                            //     if (inputID !== undefined && inputID.value() === '') {
                            //         inputID.destroy();
                            //     }
                            //     this.addNameLine(selectedObj);
                            // }
                            break;
                        case "Area":
                            this.renderProperty("area", selectedObj);
                            this.fillArea(selectedObj, "#b6d8e7");
                            break;
                    }
                }
            }
        }

        //get data (need optimize) 
        // Line
        if (this.arrLineX.length >= 2) {
            processingData.prototype.inputRawData(this.pen, this.arrLineX, this.arrLineY);
        };
        // Rect
        // console.log(this.arrRectX);
        if (this.arrRectX.length % 2 === 0 && this.arrRectX.length !== 0) {
            var lastTwoPointX = [this.arrRectX[this.arrRectX.length - 2],
            this.arrRectX[this.arrRectX.length - 1]];
            var lastTwoPointY = [this.arrRectY[this.arrRectY.length - 2],
            this.arrRectY[this.arrRectY.length - 1]];
            processingData.prototype.inputRawData(this.pen, lastTwoPointX, lastTwoPointY);
            //reset
            this.arrRectX = [];
            this.arrRectY = [];
        };
        //----------------------------//
        // if (this.pen === 'circle' || this.pen === 'rect'|| this.pen === 'spl') {
        //     this.undo();
        // }

        // //END Linh config---------------------------------------------------
        //---------------------------------------------------

        // -----------------------------------------
        //        //get data (need optimize)
        //        // Line
        //        if (this.arrLineX.length >= 2) {
        //            processingData.prototype.inputRawData(this.pen, this.arrLineX, this.arrLineY);
        //        };
        //        // Rect
        //        // console.log(this.arrRectX);
        //        if (this.arrRectX.length % 2 === 0 && this.arrRectX.length !== 0) {
        //            var lastTwoPointX = [this.arrRectX[this.arrRectX.length - 2],
        //            this.arrRectX[this.arrRectX.length - 1]];
        //            var lastTwoPointY = [this.arrRectY[this.arrRectY.length - 2],
        //            this.arrRectY[this.arrRectY.length - 1]];
        //            processingData.prototype.inputRawData(this.pen, lastTwoPointX, lastTwoPointY);
        //        }
        //----------------------------//

        //find inters point => add to grid
        let lineList = [...processingData.allLine];
        for (let i = 0; i < lineList.length - 1; i++) {
            var IntersPoint = processingData.prototype.intersectionCheck(lineList[i], lineList[lineList.length - 1]);
            if (IntersPoint.Exist) {
                // console.log("IntersPoint");
                //create Point
                let newPoint = new Point(IntersPoint.Coord);
                //add
                processingData.prototype.addObject(newPoint, processingData.allPoint);
            }
        };

        // add node to arrGrid
        this.addNode();

    }

    addNamePoint(Obj) {
        let xC = Obj.x;
        let yC = Obj.y;
        inputName(xC, yC, Obj);
    }

    addNameLine(Obj) {
        //choose position to display box input
        let xM1 = (Obj.Point[1].x - Obj.Point[0].x) / 2;
        let yM1 = (Obj.Point[1].y - Obj.Point[0].y) / 2;
        let xBox = 25 / 2;
        let yBox = 25 / 2;
        let xM2 = (Obj.Point[0].x + xM1) - xBox;
        let yM2 = (Obj.Point[0].y + yM1) - yBox;
        inputName(xM2, yM2, Obj);
    }

    addNameArea(Obj) {
        //    choose position to display box input
        let xC = Obj.Center[0];
        let yC = Obj.Center[1];
        inputName(xC, yC, Obj);
    }

    getAngleLineAndOx(line) {
        //d1: Ox
        //d2: line
        //alpha: radian , (0,180)
        let u1 = { x: 1, y: 0 };
        let u2 = { x: line.Point[1].x - line.Point[0].x, y: line.Point[1].y - line.Point[0].y };
        return Math.acos((u1.x * u2.x + u1.y * u2.y) / (Math.sqrt(Math.pow(u1.x, 2) + Math.pow(u1.y, 2)) * Math.sqrt(Math.pow(u2.x, 2) + Math.pow(u2.y, 2))));
    }

    drawText(Obj, text) {
        this.ctx.save();
        this.ctx.font = "18px Arial";

        // this.ctx.textAlign = "center";
        try {
            //Line
            this.ctx.fillStyle = "red";
            let alpha1 = this.getAngleLineAndOx(Obj) * 180 / Math.PI;

            if ((alpha1 > 90) && (alpha1 <= 180)) {
                let l = Obj.Point[0];
                Obj.Point[0] = Obj.Point[1];
                Obj.Point[1] = l;
            };

            let dx = Obj.Point[1].x - Obj.Point[0].x;
            let dy = Obj.Point[1].y - Obj.Point[0].y;
            let alpha = Math.atan2(dy, dx); //radians

            //move the center of canvas to  (line.Point[0].x + line.Point[1].x) / 2, (line.Point[0].y + line.Point[1].y) / 2 
            this.ctx.translate((Obj.Point[0].x + Obj.Point[1].x) / 2, (Obj.Point[0].y + Obj.Point[1].y) / 2);
            //rotate text
            this.ctx.rotate(alpha);
            //after move, hold the position
            this.ctx.fillText(text, 0, -10);
            this.ctx.restore();
            // console.log(alpha * 180 / Math.PI)
        }
        catch (error) {
            try {
                //Area
                this.ctx.fillStyle = "blue";
                let xC = Obj.Center[0];
                let yC = Obj.Center[1];
                this.ctx.fillText(text, xC, yC);
            }
            catch (error) {
                // Point
                this.ctx.fillStyle = "green";
                let alpha = Math.PI / 4;
                let xC = Obj.x - 5 * (1 + Math.cos(alpha));
                let yC = Obj.y - 5 * (1 + Math.cos(alpha));
                this.ctx.fillText(text, xC, yC);
            }
            this.ctx.restore();
        }
    }

    getPointOffset(point1, point2, offsetPoint) {
        //co offsetPoint de vecto chi phuong u = const
        let a = point2.x - point1.x;
        let b = point2.y - point1.y;

        let u = { x: a, y: b };
        let t = Math.sqrt(10 * 10 / (a * a + b * b))
        return { x: offsetPoint.x - u.y * t, y: offsetPoint.y + u.x * t };
    }

    //point 2 of force vecto
    getPoint2ndOfPress(point1, point2, pointAddForce) {
        // 2 -1 : nen, 1-2 keo
        
        let a = point1.x - point2.x;
        let b = point1.y - point2.y;
        let u;
        u = { x: a, y: b };//perpendicular

        let t = Math.sqrt(35 * 35 / (a * a + b * b))
        return { x: pointAddForce.x - u.y * t, y: pointAddForce.y + u.x * t };
    }

    getPoint2ndOfLucDoc(point1, point2, pointAddForce) {
        // 2 -1 : nen, 1-2 keo
        let a = point1.x - point2.x;
        let b = point1.y - point2.y;
        let u;
        u = { x: -b, y: a }; //parallel

        let t = Math.sqrt(35 * 35 / (a * a + b * b))
        return { x: pointAddForce.x - u.y * t, y: pointAddForce.y + u.x * t };
    }

    getPointInLinePress(point1, point2, lenghtLine) {
        //neu co luc doc, point 1 => use get point2 offet = 5
        let listPoint = [];
        let a = point2.x - point1.x;
        let b = point2.y - point1.y;
        let u = { x: a, y: b };
        //set distance of 2 point
        let distance = lenghtLine;
        if (lenghtLine >= 50) {
            while (distance > 50) {
                distance /= 2;
            }
        }
        else {
            distance = lenghtLine / 2;
        };
        let delta = lenghtLine / distance;

        //isParallel Ox or Oy => point 2 follow u
        let maxT = Math.abs((point2.x - point1.x) / a);
        //Oy
        if (maxT !== 1) {
            maxT = Math.abs((point2.y - point1.y) / b);
        }
        //get list Point in line with distance set
        let t = [];
        for (let i = 0; i < maxT; i += maxT / delta) {
            t.push(i);
        }
        t.push(maxT);

        for (let i in t) {
            let arr = { x: point1.x + u.x * t[i], y: point1.y + u.y * t[i] }
            listPoint.push(arr)
        }

        return listPoint;
    }

    getPointInLineLucDoc(point1, point2, lenghtLine) {
        //neu co luc doc, point 1 => use get point2 offet = 5
        let listPoint = [];
        let a = point2.x - point1.x;
        let b = point2.y - point1.y;
        let u = { x: a, y: b };
        //set distance of 2 point
        let distance = lenghtLine;
        if (lenghtLine >= 50) {
            while (distance > 50) {
                distance /= 2;
            }
        }
        else {
            distance = lenghtLine / 2;
        };
        let delta = lenghtLine / distance;

        //isParallel Ox or Oy => point 2 follow u
        let maxT = Math.abs((point2.x - point1.x) / a);
        //Oy
        if (maxT !== 1) {
            maxT = Math.abs((point2.y - point1.y) / b);
        }
        //get list Point in line with distance set
        let t = [];
        for (let i = 0; i < maxT; i += maxT / delta) {
            t.push(i);
        }

        for (let i in t) {
            let arr = { x: point1.x + u.x * t[i], y: point1.y + u.y * t[i] }
            listPoint.push(arr)
        }

        return listPoint;
    }

    mouseUp(event) {
        this.isPainting = false;
        this.isCancled = true;
    }

    mouseMove(event) {
        let mouseMovePos = this.getMousePosition(event);
        this.currentMouseMovePos = this.getMousePosition(event);
        if (this.pen === "brush" || this.pen === "line" || this.pen === "circle" || this.pen === "rect" || this.pen === "spl" || this.pen === "select" || this.curValNamePoint.value === "On" || this.curValNameLine.value === "On" || this.curValNameArea.value === "On" || this.curValPointLoad.value === "On" || this.curValPressLoad.value === "On" || this.curValLucDoc.value === "On") {
            //display coord
            document.getElementById("display_coord").innerHTML = [this.currentMouseMovePos.x, this.currentMouseMovePos.y];
            //
        };

        if (this.currentValueGrid.value == "On" && this.arrGrid.length != 0 && this.currentPos != undefined) {

            this.arrMove.push(getNearest(this.arrGrid, this.currentPos)[0][0]);

            if (this.pen != 'brush') {
                for (var i = 0; i < this.arrMove.length; i++) {
                    this.currentPos = this.arrMove[i];
                }
            }
        }

        // not link position of start and end point
        if (this.isPainting) {
            // brush
            if (this.pen === 'brush') {
                this.drawBrush(
                    this.currentPos,
                    this.currentMouseMovePos
                );
            };
        };

        //line link start and end node
        if (this.pen === 'line') {

            if (!this.isCancled) {
                return
            };
            this.undo();
            this.drawLine
                (
                    this.mouseDownPos,
                    this.currentPos
                );
        };

        if (this.pen === 'rect') {
            if (!this.isCancled) {
                return
            };
            this.undo();
            this.drawRect
                (
                    this.mouseDownPos,
                    this.currentPos
                );

        };
        if (this.pen === 'circle') {
            if (!this.isCancled) {
                return
            };
            this.undo();
            this.drawCicle
                (
                    this.mouseDownPos,
                    this.currentPos
                );
        };

        if (this.pen === 'spl') {
            if (!this.isCancled) {
                return
            };
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // vo hieu hoa this.undo()
            let arrXs = [...this.arrSPLX]
            arrXs.push(this.currentPos.x)
            let arrYs = [...this.arrSPLY]
            arrYs.push(this.currentPos.y)
            console.log("X", arrXs)
            console.log("Y", arrYs)
            this.drawSPLine(arrXs, arrYs);
        }



        if (this.pen === 'select') {
            // //trace area
            // //need optimize
            // for (let area of processingData.allArea) {
            //     if (area.areaTouch([this.currentMouseMovePos.x,this.currentMouseMovePos.y])) {
            //         this.renderProperty("area",area);
            //         this.fillArea(area,"#b6d8e7");
            //         return;
            //     } else {
            //         this.fillArea(area);
            //         this.renderProperty("off",area);
            //     };
            // };

        }

        this.currentPos = mouseMovePos;
    }

    drawPoint(point, color = "red") {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 3.5, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();
    }

    drawBrush(start, end) {
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentWidth;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawLine(start, end, color = this.currentColor, width = this.currentWidth) {
        if (start != undefined) {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    drawRect(start, end, color = this.currentColor, width = this.currentWidth) {
        if (start != undefined) {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            this.ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
            this.ctx.stroke();
            this.ctx.closePath();
        };
    }

    drawCicle(start, end, width = this.currentWidth) {
        if (start != undefined) {
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            let r = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
            this.ctx.arc(start.x, start.y, r, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }

    gradient(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }

    drawSPLine(arrXs, arrYs, color = this.currentColor, width = this.currentWidth) {
        console.log(arrXs, arrYs);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        let [arrX, arrY] = processingData.prototype.InterPolationFunction(arrXs, arrYs);
        this.ctx.beginPath();
        this.ctx.moveTo(arrX[0], arrY[0]);
        for (let i = 1; i <= arrX.length - 1; i++) {
            this.ctx.lineTo(arrX[i], arrY[i]);
        }
        this.ctx.stroke();
    }

    drawForce(fromx, fromy, tox, toy, color, lineWidth) {
        let headlen = 15; // length of head in pixels
        let dx = tox - fromx;
        let dy = toy - fromy;
        let angle = Math.atan2(dy, dx);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        //vecto n
        this.ctx.moveTo(fromx, fromy);
        this.ctx.lineTo(tox, toy);
        // arrow
        this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(tox, toy);
        this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawForceInPoint(Obj, color = "#063970", lineWidth = 1) {
        //alpha = input;
        //get vecto u of Line 
        let endPointX = { x: Obj.x + 35, y: Obj.y }; // parallel Ox u = {x:1, y:0}
        let endPointY = { x: Obj.x, y: Obj.y + 35 }; // parallel Oy u = {x:0, y:1}
        this.drawForce(Obj.x, Obj.y, endPointX.x, endPointX.y, color, lineWidth);
        this.drawForce(Obj.x, Obj.y, endPointY.x, endPointY.y, color, lineWidth);
    }

    drawForceInLine(Obj, color = "red", lineWidth = 1) {
        let startPoint = this.getPointInLinePress(Obj.Point[0], Obj.Point[1], Obj.length, Obj); //array
        for (let i = 0; i < startPoint.length; i++) {
            let endPoint = this.getPoint2ndOfPress(Obj.Point[0], Obj.Point[1], startPoint[i]);
            this.drawForce(startPoint[i].x, startPoint[i].y, endPoint.x, endPoint.y, color, lineWidth);
        }
    }

    drawLucDoc(Obj, color = "blue", lineWidth = 1) {
        let pointOffsetStart = this.getPointOffset(Obj.Point[0], Obj.Point[1], Obj.Point[0]);
        let pointOffsetEnd = this.getPointOffset(Obj.Point[0], Obj.Point[1], Obj.Point[1]);
        let start = this.getPointInLineLucDoc(pointOffsetStart, pointOffsetEnd, Obj.length, Obj); //array
        for (let i = 0; i < start.length; i++) {
            let endPoint = this.getPoint2ndOfLucDoc(Obj.Point[0], Obj.Point[1], start[i]);
            this.drawForce(start[i].x, start[i].y, endPoint.x, endPoint.y, color, lineWidth);
        }
    }

    addNode() {
        let arrAllPoint = [];
        processingData.allPoint.forEach((value) => arrAllPoint.push({ x: value.x, y: value.y }));
        this.arrRecordNode = arrAllPoint;

        // console.log(processingData.allPoint)
        // console.log(this.arrGrid.length)
        // console.log(this.arrRecordNode)

    }

    removeDuplicates(chars) {
        let uniqueChars = [];
        chars.forEach((c) => {
            if (!uniqueChars.includes(c)) {
                uniqueChars.push(c);
            }
        });
        return uniqueChars;
    }

    getNodePos() {
        var delta = Number(this.deltaGrid);
        // var arrGrid = [];
        for (var i = 0; i <= this.canvas.width; i += delta / 2) {
            for (var j = 0; j <= this.canvas.height; j += delta / 2) {
                var arr = { x: i, y: j };
                this.arrGrid.push(arr)
            }
        };
    }

    drawGrid() {
        var delta = Number(this.deltaGrid);
        this.ctx.beginPath();
        for (var i = 0; i <= this.canvas.width; i += delta / 2) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
        };
        for (var j = 0; j <= this.canvas.height; j += delta / 2) {
            this.ctx.moveTo(0, j);
            this.ctx.lineTo(this.canvas.width, j);
        };
        // this.ctx.strokeStyle = 'grey';
        this.ctx.lineWidth = 0.2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    displayGridVal() {
        var deltaGrid = document.getElementById("sizeGrid");
        deltaGrid.oninput = function () {
            output.innerHTML = this.value;
        };
        var output = document.getElementById("demo");
        if (this.currentValueGrid.value == "On") {
            output.innerHTML = deltaGrid.value;
        }
        else {
            output.innerHTML = '';
        }
    }

    //------------------//
    renderObject(arrObj) {
        //clear screen before render
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //
        if (this.currentValueGrid.value === "On") {
            this.ctx.strokeStyle = 'grey';
            this.drawGrid();
        }
        let arrPress = [...arrObj];
        let arrLucDoc = [...arrObj];
        for (let i = arrObj.length - 1; i >= 0; i--) {
            if (arrObj[i] instanceof Area) {
                this.fillArea(arrObj[i]);
                if (arrObj[i].name !== undefined) {
                    this.drawText(arrObj[i], arrObj[i].name);
                }
            }
            else if (arrObj[i] instanceof Line) {
                this.drawLine(arrObj[i].Point[0],
                    arrObj[i].Point[1], arrObj[i].color, arrObj[i].width);
                if (arrObj[i].name !== undefined) {
                    this.drawText(arrObj[i], arrObj[i].name);
                }
                if (arrObj[i].force !== undefined) {
                    this.drawForceInLine(arrPress[i]);
                }
                if (arrObj[i].lucDoc !== undefined) {
                    this.drawLucDoc(arrLucDoc[i]);
                }
            }
            else if (arrObj[i] instanceof Point) {
                this.drawPoint(arrObj[i]);
                if (arrObj[i].name !== undefined) {
                    this.drawText(arrObj[i], arrObj[i].name);
                }
                if (arrObj[i].force !== undefined) {
                    this.drawForceInPoint(arrObj[i]);
                }
            }
        }
    }
    deleteCurObj() {
        this.isCancled = false;
        for (let Obj of this.arrCurObj) {
            if (Obj.className === "Point") {
                processingData.allPoint.splice(processingData.allPoint.indexOf(Obj), 1)//delete in allPoint
            } else if (Obj.className === "Line") {
                processingData.allLine.splice(processingData.allLine.indexOf(Obj), 1)//delete in allLine
            } else if (Obj.className === "Area") {
                processingData.allArea.splice(processingData.allArea.indexOf(Obj), 1)//delete in allArea
            }
        }
        this.arrCurObj = [];
        for (let Obj of this.arrMultiCurObj) {
            if (Obj.className === "Point") {
                processingData.allPoint.splice(processingData.allPoint.indexOf(Obj), 1)//delete in allPoint
            } else if (Obj.className === "Line") {
                processingData.allLine.splice(processingData.allLine.indexOf(Obj), 1)//delete in allLine
            } else if (Obj.className === "Area") {
                processingData.allArea.splice(processingData.allArea.indexOf(Obj), 1)//delete in allArea
            };
        };
        this.arrMultiCurObj = [];
        //update storage
        processingData.prototype.updateStorage();
        //update screen
        this.renderObject(processingData.allObject);
        this.renderProperty("off", "");

    }
    renderProperty(mode, Obj) {
        switch (mode) {
            case "point":
                document.getElementById("property").innerHTML = (`
                <p id="property_label">Properties</p>
                <div>
                    <p>x
                    </p>
                    <div>${math.round(Obj.x, 2)}
                    </div>
                </div>
                <div>
                    <p>y
                    </p>
                    <div>${math.round(Obj.y, 2)}
                    </div>
                </div>
                <div>
                <p>Name</p>
                <div>${Obj.name}
                </div>
            </div>
                `);
                break;
            case "line":
                document.getElementById("property").innerHTML = (`
                <p id="property_label">Properties</p>
                <div>
                    <p>Point 1
                    </p>
                    <div>[${math.round(Obj.Point[0].x, 2)},${math.round(Obj.Point[0].y, 2)}]
                    </div>
                </div>
                <div>
                    <p>Point 2
                    </p>
                    <div>[${math.round(Obj.Point[1].x, 2)},${math.round(Obj.Point[1].y, 2)}]
                    </div>
                </div>
                <div>
                    <p>Length
                    </p>
                    <div>${math.round(Obj.length, 2)}
                    </div>
                </div>
                <div>
                    <p>Line
                    </p>
                    <div>1
                    </div>
                </div>
                <div>
                    <p>Name</p>
                    <div>${Obj.name}
                </div>
                `);
                break;
            case "off":
                document.getElementById("property").innerHTML = (`
                <p id="property_label">Properties</p>
                `);
                break;
            case "multi":
                document.getElementById("property").innerHTML = (`
                <p id="property_label">Properties</p>
                <div>
                    <p>Object
                    </p>
                    <div>${Obj.length}
                    </div>
                </div>
                `);
                break;
            case "area":
                document.getElementById("property").innerHTML = (`
                <p id="property_label">Properties</p>
                <div>
                    <p>Area
                    </p>
                    <div>${math.round(Obj.Area, 2)}
                    </div>
                </div>
                <div>
                    <p>Center
                    </p>
                    <div>[${math.round(Obj.Center, 2)}]
                    </div>
                </div>
                <div>
                    <p>Perimeter
                    </p>
                    <div>${math.round(Obj.Perimeter, 2)}
                    </div>
                </div>
                <div>
                    <p>Sides
                    </p>
                    <div>${Obj.Line.length}
                    </div>
                </div>
                <div>
                    <p>Name</p>
                    <div>${Obj.name}
                </div>
                `);
                break;
        };
    }

    //--------------------------------

    fillArea(AreaObj, fillColor = "#ebf9ff") {
        //vector n
        let allVectn = [];
        for (let i = 0; i <= AreaObj.PointFlow.length - 2; i++) {
            let vectu = math.subtract(AreaObj.PointFlow[i + 1], AreaObj.PointFlow[i]);
            vectu = math.divide(vectu, math.norm(vectu));
            //
            let vectn = [-vectu[1], vectu[0]]
            //
            let point1 = math.add(AreaObj.PointFlow[i], math.multiply(vectn, 10e-5));
            let point2 = math.add(AreaObj.PointFlow[i + 1], math.multiply(vectn, 10e-5))
            let center = math.add(point1, math.divide(math.subtract(point2, point1), 2));
            if (AreaObj.isIn(center)) {
                allVectn.push(vectn);
            } else {
                vectn = [vectu[1], -vectu[0]];
                allVectn.push(vectn)
            }
        }
        //offset line
        let newLines = [];
        for (let i = 0; i <= AreaObj.PointFlow.length - 2; i++) {
            let point1 = math.add(AreaObj.PointFlow[i], math.multiply(allVectn[i], this.currentWidth / 2));
            let point2 = math.add(AreaObj.PointFlow[i + 1], math.multiply(allVectn[i], this.currentWidth / 2));

            let vectu = math.subtract(point2, point1);
            vectu = math.divide(vectu, math.norm(vectu));

            point1 = math.add(point1, math.multiply(vectu, -10e4));
            point2 = math.add(point2, math.multiply(vectu, 10e4));
            let undefineArr = Array(2).fill(undefined);
            let allPoint = processingData.prototype.createPoint([point1[0], point2[0]], [point1[1], point2[1]], undefineArr, undefineArr);
            let newLine = processingData.prototype.createLine(allPoint, undefineArr, undefineArr, undefineArr, undefineArr);
            newLines.push(...newLine);
        }
        //find new intersection point
        let newIntersPoints = [];
        for (let i = 0; i <= newLines.length - 1; i++) {
            if (i === newLines.length - 1) {
                let IntersPoint = processingData.prototype.intersectionCheck(newLines[i], newLines[0]);
                newIntersPoints.push(IntersPoint.Coord);
            } else {
                let IntersPoint = processingData.prototype.intersectionCheck(newLines[i], newLines[i + 1]);
                if (IntersPoint.Exist) {
                    newIntersPoints.push(IntersPoint.Coord);
                }
            }
        };
        //create path
        this.ctx.beginPath();
        this.ctx.moveTo(newIntersPoints[0][0], newIntersPoints[0][1]);
        for (let i = 1; i <= newIntersPoints.length - 1; i++) {
            this.ctx.lineTo(newIntersPoints[i][0], newIntersPoints[i][1]);
        }
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
    }
};

const PaintIn = new Paint();


