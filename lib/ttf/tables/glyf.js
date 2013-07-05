'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/glyf.htm

var _ = require('lodash');
var jDataView = require('jDataView');
var utils = require('../utils');

function tableSize(font) {
  var result = 4; // table header
  _.forEach(font.glyphs, function (glyph) {
    result += utils.glyphDataLength(glyph);
  });
  return result;
}

function createGlyfTable(font) {

  var buf = new jDataView(tableSize(font));

  _.forEach(font.glyphs, function (glyph) {
    buf.writeInt16(glyph.contours.length); // numberOfContours
    buf.writeInt16(0); // xMin
    buf.writeInt16(0); // yMin
    buf.writeInt16(glyph.width); // xMax
    buf.writeInt16(glyph.height); // yMax

    // Array of end points
    var endPtsOfContours = -1;
    _.forEach(glyph.contours, function (contour) {
      endPtsOfContours += contour.points.length;
      buf.writeInt16(endPtsOfContours);
    });

    buf.writeInt16(0); // instructionLength, is not used here

    // Array of flags
    _.forEach(glyph.contours, function (contour) {
      _.forEach(contour.points, function (point) {
        buf.writeUint8(point.onCurve ? 1 : 0);
      });
    });

    // Array of X coordinates
    _.forEach(glyph.contours, function (contour) {
      _.forEach(contour.points, function (point) {
        buf.writeInt16(point.x);
      });
    });

    // Array of Y coordinates
    _.forEach(glyph.contours, function (contour) {
      _.forEach(contour.points, function (point) {
        buf.writeInt16(point.y);
      });
    });
  });

  return buf;
}

module.exports = createGlyfTable;