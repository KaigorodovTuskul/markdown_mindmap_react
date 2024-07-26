import { useState, useRef, useEffect, useCallback } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';
import ButtonPanel from './ButtonPanel';
import './style.scss';
import d3ToPng from 'd3-svg-to-png';

const initValue = '# Header';
const LOCAL_STORAGE_KEY_VALUE = 'savedValue';
const LOCAL_STORAGE_KEY_NAME = 'savedFileName';

export default function MarkmapHooks() {
  const [value, setValue] = useState(initValue);
  const [editableFileName, setEditableFileName] = useState('');
  const caretPosition = useRef(0); 

  const refSvg = useRef<SVGSVGElement>(null);
  const refMm = useRef<Markmap | null>(null);
  const refToolbar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refMm.current) return;

    const mm = Markmap.create(refSvg.current!);
    refMm.current = mm;

    renderToolbar(mm, refToolbar.current!);
  }, []);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;

    const { root } = transformer.transform(value);
    mm.setData(root);
    mm.fit(); 
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, newValue);
    updateMarkmap();
  };

  useEffect(() => {
    const savedValue = localStorage.getItem(LOCAL_STORAGE_KEY_VALUE);
    const savedFileName = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);
    if (savedValue) {
      setValue(savedValue);
    }
    if (savedFileName) {
      setEditableFileName(savedFileName);
    }
    updateMarkmap();
  }, []);

  const updateMarkmap = () => {
    const mm = refMm.current;
    if (!mm) return;

    const { root } = transformer.transform(value);
    mm.setData(root);
    mm.fit(); 
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    try {
      let text = await readFileAsync(file);
      const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
      setValue(text); 
      setEditableFileName(fileNameWithoutExtension); 
      localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, text); 
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, fileNameWithoutExtension); 
      updateMarkmap(); 
    } catch (error) {
      console.error('Failed to read file', error);
    }
  };

  const readFileAsync = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const handleSave = useCallback(() => {
    const safeFileName = (localStorage.getItem(LOCAL_STORAGE_KEY_NAME) && localStorage.getItem(LOCAL_STORAGE_KEY_NAME).trim()) || 'markmap';

    const blob = new Blob([localStorage.getItem(LOCAL_STORAGE_KEY_VALUE)!], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFileName}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }, [value, editableFileName]);

  const saveSvgAsImage = useCallback(async () => {
    const svg = refSvg.current;
    if (!svg) return;
  
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
  
    try {
      // Убедитесь, что d3ToPng правильно настроен и возвращает данные
      const base64Data = await d3ToPng(svg, 'markmap', {
        scale: 3,
        format: 'png',
        quality: 0.9,
        download: false,
        ignore: '.ignored',
        background: '#282832'
      });
  
      // Проверяем, начинается ли строка с data:image/
      if (base64Data.startsWith('data:image/')) {
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = 'markmap.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Полученные данные не являются Base64 URL:', base64Data);
      }
    } catch (error) {
      console.error('Ошибка при конвертации SVG в изображение:', error);
    }
  
    URL.revokeObjectURL(url);
  }, []);
  
  

  const renderToolbar = (mm: Markmap, wrapper: HTMLDivElement) => {
    while (wrapper?.firstChild) wrapper.firstChild.remove();
    if (mm && wrapper) {
      const toolbar = new Toolbar();
  
      toolbar.register({
        id: 'load',
        title: 'Load File',
        content: '| Load from TXT | ',
        onClick: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.txt';
          input.addEventListener('change', handleFileChange);
          input.click();
        },
      });
  
      toolbar.register({
        id: 'save',
        title: 'Save File',
        content: 'Save to TXT',
        onClick: handleSave,
      });
  
      toolbar.register({
        id: 'save-png',
        title: 'Save as PNG',
        content: ' | Save as PNG |',
        onClick: saveSvgAsImage, // Теперь сохраняет как PNG
      });
  
      toolbar.attach(mm);
      toolbar.setBrand(false);
      toolbar.setItems([...Toolbar.defaultItems, 'load', 'save', 'save-png']);
      wrapper.append(toolbar.render());
    }
  };

  const addHeading = () => {
    const lines = value.split('\n');
    const cursorPosition = caretPosition.current;

    let currentLineIndex = 0;
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1;
      if (charCount > cursorPosition) {
        currentLineIndex = i;
        break;
      }
    }

    let lastHeadingLevel = 0;
    for (let i = currentLineIndex; i >= 0; i--) {
      const match = lines[i].match(/^(#+)\s/);
      if (match) {
        lastHeadingLevel = match[1].length;
        break;
      }
    }

    const newHeading = '#'.repeat(lastHeadingLevel || 1) + ' ';
    const newValue = 
      lines.slice(0, currentLineIndex + 1).join('\n') + '\n' + 
      newHeading + 'Header' + '\n' + 
      lines.slice(currentLineIndex + 1).join('\n');
    setValue(newValue);
    localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, newValue); // Update local storage
    caretPosition.current = cursorPosition + newHeading.length + 6;
    updateMarkmap(); // Update markmap
  };

  const addSubHeading = () => {
    const lines = value.split('\n');
    let lastHeadingLevel = 0;

    for (let i = lines.length - 1; i >= 0; i--) {
      const match = lines[i].match(/^(#+)\s/);
      if (match) {
        lastHeadingLevel = match[1].length;
        break;
      }
    }

    const newHeading = '#'.repeat(lastHeadingLevel + 1) + ' ';
    const newValue = value + '\n' + newHeading + 'Subheader';
    setValue(newValue);
    localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, newValue); // Update local storage
    updateMarkmap(); // Update markmap
  };

  const addNode = () => {
    const startPos = caretPosition.current;
    const endPos = caretPosition.current;
    const newValue = value.substring(0, startPos) + ('\n' + '- Node') + value.substring(endPos);
    setValue(newValue);
    localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, newValue); // Update local storage
    caretPosition.current = startPos + ('\n' + '- Node').length;
    updateMarkmap(); // Update markmap
  };

  const addCheckBoxTrue = () => {
    const startPos = caretPosition.current;
    const endPos = caretPosition.current;
    const newValue = value.substring(0, startPos) + ('\n' + '- [x] Checkbox True') + value.substring(endPos);
    setValue(newValue);
    localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, newValue); // Update local storage
    caretPosition.current = startPos + ('\n' + '- [x] Checkbox True').length;
    updateMarkmap(); // Update markmap
  };

  const addCheckBoxFalse = () => {
    const startPos = caretPosition.current;
    const endPos = caretPosition.current;
    const newValue = value.substring(0, startPos) + ('\n' + '- [ ] Checkbox False') + value.substring(endPos);
    setValue(newValue);
    localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, newValue); // Update local storage
    caretPosition.current = startPos + ('\n' + '- [ ] Checkbox False').length;
    updateMarkmap(); // Update markmap
  };

  const svgFontColor = '#ffffff';
  const svgBackgroundColor = '#282832';
  const textareaFontColor = 'var(--green-color)';

  return (
    <div className="app-container">
      <div className="container-wrapper">
        <ButtonPanel onAddHeading={addHeading} onAddNode={addNode} onAddCheckBoxTrue={addCheckBoxTrue} onAddCheckBoxFalse={addCheckBoxFalse} onAddSubHeading={addSubHeading} />
        <div className="textarea-container">
          <div className="file-title">
            <input
              type="text"
              value={editableFileName}
              onChange={(e) => {
                const newFileName = e.target.value;
                setEditableFileName(newFileName);
                localStorage.setItem(LOCAL_STORAGE_KEY_NAME, newFileName); 
              }}
              onBlur={() => {
                setEditableFileName(editableFileName);
                localStorage.setItem(LOCAL_STORAGE_KEY_NAME, editableFileName); 
              }}
              placeholder="Untitled"
              style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--background-color)', color: 'var(--primary-color)'}}
            />
          </div>
          <textarea
            className="w-full h-full border border-gray-400"
            value={value}
            onChange={handleChange}
            onClick={(e) => caretPosition.current = e.target.selectionStart}
            style={{ resize: 'none', backgroundColor: 'var(--background-color)', color: textareaFontColor, caretColor: 'var(--orange-color)'}}
          />
        </div>

        <div className="svg-container">
          <svg
            className="w-full h-full border border-gray-400"
            ref={refSvg}
            style={{ height: '100%', color: svgFontColor, backgroundColor: svgBackgroundColor}}
          />
          <div className="toolbar" 
          ref={refToolbar}></div>
        </div>
      </div>
    </div>
  );
}
