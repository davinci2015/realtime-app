class Canvas {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
    }

    /**
     * Get canvas DOM element
     * @returns {Object}
     */
    getCanvasElement() {
        return this._canvas;
    }

    /**
     * Get canvas size
     * @returns {{width, height}}
     */
    getCanvasSize() {
        return {
            width: this._canvas.width,
            height: this._canvas.height
        };
    }

    /**
     * Start with drawing (on mouse down)
     * @param x {Number}
     * @param y {Number}
     */
    startDrawing(x, y) {
        this._context.lineWidth = 2;
        this._context.shadowBlur = 2;
        this._context.shadowColor = 'rgb(0, 0, 0)';
        this._context.lineJoin = this._context.lineCap = 'round';
        this._context.moveTo(x, y);
    }

    /**
     * Draw (on mouse move)
     * @param x {Number}
     * @param y {Number}
     */
    draw(x, y) {
        this._context.lineTo(x, y);
        this._context.stroke();
    }

    /**
     * Set canvas size
     * @param width {Number}
     * @param height {Number}
     */
    setCanvasSize(width, height) {
        this._canvas.width = width;
        this._canvas.height= height;
    }
}

export default Canvas;