import { Container } from './Explorer.style';
import ImageCard from './ImageCard/ImageCard';

/** 기능
 * 현재 dataset의 모든 이미지 목록을 보여줌
 * 이미지를 클릭하면 해당 이미지를 어노테이션 하러 이동
 */

/**
 * 구현방법
 * mui Image List를 사용해 이미지를 쭉 나열.
 * 현재 dataset의 이미지 목록이 필요할텐데 props로 받아와야 함. dataset 페이지로부터 계속 전달 받아야 한다.
 * 이미지 목록을 map해서 <ImageCard />에 image 정보 props로 전달. key는 datasetId+imageId 정도로.
 * onClick은 어떻게 하지?
 * images type은 any로 해놓고(warning 일부러 띄워서 나중에 고칠 수 있도록) 정해지면 고치자.
 */

/** props
 * 현재 dataset의 이미지 목록: images
 */

/** state
 * 필요 없을듯?
 */

// interface ExplorerProps {
//   images: any[];
// }

// TODO: props: ExplorerProps to Explorer props
export default function Explorer() {
  return (
    <Container>
      <ImageCard />
      <ImageCard />
    </Container>
  );
}
