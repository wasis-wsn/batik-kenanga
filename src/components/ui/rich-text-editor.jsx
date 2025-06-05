import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Enter content...",
  height = 400,
  preview = 'edit',
  hideToolbar = false,
  visibleDragBar = false,
  className = "",
  ...props 
}) => {
  return (
    <div className={`rich-text-editor ${className}`} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
        preview={preview}
        hideToolbar={hideToolbar}
        visibleDragBar={visibleDragBar}
        data-color-mode="light"
        {...props}
      />
    </div>
  );
};

export default RichTextEditor;
