import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import 'assets/css/datasets.css';

import Dropdown from 'components/Dropdown';

function Description() {
  return (
    <div id="description">
      <div>Dataset Name</div>
      <div>created by user_1</div>
      <div>update: 2 hours ago</div>
    </div>
  );
}

function Status() {
  return (
    <div id="status">
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
    <div className="datasets-content" style={{ border: '1px solid black' }}>
      <Link to={'/dataset/' + props.id}>
        <img src="http://placehold.it/100x100" />
      </Link>
      <Description />
      <Status />
      <ul style={{ listStyle: 'none' }}>
        menu
        <Dropdown />
      </ul>
    </div>
  );
}

export default function Datasets() {
  return (
    <div id="datasets">
      <div id="datasets-controls">
        <div id="datasets-search">
          <button className="btn btn-secondary">Sort by</button>
          <form className="row g-3">
            <div className="col-auto">
              <label htmlFor="inputPassword2" className="visually-hidden">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="inputPassword2"
                placeholder="Password"
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-3">
                Confirm identity
              </button>
            </div>
          </form>
        </div>
        <button id="btn-add-dataset">+</button>
      </div>
      <div id="dataset-list">
        <Content id={1} />
        <Content id={2} />
        <Content id={3} />
      </div>
    </div>
  );
}
