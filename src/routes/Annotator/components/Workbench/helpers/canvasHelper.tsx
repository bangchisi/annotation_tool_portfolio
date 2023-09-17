import React from 'react';

export function onCanvasMouseDown(event: MouseEvent): void {
  console.log('canvas mouse down', event);
  console.log(event.target);
}

export function onCanvasMouseUp(event: MouseEvent): void {
  console.log('canvas mouse up', event);
  console.log(event.target);
}

export function onCanvasDragStart(event: MouseEvent): void {
  console.log('canvas drag start', event);
}

export function onCanvasDragEnd(event: MouseEvent): void {
  console.log('canvas drag end', event);
}

export function onCanvasWheel(event: WheelEvent): void {
  event.preventDefault();
  console.log('canvas wheel', event);
  if (event.ctrlKey) {
    console.log(event.target);
    console.log(event.deltaY);
  }
}
