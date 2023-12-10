import { useAppDispatch, useAppSelector } from 'App.hooks';
import { useEffect, useMemo } from 'react';
import {
  selectAuth,
  setBrushRadius,
  setEraserRadius,
} from 'routes/Auth/slices/authSlice';
import { Tool } from 'types';
import { selectAnnotator, setTool } from '../slices/annotatorSlice';
import useManageAnnotation from './useManageAnnotation';

type KeyboardEventHandler = (event: KeyboardEvent) => void;

export const useKeyEvents = () => {
  const dispatch = useAppDispatch();
  const { selectedTool, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);
  const { brushRadius, eraserRadius } = useAppSelector(selectAuth).preference;
  const { createEmptyAnnotation, onClickDeleteButton } = useManageAnnotation();

  const keyEvents = useMemo(
    () => ({
      Space: () => {
        createEmptyAnnotation();
      },
      BracketLeft: () => {
        if (selectedTool === Tool.Brush && brushRadius > 1) {
          dispatch(setBrushRadius(brushRadius - 1));
        } else if (selectedTool === Tool.Eraser && eraserRadius > 1) {
          dispatch(setEraserRadius(eraserRadius - 1));
        }
      },
      BracketRight: () => {
        if (selectedTool === Tool.Brush && brushRadius > 0) {
          dispatch(setBrushRadius(brushRadius + 1));
        } else if (selectedTool === Tool.Eraser && eraserRadius > 0) {
          dispatch(setEraserRadius(eraserRadius + 1));
        }
      },
      Backspace: () => {
        if (!currentCategory || !currentAnnotation) return;
        onClickDeleteButton(
          currentCategory.categoryId,
          currentAnnotation.annotationId,
        );
      },
      KeyS: () => {
        dispatch(setTool(Tool.Select));
      },
      KeyR: () => {
        if (!currentCategory || !currentAnnotation) return;
        dispatch(setTool(Tool.Box));
      },
      KeyB: () => {
        if (!currentCategory || !currentAnnotation) return;
        dispatch(setTool(Tool.Brush));
      },
      KeyE: () => {
        if (!currentCategory || !currentAnnotation) return;
        dispatch(setTool(Tool.Eraser));
      },
      KeyF: () => {
        if (!currentCategory || !currentAnnotation) return;
        dispatch(setTool(Tool.SAM));
      },
    }),
    [
      brushRadius,
      currentAnnotation,
      currentCategory,
      dispatch,
      eraserRadius,
      onClickDeleteButton,
      selectedTool,
      createEmptyAnnotation,
    ],
  );

  useEffect(() => {
    // 이벤트 핸들러 함수를 만드는 팩토리 함수
    const eventHandlerFactory = (
      key: string,
      callback: () => void,
    ): KeyboardEventHandler => {
      return (event: KeyboardEvent) => {
        if (event.code === key) {
          event.preventDefault();
          callback();
        }
      };
    };

    // keydown 이벤트를 등록하는 함수
    const registerKeyEvent = (callback: KeyboardEventHandler) => {
      document.addEventListener('keydown', callback);
    };

    // keydown 이벤트를 해제하는 함수
    const unregisterKeyEvent = (callback: KeyboardEventHandler) => {
      document.removeEventListener('keydown', callback);
    };

    // keyEvents 객체를 이용해 필요한 이벤트 핸들러 함수들을 만듦
    const events = Object.entries(keyEvents).map(([key, callback]) =>
      eventHandlerFactory(key, callback),
    );

    // registerKeyEvent, unregisterKeyEvent, events를 이용해
    // 이벤트 핸들러를 관리하는 함수
    const manageKeyEvent = (
      registrationFunction: (callback: KeyboardEventHandler) => void,
    ) => {
      events.forEach((eventHandler) => {
        registrationFunction(eventHandler);
      });
    };

    manageKeyEvent(registerKeyEvent);
    return () => {
      manageKeyEvent(unregisterKeyEvent);
    };
  }, [keyEvents]);
};
