import { Container } from './Minimap.style';

/** 기능
 * 캔버스에서 실제로 보고 있는 부분을 빨간 네모로 표시
 * 미니맵을 단지 표시 기능으로만
 */

/**
 * 구현방법
 * 캔버스 view bound와 view center를 <Workbench />와 공유.
 * 이럴바엔 그냥 view 정보 전체를 전달. view 정보는 paper.view 임.
 * 그냥 캔버스를 똑같이 그려버림?
 * 캔버스는 <Workbench />, 미니맵은 <RightSidebar />에 있음.
 * 따라서 view 정보를 공유하기 위해선 공통 부모 컴포넌트인 <Annotator />의 state로 둬야 함.
 * view 정보는 <RightSidebar />에 있는 SAM Tool의 detail by zoom 기능에서도 쓰일 거니까
 * <Annotator />의 state로 두고 props로 하위 전달하는 것이 맞다.
 * view 정보를 어디서 생성하든 어찌 됐든 간에 props로 view 정보와 이미지 정보를 받는건 맞으니 props를 설정
 */

/** props
 * view 정보, 이미지 정보
 */

/** state
 * 없음
 */

interface MinimapProps {
  view: paper.View | null;
  image: HTMLImageElement | null;
}

export default function Minimap(props: MinimapProps) {
  return (
    <Container>
      <img
        src={props.image?.src || '/test.png'}
        width={props.image?.width || '200'}
        height={props.image?.height || '200'}
      />
    </Container>
  );
}
