import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigator() {
  return (
    <header>
      <Link to="/">Annotator v0.1.0</Link>
      <Link to="/datasets">Datasets</Link>
      <Link to="/models">Models</Link>
    </header>
  );
}
