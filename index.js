#!/usr/bin/env node-canvas
/*jslint indent: 2, node: true */
/*globals requestAnimationFrame: true */
"use strict";

/*
 * Hypnos by Hakim El Hattab (@hakimel, http://hakim.se)
 *
 * Inspired by http://patakk.tumblr.com/post/33304597365
 */
var Canvas = require('openvg-canvas');
var canvas = new Canvas();
var context = canvas.getContext('2d');

var
  width = canvas.width * 0.7,
  height = canvas.height * 0.7,

  radius = Math.min(width, height) * 0.5,

  // Number of layers
  quality = 180,

  // Layer instances
  layers = [],

  // Width/height of layers
  layerSize = radius * 0.25,

  // Layers that overlap to create the infinity illusion
  layerOverlap = Math.round(quality * 0.1);

function initialize() {
  for (var i = 0; i < quality; i++) {
    layers.push({
      x: width / 2 + Math.sin(i / quality * 2 * Math.PI) * (radius - layerSize),
      y: height / 2 + Math.cos(i / quality * 2 * Math.PI) * (radius - layerSize),
      r: (i / quality) * Math.PI
    });
  }

  resize();
  update();
}

function resize() {
  canvas.width = width;
  canvas.height = height;
}

function update() {
  requestAnimationFrame(update);

  step();
  clear();
  paint();
}

// Takes a step in the simulation
function step() {
  for (var i = 0, len = layers.length; i < len; i++) {
    layers[i].r += 0.01;
  }
}

// Clears the painting
function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Paints the current state
function paint() {
  // Number of layers in total
  var layersLength = layers.length;
  var i, len;

  // Draw the overlap layers
  for (i = layersLength - layerOverlap, len = layersLength; i < len; i++) {
    context.save();
    context.globalCompositeOperation = 'destination-over';
    paintLayer(layers[i]);
    context.restore();
  }

  // Cut out the overflow layers using the first layer as a mask
  context.save();
  context.globalCompositeOperation = 'destination-in';
  paintLayer(layers[0], true);
  context.restore();

  // // Draw the normal layers underneath the overlap
  for (i = 0, len = layersLength; i < len; i++) {
    context.save();
    context.globalCompositeOperation = 'destination-over';
    paintLayer(layers[i]);
    context.restore();
  }

}

// Pains one layer
function paintLayer(layer, mask) {
  var size = layerSize + (mask ? 10 : 0);
  var size2 = size / 2;

  context.translate(layer.x, layer.y);
  context.rotate(layer.r);

  // No stroke if this is a mask
  if (!mask) {
    context.strokeStyle = '#000';
    context.lineWidth = 1;
    context.strokeRect(-size2, -size2, size, size);
  }

  context.fillStyle = '#fff';
  context.fillRect(-size2, -size2, size, size);

}

initialize();
