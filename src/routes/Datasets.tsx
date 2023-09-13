import React from 'react';
import { Link } from 'react-router-dom';

import 'assets/css/datasets.css';

import Dropdown from 'components/Dropdown';

function Description() {
  return (
    <div id="description" className="p-1">
      <div>Dataset Name</div>
      <div>created by user_1</div>
      <div>update: 2 hours ago</div>
    </div>
  );
}

function Status() {
  return (
    <div id="status" className="p-1">
      <div id="categories">
        <span>thing</span>
        <span>stuff</span>
        <span>other</span>
      </div>
      <div id="progress">
        <div>loading bar</div>
        <div>% done</div>
      </div>
    </div>
  );
}

function Content(props: { id: number }) {
  return (
    <div
      className="datasets-content m-5 mt-3 mb-1 p-1 rounded-1"
      style={{ border: '1px solid black' }}
    >
      <Link to={'/dataset/' + props.id}>
        <img src="http://placehold.it/100x100" className="p-1" />
      </Link>
      <Description />
      <Status />
      <ul style={{ listStyle: 'none' }} className="p-1">
        menu
        <Dropdown />
      </ul>
    </div>
  );
}

export default function Datasets() {
  // TODO: style dataset-search
  return (
    <div id="datasets" className="pe-5 ps-5">
      <div id="datasets-controls" className="mb-4">
        <div id="datasets-search">
          <button className="btn btn-secondary">Sort by</button>
          <form id="datasets-search-form">
            <input
              type="text"
              className="form-control ms-2 me-2"
              placeholder="Search.."
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
        <button id="btn-add-dataset" className="btn btn-primary p-0">
          +
        </button>
      </div>
      <div id="dataset-list" className="mt-4">
        <Content id={1} />
        <Content id={2} />
        <Content id={3} />
      </div>
    </div>
  );
}
