'use strict';

class GlobalSvg {
    DONE = 0;
    _inited = false;
    REMOVE = 1;
    RETURN = 2;
    scale = 1;

    createDom() {
        if (this.inited) return;

        //document attached element not removed by angular
        $('#globalSvgSurface').remove();
        $('#globalSvg').remove();

        var body = $('body');
        this._container = Entry.Dom('div', {
            classes: ['globalSvgSurface', 'entryRemove'],
            id: 'globalSvgSurface',
            parent: body,
        });

        this.svgDom = Entry.Dom(
            $(
                '<svg id="globalSvg" width="1" height="1"' +
                    'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'
            ),
            { parent: this._container }
        );

        this.svg = Entry.SVG('globalSvg');
        this.svgPoint = this.svg.createSVGPoint();
        this.left = 0;
        this.top = 0;
        this._inited = true;
    }

    setView(view, mode) {
        if (view == this._view) return;
        var data = view.block || view;
        if (data.isReadOnly() || !view.movable) return;
        this._view = view;
        this._mode = mode;
        if (mode !== Entry.Workspace.MODE_VIMBOARD) {
            view.set({ visible: false });
        }

        this.draw();
        this.show();
        this.align();
        this.position();
        return true;
    }

    setComment(view, mode) {
        if (view == this._view || view.readOnly || !view.movable) {
            return;
        }
        this._view = view;
        this._mode = mode;
        if (mode !== Entry.Workspace.MODE_VIMBOARD) {
            view.set({ visible: false });
        }
        this.draw();
        this.show();
        this.align();
        this.commentPosition();
    }

    draw() {
        var that = this;
        var blockView = this._view;
        if (this._svg) this.remove();
        var isVimMode = this._mode == Entry.Workspace.MODE_VIMBOARD;
        // ISSUE: 배율 변경시 좌표 틀어짐 발생
        // var bBox = blockView.svgGroup.getBBox();
        // this.svgDom.attr({
        //     width: Math.round(bBox.width + 4) + 'px',
        //     height: Math.round(bBox.height + 4) + 'px',
        // });

        this.svgGroup = Entry.SVG.createElement(blockView.svgGroup.cloneNode(true), { opacity: 1 });
        if(!(blockView instanceof Entry.Comment)) {
            const comment = blockView.getComment();
            if(comment) {
                const commentSvgGroup = Entry.SVG.createElement(comment.svgGroup.cloneNode(true), { opacity: 1 });
                console.log(blockView.svgGroup.getCTM(), commentSvgGroup.getCTM());
                const blockGroup = blockView.svgGroup.getCTM();
                const commentGroup = commentSvgGroup.getCTM();
                $(commentSvgGroup).css({
                    transform: `scale(${this.scale}) translate3d(${commentGroup.e - blockGroup.e}px,${commentGroup.f - blockGroup.f}px, 0px)`,
                });
                this.svgGroup.appendChild(commentSvgGroup);
            }
        }
        this.svg.appendChild(this.svgGroup);
        //TODO selectAll function replace
        if (isVimMode) {
            var svg = $(this.svgGroup);

            svg.find('g').css({ filter: 'none' });

            svg.find('path, rect, polygon').velocity(
                {
                    opacity: 0,
                },
                {
                    duration: 500,
                }
            );

            svg.find('text').velocity(
                {
                    fill: '#000000',
                },
                {
                    duration: 530,
                }
            );
        }
    }

    remove() {
        if (!this.svgGroup) return;
        this.svgGroup.remove();
        delete this.svgGroup;
        delete this._view;
        delete this._offsetX;
        delete this._offsetY;
        delete this._startX;
        delete this._startY;
        this.hide();
    }

