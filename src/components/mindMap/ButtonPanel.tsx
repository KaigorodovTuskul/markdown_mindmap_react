const ButtonPanel = ({ onAddHeading, onAddNode, onAddCheckBoxTrue, onAddCheckBoxFalse, onAddSubHeading}) => {
  return (
    <div className="button-panel">
      <button onClick={onAddHeading}>Add Header</button>
      <button onClick={onAddSubHeading}>Add Subheader</button>
      <button onClick={onAddNode}>Add Node</button>
      <button onClick={onAddCheckBoxTrue}>Add true checkbox</button>
      <button onClick={onAddCheckBoxFalse}>Add false checkbox</button>
    </div>
  );
};

export default ButtonPanel;
