import React from 'react';
import 'assets/css/dataset.css';
import { Link } from 'react-router-dom';

import Sidebar from 'components/Sidebar';

export default function Dataset() {
  return (
    <div id="dataset">
      <Sidebar />
      <div id="dataset-list">
        <Link to="/annotator/1">Image 1</Link>
        <Link to="/annotator/2">Image 2</Link>
        <Link to="/annotator/3">Image 3</Link>
        <Link to="/annotator/4">Image 4</Link>
        <Link to="/annotator/5">Image 5</Link>
      </div>
      <Sidebar />
    </div>
  );
}