    align() {
        let offsetX = 0;
        let offsetY = 0;
        if (this._view.getSkeleton) {
            offsetX = this._view.getSkeleton().box(this._view).offsetX || 0;
            offsetY = this._view.getSkeleton().box(this._view).offsetY || 0;
        }
        offsetX *= -1;
        offsetX += 1;
        offsetY *= -1;
        offsetY += 1;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        const transform = `translate(${offsetX}, ${offsetY})`;
        this.svgGroup.attr({ transform: transform });
    }

    show() {
        this._container.removeClass('entryRemove');
    }

    hide() {
        this._container.addClass('entryRemove');
    }

    position() {
        var blockView = this._view;
        if (!blockView) return;
        var pos = blockView.getAbsoluteCoordinate();
        var offset = blockView.getBoard().offset();
        this.left = pos.scaleX + (offset.left / this.scale - this._offsetX);
        this.top = pos.scaleY + (offset.top / this.scale - this._offsetY);
        this._applyDomPos(this.left, this.top);
    }

    commentPosition({startX = 0, startY = 0} = {}) {
        var view = this._view;
        if (!view) return;
        var pos = view.getAbsoluteCoordinate();
        var offset = view.board.offset();
        this.left = pos.scaleX// + (offset.left / this.scale - this._offsetX);
        this.top = pos.scaleY// + (offset.top / this.scale - this._offsetY);
        console.log('commentPosition', this.left, this.top);
        const [comment] = this.svgGroup.getElementsByTagName('rect');
        const [line] = this.svgGroup.getElementsByTagName('line');
        comment.setAttribute('x', this.left);
        comment.setAttribute('y', this.top);
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', this.left + 80);
        line.setAttribute('y2', this.top);
    }

    adjust(adjustX, adjustY) {
        var left = this.left + (adjustX || 0);
        var top = this.top + (adjustY || 0);
        if (left === this.left && top === this.top) return;

        this.left = left;
        this.top = top;
        this._applyDomPos(this.left, this.top);
    }

    _applyDomPos(left, top) {
        this.svgDom.css({
            transform: `scale(${this.scale}) translate3d(${left}px,${top}px, 0px)`,
        });
    }

    terminateDrag(blockView) {
        var mousePos = Entry.mouseCoordinate;
        var board = blockView.getBoard();
        var blockMenu = board.workspace.blockMenu;
        var bLeft = blockMenu.offset().left;
        var bTop = blockMenu.offset().top;
        var bWidth = blockMenu.visible ? blockMenu.svgDom.width() : 0;
        if (mousePos.y > board.offset().top - 20 && mousePos.x > bLeft + bWidth) return this.DONE;
        else if (mousePos.y > bTop && mousePos.x > bLeft && blockMenu.visible) {
            if (!blockView.block.isDeletable()) return this.RETURN;
            else return this.REMOVE;
        } else return this.RETURN;
    }

    addControl(e) {
        this.onMouseDown.apply(this, arguments);
    }

    onMouseDown(e) {
        this._startY = e.pageY;
        var that = this;
        e.stopPropagation();
        e.preventDefault();
        var doc = $(document);
        doc.bind('mousemove.block', onMouseMove);
        doc.bind('mouseup.block', onMouseUp);
        doc.bind('touchmove.block', onMouseMove);
        doc.bind('touchend.block', onMouseUp);
        this._startX = e.pageX;
        this._startY = e.pageY;

        function onMouseMove(e) {
            var newX = e.pageX;
            var newY = e.pageY;
            var dX = newX - that._startX;
            var dY = newY - that._startY;
            var newLeft = that.left + dX;
            var newTop = that.top + dY;
            that._applyDomPos(newLeft, newTop);
            that._startX = newX;
            that._startY = newY;
            that.left = newLeft;
            that.top = newTop;
        }

        function onMouseUp(e) {
            $(document).unbind('.block');
        }
    }

    setScale(scale = 1) {
        this.scale = scale;
    }

    getRelativePoint(matrix) {
        return this.svgPoint.matrixTransform(matrix);
    }
}

Entry.GlobalSvg = new GlobalSvg();
