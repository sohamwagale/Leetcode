import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void; // function that return void like "setCode"
  language: string;
}

export default function CodeEditor({
  value,
  onChange, // example setCode
  language
}: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(value) => onChange(value ?? "")}
      theme="vs-dark"
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
}