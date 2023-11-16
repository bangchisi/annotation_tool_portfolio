import { Container } from './Project.style';

interface ProjectProps {
  projectName: string;
}

export default function Project(props: ProjectProps) {
  const { projectName } = props;
  return <Container>{projectName}</Container>;
}
