import { useState, useRef, useEffect, useCallback } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';
import ButtonPanel from './ButtonPanel'; 

const initValue = '# Header';
const LOCAL_STORAGE_KEY_VALUE = 'savedValue';
const LOCAL_STORAGE_KEY_NAME = 'savedFileName';

export default function MarkmapHooks() {
  const [value, setValue] = useState(initValue);
  const [editableFileName, setEditableFileName] = useState('');

  const refSvg = useRef();
  const refMm = useRef();
  const refToolbar = useRef();

  useEffect(() => {
    if (refMm.current) return;

    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;

    renderToolbar(refMm.current, refToolbar.current);
  }, []);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;

    const { root } = transformer.transform(value);
    mm.setData(root);
    mm.fit(); 
  }, [value]);

  const handleChange = (e) => {
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

  const handleFileChange = async (e) => {
    let file = e.target.files[0];
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
    }
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const handleSave = useCallback(() => {
    const safeFileName = (localStorage.getItem(LOCAL_STORAGE_KEY_NAME) && localStorage.getItem(LOCAL_STORAGE_KEY_NAME).trim()) || 'markmap';
  
    const blob = new Blob([localStorage.getItem(LOCAL_STORAGE_KEY_VALUE)], { type: 'text/plain' });
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
  
    const safeFileName = (localStorage.getItem(LOCAL_STORAGE_KEY_NAME) && localStorage.getItem(LOCAL_STORAGE_KEY_NAME).trim()) || 'markmap';
  
    let dataUrl;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    dataUrl = URL.createObjectURL(svgBlob);
  
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${safeFileName}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    URL.revokeObjectURL(dataUrl);
  }, [editableFileName]); 

  useEffect(() => {
  }, [editableFileName]);

  const renderToolbar = (mm, wrapper) => {
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
        id: 'save-svg',
        title: 'Save as SVG',
        content: ' | Save to SVG |',
        onClick: saveSvgAsImage, 
      });

      toolbar.attach(mm);
      toolbar.setBrand(false);
      toolbar.setItems([...Toolbar.defaultItems, 'load', 'save', 'save-svg']);
      wrapper.append(toolbar.render());
    }
  };

  const addHeading = () => {
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
    setValue(value + '\n' + newHeading + 'Header');
  };

  const addNode = () => {
    setValue(value + '\n- ' + 'Node');
  };

  const addCheckBoxTrue = () => {
    setValue(value + '\n[x] ' + 'Checkbox True');
  };

  const addCheckBoxFalse = () => {
    setValue(value + '\n[ ] ' + 'Checkbox False');
  };

  const svgFontColor = '#ffffff';
  const svgBackgroundColor = '#282832';
  const textareaFontColor = 'var(--green-color)';

  return (
    <div className="app-container">
      <div className="container-wrapper">
        <ButtonPanel onAddHeading={addHeading} onAddNode={addNode} onAddCheckBoxTrue={addCheckBoxTrue} onAddCheckBoxFalse={addCheckBoxFalse} /> {/* Add the ButtonPanel */}
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
                setFileName(editableFileName);
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
            style={{ resize: 'none', backgroundColor: 'var(--background-color)', color: textareaFontColor}}
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
