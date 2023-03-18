import Blocks from "editorjs-blocks-react-renderer";

import { parseEditorJSData } from "@/utils/utils";

interface Props {
  contentJson: string;
}

const RichTextContent: React.FC<Props> = ({ contentJson }) => {
  const data = parseEditorJSData(contentJson);

  if (!data) {
    return null;
  }

  return (
    <article>
      <Blocks data={data} />
    </article>
  );
};

export default RichTextContent;
