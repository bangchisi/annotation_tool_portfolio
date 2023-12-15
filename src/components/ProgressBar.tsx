import { Box, BoxProps, styled } from '@mui/material';

type ContainerProps = {
  progress: number;
  width: number;
  height: number;
  isAnimating?: boolean;
  primarycolor?: string;
  backgroundColor?: string;
  speed?: number;
  vertical?: boolean;
  active?: boolean;
};

const Container = styled(Box)<ContainerProps>`
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);

  --stripe: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  ${({ height, width }) => {
    const size = Math.min(height, width);
    return `--stripe-size: ${size}px ${size}px`;
  }};

  .progress-background {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;

    /* var */
    width: ${(props) => props.width + 'px'};
    height: ${(props) => props.height + 'px'};

    border-radius: 3px;

    /* var */
    background-color: ${(props) =>
      props?.backgroundColor || 'rgba(0, 0, 0, 0.03)'};
  }

  .progress-bar {
    /* var */
    ${({ vertical, progress }) => {
      if (vertical) {
        return {
          width: '100%',
          height: progress + '%',
        };
      } else {
        return {
          height: '100%',
          width: progress + '%',
        };
      }
    }}
    position: absolute;
    bottom: 0;
    background-image: var(--stripe);
    background-size: var(--stripe-size);
    z-index: 0;

    /* var */
    background-color: ${(props) => props?.primarycolor || '#4caf50'};

    ${({ active, speed }) => {
      return active
        ? `
        animation: progress-bar-stripes ${(speed || 2) + 's'}
          linear infinite;
      `
        : '';
    }}
  }

  .text {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex: 1;
    z-index: 1;
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
    letter-spacing: 0.01rem;
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
  }

  @keyframes progress-bar-stripes {
    from {
      background-position: 0 0;
    }
    to {
      background-position: ${({ height, width }) => {
          const size = Math.min(height, width);
          return size + 'px';
        }}
        0;
    }
  }
`;

type ProgressBarProps = {
  progress: number;
  width: number;
  height: number;
  isAnimating?: boolean;
  primarycolor?: string;
  backgroundColor?: string;
  speed?: number;
  vertical?: boolean;
  text?: string;
  active?: boolean;
} & BoxProps;

const ProgressBar = ({
  text,
  vertical,
  progress,
  ...rest
}: ProgressBarProps) => {
  return (
    <Container {...rest} vertical={vertical} progress={progress}>
      <div className="progress-background">
        <div className="progress-bar"></div>
        {!vertical && (
          <span className="text">
            {text === '진행 중' ? progress && progress + '%' : text || ''}
          </span>
        )}
      </div>
    </Container>
  );
};

export default ProgressBar;
