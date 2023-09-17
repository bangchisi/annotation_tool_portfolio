import React from 'react';
import { Link } from 'react-router-dom';

export default function Dataset() {
  return (
    <div id="dataset">
      <div id="controls">controls</div>
      <div id="information">
        <div id="description">description</div>
        <div id="categories">categories</div>
      </div>
      <div id="contents">
        <div id="pagination">pagination</div>
        <div id="dataset-list">
          <Link to="/annotator/1">Image 1</Link>
          <Link to="/annotator/2">Image 2</Link>
          <Link to="/annotator/3">Image 3</Link>
          <Link to="/annotator/4">Image 4</Link>
          <Link to="/annotator/5">Image 5</Link>
        </div>
      </div>
    </div>
  );
}
