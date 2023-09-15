import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import paper from 'paper';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import IconButton from '@mui/material/IconButton';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import SaveIcon from '@mui/icons-material/Save';

import { Annotation, AnnotationType } from 'components/Annotation';
import { CustomTabPanel } from 'components/CustomTabPanel';
import { PreferencesPanel } from 'components/PreferencesPanel';

import {
  onCanvasMouseDown,
  onCanvasMouseUp,
  onCanvasDragStart,
  onCanvasDragEnd,
  onCanvasWheel,
} from 'components/helpers/canvasHelper';

import 'assets/css/annotator.css';

function ToolIcon(props: { toolName: string; iconComponent: any }) {
  // Box, brush, eraser, sam
  return (
    // <ListItem key={props.toolName} disablePadding>
    <Tooltip title={props.toolName} placement="right">
      {/* <ListItemButton> */}
      {/* <ListItemIcon>{props.iconComponent}</ListItemIcon> */}
      <IconButton key={props.toolName}>{props.iconComponent}</IconButton>
      {/* </ListItemButton> */}
    </Tooltip>
    // </ListItem>
  );
}

function LeftSidebarContent() {
  return (
    <Fragment>
      <Toolbar />
      <Box sx={{ pl: 0.5 }}>
        <List>
          <ToolIcon
            toolName="Select"
            iconComponent={<BackHandOutlinedIcon />}
          />
          <ToolIcon toolName="Polygon" iconComponent={<EditOutlinedIcon />} />
          <ToolIcon toolName="Box" iconComponent={<RectangleOutlinedIcon />} />
          <ToolIcon toolName="Brush" iconComponent={<BrushOutlinedIcon />} />
          <ToolIcon
            toolName="Eraser"
            iconComponent={<AutoFixOffOutlinedIcon />}
          />
          <ToolIcon toolName="SAM" iconComponent={<FacebookOutlinedIcon />} />
        </List>
        <Divider />
        <List>
          <ToolIcon toolName="Save" iconComponent={<SaveIcon />} />
        </List>
      </Box>
    </Fragment>
  );
}

function RightSidebarContent() {
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('thing');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  return (
    <Fragment>
      <div id="annotator-controls">
        <Tabs
          id="annotator-tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Annotations"
            id="tab-annotations"
            aria-controls="tabpanel-annotations"
          />
          <Tab
            label="Explorer"
            id="tab-explorer"
            aria-controls="tabpanel-explorer"
          />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <Annotations
            category={category}
            handleChange={handleCategoryChange}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Explorer />
        </CustomTabPanel>
      </div>
      <div id="annotator-preferences">
        <PreferencesPanel />
      </div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        id="annotator-minimap"
      >
        <img src="/test.png" width="200" height="200" />
      </Box>
    </Fragment>
  );
}

function Annotations(props: { category: string; handleChange: any }) {
  interface CategoryType {
    name: string;
    annotations: AnnotationType[];
  }

  // TODO: categories should be 'API response' later
  const categories: CategoryType[] = [
    {
      name: 'thing',
      annotations: [
        {
          id: 1,
          polygon: 1,
        },
        {
          id: 2,
          polygon: 2,
        },
        {
          id: 3,
          polygon: 3,
        },
      ],
    },
    {
      name: 'other',
      annotations: [
        {
          id: 4,
          polygon: 4,
        },
        {
          id: 5,
          polygon: 5,
        },
      ],
    },
    {
      name: 'something',
      annotations: [
        {
          id: 6,
          polygon: 6,
        },
        {
          id: 7,
          polygon: 7,
        },
        {
          id: 8,
          polygon: 8,
        },
      ],
    },
  ];

  return (
    <div id="annotator-annotations">
      <FormControl id="category-dropdown" fullWidth>
        <NativeSelect
          defaultValue={'thing'}
          inputProps={{
            name: 'category',
            id: 'uncontrolled-native',
          }}
          onChange={props.handleChange}
        >
          <option value={'thing'}>thing</option>
          <option value={'other'}>other</option>
          <option value={'something'}>something</option>
        </NativeSelect>
      </FormControl>
      <div id="annotation-list">
        {categories.map((category) => (
          <div key={category.name}>
            {category.name}
            <div className="annotations">
              {category.annotations.map((annotation) => (
                <Annotation
                  key={annotation.id}
                  id={annotation.id}
                  polygon={annotation.polygon}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Explorer() {
  interface ImageType {
    url: string;
    title: string;
  }

  type ImageListType = ImageType[];

  const images: ImageListType = [
    {
      url: 'https://placehold.it/50x50',
      title: 'imaasdqwerfrefgoirehgoirhoige-MIP.png',
    },
    { url: 'https://placehold.it/50x50', title: 'image1-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image2-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image3-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image4-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image5-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image6-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image7-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image8-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image9-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'imasdasdsage-MIP.png' },
  ];

  return (
    <div id="annotator-explorer">
      <ImageList cols={1} gap={20} sx={{ padding: 1 }}>
        {images.map((image) => (
          <Fragment key={image.title}>
            <ImageListItem sx={{ border: 1 }}>
              <img src={image.url} loading="lazy" />
              <ImageListItemBar
                sx={{
                  maxHeight: 50,
                  minHeight: 50,
                }}
                title={image.title}
              />
            </ImageListItem>
          </Fragment>
        ))}
      </ImageList>
    </div>
  );
}

export default function Annotator() {
  const img = new Image();
  img.src = 'https://placehold.it/550x550';
  const $canvas = document.createElement('canvas');

  useEffect(() => {
    console.log('Annotator, useEffect');
    return () => {
      console.log('Annotator, useEffect, clean up');
    };
  }, []);
  // useEffect(() => {
  //   console.log('Annotator useEffect');

  //   const $canvas = document.createElement('canvas');
  //   paper.setup($canvas);
  //   $canvas.onmousedown = onCanvasMouseDown;
  //   $canvas.onmouseup = onCanvasMouseUp;

  //   $canvas.id = 'canvas';

  //   const ctx = $canvas.getContext('2d');
  //   const $workbench = document.getElementById('annotator-workbench');

  //   if ($workbench) {
  //     $canvas.width = $workbench.clientWidth;
  //     $canvas.height = $workbench.clientHeight;
  //     $workbench.appendChild($canvas);

  //     img.addEventListener('load', () => {
  //       $workbench.style.minWidth = img.width + 'px';
  //       $workbench.style.minHeight = img.height + 'px';

  //       ctx?.drawImage(img, 0, 0, img.width, img.height);

  //       $canvas.style.position = 'absolute';
  //       $canvas.style.left = '50%';
  //       $canvas.style.top = '50%';
  //       $canvas.style.transform = 'translate(-50%, -50%)';
  //     });
  //   }

  //   return () => {
  //     $canvas?.remove();
  //     console.log('Annotator useEffect return');
  //   };
  // }, []);

  return (
    <div id="annotator">
      <div id="annotator-left-sidebar">
        <LeftSidebarContent />
      </div>
      <div
        id="annotator-workbench"
        style={{ position: 'relative', overflow: 'hidden' }}
      ></div>
      <div id="annotator-right-sidebar">
        <RightSidebarContent />
      </div>
    </div>
  );
}
