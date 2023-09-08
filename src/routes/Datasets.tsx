import React from 'react';
import { Link } from 'react-router-dom';

export default function Models() {
  return (
    <div id="datasets">
      <Link to="/dataset/1">dataset 1</Link>
      <Link to="/dataset/2">dataset 2</Link>
      <Link to="/dataset/3">dataset 3</Link>
    </div>
  );
}
