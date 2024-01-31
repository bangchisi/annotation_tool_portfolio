// import Explorer from './Explorer/Explorer';
import { Container, TabButton, TabContainer } from './Controls.style';
import Annotations from './Annotations/Annotations';
import { useState } from 'react';

// 컨트롤 패널 컴포넌트
export default function Controls() {
  // 탭 상태
  enum Tab {
    ANNOTATIONS,
    EXPLORER,
  }

  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.ANNOTATIONS); // 선택된 탭

  return (
    <Container>
      <TabContainer>
        {/* 어노테이션 목록 탭 버튼 */}
        <TabButton
          data-selected={selectedTab === Tab.ANNOTATIONS}
          variant="button"
          onClick={() => setSelectedTab(Tab.ANNOTATIONS)}
        >
          Annotations
        </TabButton>
        {/* 이미지 탐색기 탭 버튼 (구현되지 않음) */}
        {/* <TabButton
          data-selected={selectedTab === Tab.EXPLORER}
          variant="button"
          onClick={() => setSelectedTab(Tab.EXPLORER)}
        >
          Explorer
        </TabButton> */}
      </TabContainer>
      {/* selectedTab에 따라 어노테이션 목록 혹은 이미지 탐색기 렌더링 */}
      {selectedTab === Tab.ANNOTATIONS && <Annotations />}
      {/* {selectedTab === Tab.EXPLORER && <Explorer />} */}
    </Container>
  );
}
